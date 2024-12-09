import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/service/api.service';
import { SotorageService } from 'src/app/service/sotorage.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { HttpErrorResponse } from '@angular/common/http'; // Asegúrate de importar esto

@Component({
  selector: 'app-agregar-vehiculo',
  templateUrl: './agregar-vehiculo.page.html',
  styleUrls: ['./agregar-vehiculo.page.scss'],
})
export class AgregarVehiculoPage implements OnInit {
  patente: string = '';
  marca: string = '';
  modelo: string = '';
  anio: number = new Date().getFullYear();
  color: string = '';
  tipoCombustible: string = '';
  archivoImagen: File | null = null;
  previewImage: string | undefined;
  token: string = '';
  idUsuario: number = 0;
  email: string = '';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private apiService: ApiService,
    private storage: SotorageService
  ) {}

  async ngOnInit() {
    try {
      const userData = await this.storage.obtenerStorage();
      console.log('Datos del storage:', userData);

      if (!userData) {
        await this.mostrarMensaje('Error', 'No hay sesión activa');
        this.router.navigate(['/login']);
        return;
      }

      // Si userData es un array, tomar el primer elemento
      const userInfo = Array.isArray(userData) ? userData[0] : userData;
      
      this.token = userInfo.token;
      this.email = userInfo.email;

      // Obtener datos actualizados del usuario
      try {
        const response = await this.apiService.obtenerUsuario({
          p_correo: this.email,
          token: this.token
        });

        if (response && response.data && response.data[0]) {
          this.idUsuario = response.data[0].id_usuario;
          console.log('ID Usuario obtenido:', this.idUsuario);
        } else {
          throw new Error('No se pudo obtener el ID del usuario');
        }
      } catch (error) {
        console.error('Error al obtener usuario:', error);
        await this.mostrarMensaje('Error', 'No se pudo obtener la información del usuario');
        this.router.navigate(['/login']);
      }

    } catch (error) {
      console.error('Error al cargar datos:', error);
      await this.mostrarMensaje('Error', 'Error al cargar datos de sesión');
      this.router.navigate(['/login']);
    }
  }

  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });

      this.previewImage = image.dataUrl;
      
      const response = await fetch(image.dataUrl!);
      const blob = await response.blob();
      this.archivoImagen = new File([blob], 'vehiculo.jpg', { type: 'image/jpeg' });
      
    } catch (error) {
      console.error('Error al tomar la foto:', error);
      await this.mostrarMensaje('Error', 'No se pudo tomar la foto');
    }
  }

  async pickFromGallery() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos
      });

      this.previewImage = image.dataUrl;
      
      const response = await fetch(image.dataUrl!);
      const blob = await response.blob();
      this.archivoImagen = new File([blob], 'vehiculo.jpg', { type: 'image/jpeg' });
      
    } catch (error) {
      console.error('Error al seleccionar la imagen:', error);
      await this.mostrarMensaje('Error', 'No se pudo seleccionar la imagen');
    }
  }

  async agregarVehiculo() {
    try {
      if (!this.validarFormulario()) {
        return;
      }
  
      if (!this.archivoImagen) {
        await this.mostrarMensaje('Error', 'Debe seleccionar una imagen');
        return;
      }
  
      const vehiculoData = {
        p_id_usuario: this.idUsuario, // Usar el ID obtenido
        p_patente: this.patente.toUpperCase(),
        p_marca: this.marca.toUpperCase(),
        p_modelo: this.modelo,
        p_anio: Number(this.anio),
        p_color: this.color,
        p_tipo_combustible: this.tipoCombustible,
        token: this.token
      };
  
      console.log('Datos a enviar:', vehiculoData);
      const response = await this.apiService.agregarVehiculo(vehiculoData, this.archivoImagen);
      console.log('Respuesta:', response);
      
      await this.mostrarMensaje('Éxito', 'Vehículo registrado correctamente');
      this.router.navigate(['/principal']);
    } catch (error) {
      console.error('Error completo:', error);

      // Verificamos si el error es una instancia de HttpErrorResponse
      if (error instanceof HttpErrorResponse) {
        const mensaje = error.error?.message || 'No se pudo registrar el vehículo';
        await this.mostrarMensaje('Error', mensaje);
      } else {
        // Manejo de error genérico
        await this.mostrarMensaje('Error', 'Error desconocido al registrar el vehículo');
      }
    }
  }

  private validarFormulario(): boolean {
    if (!this.patente || !this.marca || !this.modelo || !this.anio || 
        !this.color || !this.tipoCombustible) {
      this.mostrarMensaje('Error', 'Todos los campos son obligatorios');
      return false;
    }

    // Validación de la patente (formato XXXX00)
    const patenteRegex = /^[A-Z]{4}\d{2}$/;
    if (!patenteRegex.test(this.patente.toUpperCase())) {
      this.mostrarMensaje('Error', 'La patente debe tener el formato XXXX00');
      return false;
    }

    // Validación del año
    const currentYear = new Date().getFullYear();
    if (this.anio < 1900 || this.anio > currentYear) {
      this.mostrarMensaje('Error', `El año debe estar entre 1900 y ${currentYear}`);
      return false;
    }

    return true;
  }

  private async mostrarMensaje(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
