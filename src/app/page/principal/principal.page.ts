import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from 'src/app/service/firebase.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {

  email:string="";

  constructor(private firebase:FirebaseService, private router:Router, private activate: ActivatedRoute) {
    this.activate.queryParams.subscribe(params=> {
      this.email = params['email'];
      console.log(this.email)
    })
   }

  ngOnInit() {
  }
  async logOut(){
    await this.firebase.logOut();
    this.router.navigateByUrl("login");
  }
}
