import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { SotorageService } from 'src/app/service/sotorage.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

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
  apiUrl = environment.apiUrl;

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

      // Añade este log
      console.log('Respuesta completa del servidor:', JSON.stringify(response, null, 2));

      if (response?.data) {
        this.vehiculos = response.data;
        // También añade este log para ver la estructura de cada vehículo
        this.vehiculos.forEach(vehiculo => {
          console.log('Datos de vehículo:', vehiculo);
        });
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

  getImageUrl(vehiculo: any): string {
    if (!vehiculo.url_imagen) {
      return 'assets/img/default-car.png';
    }

    // Si la URL ya es completa (comienza con http o https)
    if (vehiculo.url_imagen.startsWith('http')) {
      return vehiculo.url_imagen;
    }

    // Si la URL es relativa, construir la URL completa
    // Asegurarse de que no haya dobles slashes
    const baseUrl = this.apiUrl.endsWith('/') ? this.apiUrl.slice(0, -1) : this.apiUrl;
    const imagePath = vehiculo.url_imagen.startsWith('/') ? vehiculo.url_imagen : '/' + vehiculo.url_imagen;
    
    const fullUrl = baseUrl + imagePath;
    console.log('URL construida para imagen:', fullUrl);
    return fullUrl;
  }

  handleImageError(event: any) {
    console.log('URL de imagen que falló:', event.target.src);
    // Quitamos el slash inicial de la ruta
    event.target.src = 'assets/img/car-placeholder.jpg';
  }

  private async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async doRefresh(event: any) {
    await this.cargarVehiculos(event);
  }

  irAgregarVehiculo() {
    this.router.navigate(['/agregar-vehiculo']);
  }
}