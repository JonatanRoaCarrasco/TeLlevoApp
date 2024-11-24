import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firebase:AngularFireAuth) { }

  async auth(correo:string, contraseña:string){
    const request = await this.firebase.signInWithEmailAndPassword(correo,contraseña)
    return request

  }
  async registro(correo:string, contraseña:string){
    const request = await this.firebase.createUserWithEmailAndPassword(correo, contraseña)
    return request

  }
  async recuperar(correo:string){
    const request = await this.firebase.sendPasswordResetEmail(correo)
    return request

  }
  async logOut(){
    const request = await this.firebase.signOut()
   

  }


}
