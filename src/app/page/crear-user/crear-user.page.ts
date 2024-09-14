import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/service/firebase.service';

@Component({
  selector: 'app-crear-user',
  templateUrl: './crear-user.page.html',
  styleUrls: ['./crear-user.page.scss'],
})
export class CrearUserPage implements OnInit {

  constructor(private firebase: FirebaseService,private router:Router) { }
  email=""
  passWord=""


  ngOnInit() {
  }
  async Registrar(){
    let usuario = await this.firebase.registro(this.email, this.passWord);
      console.log(usuario);
      this.router.navigateByUrl("login");
  }
}
