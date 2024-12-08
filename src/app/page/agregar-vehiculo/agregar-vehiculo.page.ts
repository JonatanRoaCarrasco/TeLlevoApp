import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ActionSheetController } from '@ionic/angular';
import { ApiService } from 'src/app/service/api.service';
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
  token: string = ''; // Obtener del storage
  idUsuario: number = 0; // Obtener del storage o servicio

  constructor(
    private router: Router,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    // Aquí podrías obtener el token y el id de usuario del storage
  }

  async selectImageSource() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Seleccionar fuente de imagen',
      buttons: [
        {
          text: 'Tomar foto',
          icon: 'camera',
          handler: () => {
            this.takePicture();
          }
        },
        {
          text: 'Elegir de galería',
          icon: 'image',
          handler: () => {
            this.pickFromGallery();
          }
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera
      });

      const imageBlob = this.dataURItoBlob('data:image/jpeg;base64,' + image.base64String);
      this.archivoImagen = new File([imageBlob], "vehiculo.jpg", { type: 'image/jpeg' });
      
    } catch (error) {
      console.error('Error al tomar la foto:', error);
    }
  }

  async pickFromGallery() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Base64,
        source: CameraSource.Photos
      });

      const imageBlob = this.dataURItoBlob('data:image/jpeg;base64,' + image.base64String);
      this.archivoImagen = new File([imageBlob], "vehiculo.jpg", { type: 'image/jpeg' });
      
    } catch (error) {
      console.error('Error al seleccionar la foto:', error);
    }
  }

  private dataURItoBlob(dataURI: string) {
    const byteString = window.atob(dataURI.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    return blob;
  }

  async agregarVehiculo() {
    if (!this.validarFormulario()) {
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
  
      if (!this.archivoImagen) {
        await this.mostrarMensaje('Error', 'Debe seleccionar una imagen del vehículo');
        return;
      }
  
      const response = await this.apiService.agregarVehiculo(vehiculoData, this.archivoImagen);
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