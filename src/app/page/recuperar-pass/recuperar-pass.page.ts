import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/service/firebase.service';

@Component({
  selector: 'app-recuperar-pass',
  templateUrl: './recuperar-pass.page.html',
  styleUrls: ['./recuperar-pass.page.scss'],
})
export class RecuperarPassPage implements OnInit {

  constructor(private firebase: FirebaseService, private router: Router) { }
  email=""
  passWord=""


  ngOnInit() {
  }
  async Recuperar(){
    let usuario = await this.firebase.recuperar(this.email);
      console.log(usuario);
      this.router.navigateByUrl("recuperar-pass.page");
    
    
  }
}
