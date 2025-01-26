import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { SotorageService } from 'src/app/service/sotorage.service';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';

interface UserData {
  token: string;
  email: string;
  idUsuario?: number;
}

interface Viaje {
  id_viaje: number;
  id_usuario: number;
  ubicacion_origen: string;
  ubicacion_destino: string;
  costo: number;
  id_vehiculo: number;
  id_estado: number;
  fecha_registro: string;
  vehiculo?: {
    marca: string;
    modelo: string;
    patente: string;
  };
  pasajerosDisponibles?: number;
}

interface EstadosMap {
  [key: number]: string;
}

@Component({
  selector: 'app-lista-viajes',
  templateUrl: './lista-viajes.page.html',
  styleUrls: ['./lista-viajes.page.scss'],
  standalone: false,
})
export class ListaViajesPage implements OnInit {
  viajes: Viaje[] = [];
  token: string = '';
  idUsuario: number = 0;
  email: string = '';
  loading: boolean = true;
  error: string | null = null;

  private estados: EstadosMap = {
    1: 'Activo',
    2: 'En Curso',
    3: 'Completado',
    4: 'Cancelado',
  };

  constructor(
    private apiService: ApiService,
    private storage: SotorageService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.loading = true;
      await this.inicializarDatos();
    } catch (error) {
      console.error('Error en ngOnInit:', error);
    } finally {
      this.loading = false;
    }
  }

  async inicializarDatos(): Promise<void> {
    try {
      const userData = await this.storage.obtenerStorage();
      if (!userData) {
        throw new Error('No hay sesión activa');
      }

      const userInfo: UserData = Array.isArray(userData) ? userData[0] : userData;
      this.token = userInfo.token;
      this.email = userInfo.email;

      if (!this.token || !this.email) {
        throw new Error('Datos de sesión incompletos');
      }

      const userResponse = await this.apiService.obtenerUsuario({
        p_correo: this.email,
        token: this.token,
      });

      if (!userResponse?.data?.[0]?.id_usuario) {
        throw new Error('No se pudo obtener el ID del usuario');
      }

      this.idUsuario = userResponse.data[0].id_usuario;
      await this.cargarViajes();
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : 'Error al cargar los datos';
      await this.mostrarAlerta('Error', mensaje);
      this.router.navigate(['/login']);
    }
  }

  doRefresh(event: any): void {
    this.cargarViajes(event);
  }

  getEstadoColor(idEstado: number): string {
    switch (idEstado) {
      case 1: return 'success';
      case 2: return 'warning';
      case 3: return 'primary';
      case 4: return 'danger';
      default: return 'medium';
    }
  }

  getEstadoViaje(idEstado: number): string {
    return this.estados[idEstado] || 'Estado Desconocido';
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getIconoEstado(idEstado: number): string {
    switch (idEstado) {
      case 1: return 'checkmark-circle';
      case 2: return 'play';
      case 3: return 'trophy';
      case 4: return 'close-circle';
      default: return 'help-circle';
    }
  }

  isEstadoActivo(idEstado: number): boolean {
    return idEstado === 1;
  }

  async cargarViajes(event?: any): Promise<void> {
    try {
      const response = await this.apiService.obtenerViaje({
        p_id_usuario: this.idUsuario,
        token: this.token,
      });

      if (!response?.data) {
        throw new Error('No se recibieron datos de viajes');
      }

      this.viajes = (response.data as Viaje[]).map((viaje) => ({
        ...viaje,
        pasajerosDisponibles: 3,
      }));
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Error al cargar viajes';
      await this.mostrarAlerta('Error', this.error);
    } finally {
      if (event) {
        event.target.complete();
      }
    }
  }

  async solicitarViaje(viaje: Viaje): Promise<void> {
    try {
      if (viaje.pasajerosDisponibles && viaje.pasajerosDisponibles > 0) {
        const resultado = await this.apiService.solicitarViaje({
          id_viaje: viaje.id_viaje,
          id_usuario: this.idUsuario,
          token: this.token,
        });

        viaje.pasajerosDisponibles--;
        await this.mostrarNotificacion(`Viaje solicitado. Quedan ${viaje.pasajerosDisponibles} pasajeros disponibles.`);
      } else {
        await this.mostrarNotificacion('No hay pasajeros disponibles en este viaje.');
      }
    } catch (error) {
      await this.mostrarAlerta('Error', 'No se pudo solicitar el viaje');
    }
  }

  async cancelarViaje(idViaje: number): Promise<void> {
    try {
      const alert = await this.alertController.create({
        header: 'Confirmar Cancelación',
        message: '¿Estás seguro que deseas cancelar este viaje?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
          },
          {
            text: 'Sí',
            handler: async () => {
              try {
                await this.apiService.actualizarEstadoViaje({
                  id: idViaje,
                  estado: 4,
                  token: this.token,
                });

                await this.mostrarNotificacion('Viaje cancelado con éxito.');
                await this.cargarViajes();
              } catch (error) {
                await this.mostrarAlerta('Error', 'No se pudo cancelar el viaje.');
              }
            },
          },
        ],
      });
      await alert.present();
    } catch (error) {
      await this.mostrarAlerta('Error', 'Error al mostrar el mensaje de confirmación.');
    }
  }

  async mostrarNotificacion(mensaje: string): Promise<void> {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      position: 'bottom',
      color: 'success',
    });
    await toast.present();
  }

  private async mostrarAlerta(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  irAgregarViaje(): void {
    this.router.navigate(['/agregar-viaje']);
  }
}