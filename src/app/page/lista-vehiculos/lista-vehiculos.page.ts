import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { SotorageService } from 'src/app/service/sotorage.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

interface UserData {
  token: string;
  email: string;
  idUsuario?: number;
}

interface Vehiculo {
  id_vehiculo: number;
  patente: string;
  marca: string;
  modelo: string;
  anio: number;
  color: string;
  tipo_combustible: string;
  url_imagen: string;
}

@Component({
  selector: 'app-lista-vehiculos',
  templateUrl: './lista-vehiculos.page.html',
  styleUrls: ['./lista-vehiculos.page.scss'],
})
export class ListaVehiculosPage implements OnInit {
  vehiculos: Vehiculo[] = [];
  token: string = '';
  idUsuario: number = 0;
  email: string = '';
  loading: boolean = true;
  error: string | null = null;

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
      console.log('Datos del storage:', userData);
      
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
      console.log('ID Usuario obtenido:', this.idUsuario);
      
      await this.cargarVehiculos();

    } catch (error) {
      console.error('Error al inicializar datos:', error);
      const mensaje = error instanceof Error ? error.message : 'Error al cargar los datos';
      await this.mostrarAlerta('Error', mensaje);
      this.router.navigate(['/login']);
    }
  }

  async cargarVehiculos(event?: any): Promise<void> {
    try {
      if (!this.idUsuario || !this.token) {
        throw new Error('Faltan datos necesarios para cargar vehículos');
      }

      const response = await this.apiService.obtenerVehiculo({
        p_id: this.idUsuario,
        token: this.token
      });

      console.log('Respuesta completa del servidor:', response);

      if (!response?.data) {
        throw new Error('No se recibieron datos de vehículos');
      }

      this.vehiculos = response.data;
      
      this.vehiculos.forEach((vehiculo, index) => {
        console.log(`Vehículo ${index + 1}:`, {
          id: vehiculo.id_vehiculo,
          patente: vehiculo.patente,
          marca: vehiculo.marca,
          url_imagen: vehiculo.url_imagen
        });
      });

    } catch (error) {
      console.error('Error al cargar vehículos:', error);
      this.error = error instanceof Error ? error.message : 'Error al cargar vehículos';
      await this.mostrarAlerta('Error', this.error);
    } finally {
      if (event) {
        event.target.complete();
      }
    }
  }

  getImageUrl(vehiculo: Vehiculo): string {
    if (!vehiculo.url_imagen) {
      console.warn('Vehículo sin imagen:', vehiculo.patente);
      return '';
    }
    return vehiculo.url_imagen;
  }

  handleImageError(event: any): void {
    console.error('Error al cargar imagen:', (event.target as HTMLImageElement).src);
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
    await this.cargarVehiculos(event);
  }

  irAgregarVehiculo(): void {
    this.router.navigate(['/agregar-vehiculo']);
  }
}