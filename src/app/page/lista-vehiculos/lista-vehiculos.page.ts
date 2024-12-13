import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { SotorageService } from 'src/app/service/sotorage.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-lista-vehiculos',
  templateUrl: './lista-vehiculos.page.html',
  styleUrls: ['./lista-vehiculos.page.scss'],
})
export class ListaVehiculosPage implements OnInit {
  vehiculos: any[] = [];
  token: string = '';
  idUsuario: number = 0;
  email: string = '';

  constructor(
    private apiService: ApiService,
    private storage: SotorageService,
    private router: Router,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    await this.inicializarDatos();
  }

  async inicializarDatos() {
    try {
      const userData = await this.storage.obtenerStorage();
      console.log('Datos del storage:', userData);
      
      if (!userData) {
        await this.mostrarAlerta('Error', 'No hay sesión activa');
        this.router.navigate(['/login']);
        return;
      }

      const userInfo = Array.isArray(userData) ? userData[0] : userData;
      this.token = userInfo.token;
      this.email = userInfo.email;

      // Primero obtener el ID de usuario usando el email
      const userResponse = await this.apiService.obtenerUsuario({
        p_correo: this.email,
        token: this.token
      });

      if (userResponse?.data?.[0]) {
        this.idUsuario = userResponse.data[0].id_usuario;
        console.log('ID Usuario obtenido:', this.idUsuario);
        await this.cargarVehiculos();
      } else {
        throw new Error('No se pudo obtener el ID del usuario');
      }

    } catch (error) {
      console.error('Error al inicializar datos:', error);
      await this.mostrarAlerta('Error', 'Error al cargar los datos');
    }
  }

  async cargarVehiculos(event?: any) {
    try {
      console.log('Intentando cargar vehículos con:', {
        p_id: this.idUsuario,
        token: this.token
      });

      const response = await this.apiService.obtenerVehiculo({
        p_id: this.idUsuario,
        token: this.token
      });

      console.log('Respuesta del servidor:', response);

      if (response?.data) {
        this.vehiculos = response.data;
        console.log('URLs de las imágenes:', this.vehiculos.map(v => v.url_imagen));
      }
    } catch (error) {
      console.error('Error al cargar vehículos:', error);
      await this.mostrarAlerta('Error', 'No se pudieron cargar los vehículos');
    } finally {
      if (event) {
        event.target.complete();
      }
    }
  }

  // Método para manejar errores de carga de imágenes
  handleImageError(event: any) {
    console.log('Error al cargar imagen, usando imagen por defecto');
    event.target.src = '/assets/img/default-car.png';
  }

  private async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  // Método para refrescar la lista manualmente
  async doRefresh(event: any) {
    await this.cargarVehiculos(event);
  }

  // Método para navegar a agregar vehículo
  irAgregarVehiculo() {
    this.router.navigate(['/agregar-vehiculo']);
  }
}