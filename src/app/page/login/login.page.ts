import { Component, OnInit } from '@angular/core';
import { NavigationExtras,Router } from '@angular/router';
import { FirebaseService } from 'src/app/service/firebase.service';
import { AlertController } from '@ionic/angular'; // Importar AlertController

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string = "";
  passWord: string = "";

  constructor(private firebase: FirebaseService, private router: Router, private alertController: AlertController) { }

  ngOnInit() { }

  async login() {
    if (!this.email || !this.passWord) {
      this.showAlert('Campos incompletos', 'Por favor, completa todos los campos.');
      return;
    }
    
    try {
      let usuario = await this.firebase.auth(this.email, this.passWord);
      console.log(usuario);
      const NavigationExtras:NavigationExtras= {
        queryParams:{email: this.email}
      };
      this.router.navigate(['/principal'], NavigationExtras);
      
    } catch (error) {
      console.error("Error durante el inicio de sesión:", error);
      this.showAlert('Error de inicio de sesión', 'No se pudo iniciar sesión. Verifica tu correo electrónico y contraseña e intenta nuevamente.');
    }
  }

  // Método para mostrar alertas
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }
}
