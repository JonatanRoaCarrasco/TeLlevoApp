import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';  // Corregida la ruta de importación
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SotorageService } from '../../service/sotorage.service';  

@Component({
  selector: 'app-agregar-viaje',
  templateUrl: './agregar-viaje.page.html',
  styleUrls: ['./agregar-viaje.page.scss']
})
export class AgregarViajePage implements OnInit {
  p_id_usuario: number = 0;
  p_ubicacion_origen: string = '';
  p_ubicacion_destino: string = '';
  p_costo: number = 0;
  p_id_vehiculo: number = 0;
  token: string = '';
  email: string = '';

  constructor(
    private apiService: ApiService,
    private alertController: AlertController,
    private storage: SotorageService,
    private router: Router
  ) {}

  async ngOnInit() {
    try {
      const userData = await this.storage.obtenerStorage();
      console.log('Datos del storage:', userData);

      if (!userData || userData.length === 0) {  // Mejorada la validación
        console.error('No hay datos en el storage');
        await this.mostrarAlerta('Error', 'No hay sesión activa');
        this.router.navigate(['/login']);
        return;
      }

      const userInfo = Array.isArray(userData) ? userData[0] : userData;
      console.log('Información del usuario:', userInfo);
      
      this.token = userInfo.token;
      this.email = userInfo.email;
      
      if (!this.token || !this.email) {  // Validación adicional
        throw new Error('Datos de usuario incompletos');
      }

      console.log('Token:', this.token);
      console.log('Email:', this.email);

      const response = await this.apiService.obtenerUsuario({
        p_correo: this.email,
        token: this.token
      });

      console.log('Respuesta obtenerUsuario:', response);

      if (response?.data?.[0]) {  // Mejorada la validación con optional chaining
        this.p_id_usuario = response.data[0].id_usuario;
        console.log('ID Usuario:', this.p_id_usuario);

        const vehiculos = await this.apiService.obtenerVehiculo({
          p_id: this.p_id_usuario,
          token: this.token
        });
        
        console.log('Respuesta vehículos:', vehiculos);

        if (vehiculos?.data?.[0]) {  // Mejorada la validación
          this.p_id_vehiculo = vehiculos.data[0].id_vehiculo;
          console.log('ID Vehículo:', this.p_id_vehiculo);
        } else {
          console.warn('No se encontraron vehículos');
          await this.mostrarAlerta('Advertencia', 'No se encontraron vehículos registrados');
        }
      } else {
        throw new Error('No se pudo obtener información del usuario');
      }

    } catch (error) {
      console.error('Error al inicializar:', error);
      await this.mostrarAlerta('Error', 'Error al cargar los datos');
      this.router.navigate(['/login']);
    }
  }

  async registrarViaje() {
    try {
      if (!this.validarDatos()) {
        return;
      }

      const viajeData = {
        p_id_usuario: this.p_id_usuario,
        p_ubicacion_origen: this.p_ubicacion_origen.trim(),  // Agregado trim()
        p_ubicacion_destino: this.p_ubicacion_destino.trim(),  // Agregado trim()
        p_costo: Number(this.p_costo),
        p_id_vehiculo: this.p_id_vehiculo,
        token: this.token
      };

      console.log('Datos a enviar:', viajeData);
      const response = await this.apiService.agregarViaje(viajeData);
      console.log('Respuesta:', response);

      await this.mostrarAlerta('Éxito', 'Viaje registrado correctamente');
      this.router.navigate(['/principal']);

    } catch (error) {
      console.error('Error detallado:', error);
      await this.mostrarAlerta('Error', 'No se pudo registrar el viaje');
    }
  }

  private validarDatos(): boolean {
    if (!this.p_ubicacion_origen?.trim()) {
      this.mostrarAlerta('Error', 'Debe ingresar la ubicación de origen');
      return false;
    }
    if (!this.p_ubicacion_destino?.trim()) {
      this.mostrarAlerta('Error', 'Debe ingresar la ubicación de destino');
      return false;
    }
    if (!this.p_costo || this.p_costo <= 0) {
      this.mostrarAlerta('Error', 'El costo debe ser mayor a 0');
      return false;
    }
    if (!this.p_id_vehiculo) {
      this.mostrarAlerta('Error', 'Debe seleccionar un vehículo');
      return false;
    }
    if (!this.token) {
      this.mostrarAlerta('Error', 'No hay sesión activa');
      return false;
    }
    return true;
  }

  private async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}