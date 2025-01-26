import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { FirebaseService } from 'src/app/service/firebase.service';
import { AlertController, LoadingController } from '@ionic/angular';
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
    private apiService: ApiService,
    private loadingController: LoadingController
  ) { }

  ngOnInit() { }

  async login() {
    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
      spinner: 'circles'
    });
    await loading.present();

    try {
      let usuario = await this.firebase.auth(this.email, this.passWord);
      this.tokenID = await usuario.user?.getIdToken();
  
      // Primero obtener datos del usuario
      const userInfo = await this.apiService.obtenerUsuario({
        p_correo: this.email,
        token: this.tokenID
      });
  
      console.log('Respuesta del servidor:', userInfo);
  
      // Guardar en storage con el ID correcto
      await this.storage.agregarStorage({
        email: this.email,
        token: this.tokenID,
        idUsuario: userInfo.data[0].id // Asegúrate que sea el campo correcto
      });
  
      await loading.dismiss();
      this.router.navigate(['/principal']);
    } catch (error) {
      console.error("Error:", error);
      await loading.dismiss();
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
}