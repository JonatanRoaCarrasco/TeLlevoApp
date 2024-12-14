import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { SotorageService } from 'src/app/service/sotorage.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

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
}

interface EstadosMap {
  [key: number]: string;
}

@Component({
  selector: 'app-lista-viajes',
  templateUrl: './lista-viajes.page.html',
  styleUrls: ['./lista-viajes.page.scss'],
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
    4: 'Cancelado'
  };

  constructor(
    private apiService: ApiService,
    private storage: SotorageService,
    private router: Router,
    private alertController: AlertController
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
      console.log('📦 Datos del storage:', userData);
      
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
        token: this.token
      });

      if (!userResponse?.data?.[0]?.id_usuario) {
        throw new Error('No se pudo obtener el ID del usuario');
      }

      this.idUsuario = userResponse.data[0].id_usuario;
      console.log('👤 ID Usuario obtenido:', this.idUsuario);
      
      await this.cargarViajes();

    } catch (error) {
      console.error('❌ Error al inicializar datos:', error);
      const mensaje = error instanceof Error ? error.message : 'Error al cargar los datos';
      await this.mostrarAlerta('Error', mensaje);
      this.router.navigate(['/login']);
    }
  }

  async cargarViajes(event?: any): Promise<void> {
    try {
      if (!this.idUsuario || !this.token) {
        throw new Error('Faltan datos necesarios para cargar viajes');
      }

      const response = await this.apiService.obtenerViaje({
        p_id_usuario: this.idUsuario,
        token: this.token
      });

      console.log('🚗 Respuesta del servidor:', response);

      if (!response?.data) {
        throw new Error('No se recibieron datos de viajes');
      }

      this.viajes = response.data;
      
      this.viajes.forEach((viaje, index) => {
        console.log(`📍 Viaje ${index + 1}:`, {
          id: viaje.id_viaje,
          origen: viaje.ubicacion_origen,
          destino: viaje.ubicacion_destino,
          costo: viaje.costo,
          estado: this.getEstadoViaje(viaje.id_estado),
          fecha: this.formatearFecha(viaje.fecha_registro),
          vehiculo: viaje.vehiculo
        });
      });

    } catch (error) {
      console.error('❌ Error al cargar viajes:', error);
      this.error = error instanceof Error ? error.message : 'Error al cargar viajes';
      await this.mostrarAlerta('Error', this.error);
    } finally {
      if (event) {
        event.target.complete();
      }
    }
  }

  getEstadoViaje(idEstado: number): string {
    const estados: EstadosMap = {
      1: 'Activo',
      2: 'En Curso',
      3: 'Completado',
      4: 'Cancelado'
    };
    return estados[idEstado] || 'Desconocido';
  }

  getEstadoColor(idEstado: number): string {
    const colores: EstadosMap = {
      1: 'success',
      2: 'warning',
      3: 'primary',
      4: 'danger'
    };
    return colores[idEstado] || 'medium';
  }

  getIconoEstado(idEstado: number): string {
    const iconos: EstadosMap = {
      1: 'checkmark-circle',
      2: 'time',
      3: 'flag',
      4: 'close-circle'
    };
    return iconos[idEstado] || 'help-circle';
  }

  isEstadoActivo(idEstado: number): boolean {
    return idEstado === 1;
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return 'Fecha no disponible';
    try {
      const fechaObj = new Date(fecha);
      return fechaObj.toLocaleString('es-CL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return fecha;
    }
  }

  private async mostrarAlerta(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async doRefresh(event: any): Promise<void> {
    this.error = null;
    await this.cargarViajes(event);
  }

  irAgregarViaje(): void {
    this.router.navigate(['/agregar-viaje']);
  }

  async cancelarViaje(idViaje: number): Promise<void> {
    try {
      const alert = await this.alertController.create({
        header: 'Confirmar Cancelación',
        message: '¿Estás seguro que deseas cancelar este viaje?',
        buttons: [
          {
            text: 'No',
            role: 'cancel'
          },
          {
            text: 'Sí',
            handler: async () => {
              // Aquí iría la lógica para cancelar el viaje
              // Ejemplo: await this.apiService.actualizarEstadoViaje({ id: idViaje, estado: 4 });
              await this.cargarViajes();
            }
          }
        ]
      });
      await alert.present();
    } catch (error) {
      console.error('Error al cancelar viaje:', error);
      await this.mostrarAlerta('Error', 'No se pudo cancelar el viaje');
    }
  }
}