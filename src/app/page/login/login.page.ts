import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { FirebaseService } from 'src/app/service/firebase.service';
import { AlertController } from '@ionic/angular';
import { SotorageService } from 'src/app/service/sotorage.service';
import { ApiService } from 'src/app/service/api.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = "";
  passWord: string = "";
  tokenID: any = "";

  constructor(
    private firebase: FirebaseService, 
    private router: Router, 
    private alertController: AlertController, 
    private storage: SotorageService,
    private apiService: ApiService
  ) { }

  ngOnInit() { }

  async login() {
    try {
      let usuario = await this.firebase.auth(this.email, this.passWord);
      this.tokenID = await usuario.user?.getIdToken();
        
      // Obtener el ID del usuario desde el backend
      const userInfo = await this.apiService.obtenerUsuario({
        p_correo: this.email,
        token: this.tokenID
      });
  
      const datosAGuardar = {
        email: this.email,
        token: this.tokenID,
        idUsuario: userInfo.data[0].id_usuario
      };
  
      await this.storage.agregarStorage(datosAGuardar);
      console.log('Datos guardados:', datosAGuardar);
  
      this.router.navigate(['/principal']);
    } catch (error) {
      console.error("Error:", error);
      await this.mostrarMensaje('Error', 'Credenciales inválidas');
    }
  }

  private async mostrarMensaje(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  // Este método se puede eliminar ya que su funcionalidad está integrada en login()
  private async pruebaStorage() {
    try {
      const jsonToken = {
        token: this.tokenID
      };
      
      await this.storage.agregarStorage(jsonToken);
      const storedData = await this.storage.obtenerStorage();
      console.log('Datos almacenados:', storedData);
    } catch (error) {
      console.error('Error al manejar el storage:', error);
      throw error;
    }
  }
}