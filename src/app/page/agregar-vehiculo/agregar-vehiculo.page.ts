import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/service/api.service';
import { SotorageService } from 'src/app/service/sotorage.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

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

  constructor(
    private router: Router,
    private alertController: AlertController,
    private apiService: ApiService,
    private storage: SotorageService
  ) { }

  async ngOnInit() {
    try {
      const userData = await this.storage.obtenerStorage();
      if (userData && userData.token) {
        this.token = userData.token;
        this.idUsuario = userData.idUsuario;
      }
    } catch (error) {
      console.error('Error al obtener datos del storage:', error);
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
      
      // Convertir a File
      const response = await fetch(image.dataUrl!);
      const blob = await response.blob();
      this.archivoImagen = new File([blob], 'vehiculo.jpg', { type: 'image/jpeg' });
      
    } catch (error) {
      console.error('Error al tomar la foto:', error);
      this.mostrarMensaje('Error', 'No se pudo tomar la foto');
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
      
      // Convertir a File
      const response = await fetch(image.dataUrl!);
      const blob = await response.blob();
      this.archivoImagen = new File([blob], 'vehiculo.jpg', { type: 'image/jpeg' });
      
    } catch (error) {
      console.error('Error al seleccionar la imagen:', error);
      this.mostrarMensaje('Error', 'No se pudo seleccionar la imagen');
    }
  }

  async agregarVehiculo() {
    if (!this.validarFormulario()) {
      return;
    }

    if (!this.archivoImagen) {
      await this.mostrarMensaje('Error', 'Debe seleccionar una imagen del vehículo');
      return;
    }

    try {
      const vehiculoData = {
        p_id_usuario: this.idUsuario,
        p_patente: this.patente,
        p_marca: this.marca,
        p_modelo: this.modelo,
        p_anio: this.anio,
        p_color: this.color,
        p_tipo_combustible: this.tipoCombustible,
        token: this.token
      };

      console.log('Enviando datos:', vehiculoData);
      const response = await this.apiService.agregarVehiculo(vehiculoData, this.archivoImagen);
      console.log('Respuesta:', response);
      
      await this.mostrarMensaje('Éxito', 'Vehículo registrado correctamente');
      this.router.navigate(['/principal']);
    } catch (error) {
      console.error('Error al registrar vehículo:', error);
      await this.mostrarMensaje('Error', 'No se pudo registrar el vehículo');
    }
  }

  private validarFormulario(): boolean {
    if (!this.patente || !this.marca || !this.modelo || !this.anio || 
        !this.color || !this.tipoCombustible) {
      this.mostrarMensaje('Error', 'Todos los campos son obligatorios');
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