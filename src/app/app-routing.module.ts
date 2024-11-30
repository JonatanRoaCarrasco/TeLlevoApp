import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {AngularFireAuthGuard,redirectUnauthorizedTo} from '@angular/fire/compat/auth-guard';

const redireccionarLogin = () => redirectUnauthorizedTo(['/login']);

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./page/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'crear-user',
    loadChildren: () => import('./page/crear-user/crear-user.module').then( m => m.CrearUserPageModule)
  },
  {
    path: 'recuperar-pass',
    loadChildren: () => import('./page/recuperar-pass/recuperar-pass.module').then( m => m.RecuperarPassPageModule)
  },
  {
    path: 'principal',
    canActivate:[AngularFireAuthGuard], data:{authGuardPipe: redireccionarLogin},
    loadChildren: () => import('./page/principal/principal.module').then( m => m.PrincipalPageModule)
  },  {
    path: 'agregar-vehiculo',
    loadChildren: () => import('./agregar-vehiculo/agregar-vehiculo.module').then( m => m.AgregarVehiculoPageModule)
  },
  {
    path: 'lista-vehiculos',
    loadChildren: () => import('./lista-vehiculos/lista-vehiculos.module').then( m => m.ListaVehiculosPageModule)
  },
  {
    path: 'testapi',
    loadChildren: () => import('./testapi/testapi.module').then( m => m.TestapiPageModule)
  },
  {
    path: 'testapi',
    loadChildren: () => import('./testapi/testapi.module').then( m => m.TestapiPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
