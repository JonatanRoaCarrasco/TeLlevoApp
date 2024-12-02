import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/service/api.service';
import { FirebaseService } from 'src/app/service/firebase.service';

@Component({
  selector: 'app-crear-user',
  templateUrl: './crear-user.page.html',  
  styleUrls: ['./crear-user.page.scss'],
})
export class CrearUserPage implements OnInit {
  nombre: string = '';
  email: string = '';
  telefono: string = '';
  token: string = '';
  password: string = '';
  archivoImagen: File | null = null;

  constructor(
    private router: Router,
    private firebase: FirebaseService,
    private alertcontroller: AlertController,
    private crearuser: ApiService
  ) {}

  ngOnInit() {}

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.archivoImagen = event.target.files[0];
    }
  }

  async registrar() {
    try {
      let usuario = await this.firebase.registro(this.email, this.password);
      const token = await usuario.user?.getIdToken();
      if (this.archivoImagen) {
        const request = await this.crearuser.agregarUsuario(
          {
            p_correo_electronico: this.email,
            p_nombre: this.nombre,
            p_telefono: this.telefono,
            token: token,
          },
          this.archivoImagen
        );
      }
      console.log(usuario);
      this.router.navigateByUrl('login');
    } catch (error) {
      this.popAlert();
      console.log(error);
    }
  }

  async popAlert() {
    const alert = await this.alertcontroller.create({
      header: 'Error',
      message: 'Usuario o Contraseña incorrecta',
      buttons: ['OK'],
    });
    await alert.present();
  }
}