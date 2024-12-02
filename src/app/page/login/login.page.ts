import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { FirebaseService } from 'src/app/service/firebase.service';
import { AlertController } from '@ionic/angular';
import { SotorageService } from 'src/app/service/sotorage.service';

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
    private storage: SotorageService
  ) { }

  ngOnInit() {
    // Puedes añadir inicializaciones aquí si las necesitas
  }

  async login() {
    try {
      // Validación de campos
      if (!this.email || !this.passWord) {
        await this.showAlert('Campos incompletos', 'Por favor, completa todos los campos.');
        return;
      }

      // Autenticación con Firebase
      const usuario = await this.firebase.auth(this.email, this.passWord);
      
      // Obtener y guardar token
      this.tokenID = await usuario.user?.getIdToken();
      
      if (this.tokenID) {
        // Guardar token en storage
        await this.pruebaStorage();
        
        // Preparar navegación
        const navigationExtras: NavigationExtras = {
          queryParams: { email: this.email }
        };
        
        // Navegar a la página principal
        await this.router.navigate(['/principal'], navigationExtras);
      } else {
        await this.showAlert('Error', 'No se pudo obtener el token de autenticación');
      }

    } catch (error) {
      console.error("Error durante el inicio de sesión:", error);
      await this.showAlert(
        'Error de inicio de sesión', 
        'No se pudo iniciar sesión. Verifica tu correo electrónico y contraseña e intenta nuevamente.'
      );
    }
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

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
      throw error; // Relanzar el error para manejarlo en login()
    }
  }
} 