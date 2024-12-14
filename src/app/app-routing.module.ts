import { Component, NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {AngularFireAuthGuard,redirectUnauthorizedTo} from '@angular/fire/compat/auth-guard';
import { PageNotFoundComponent } from './Component/page-not-found/page-not-found.component';
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
    canActivate:[AngularFireAuthGuard], 
    data:{authGuardPipe: redireccionarLogin},
    loadChildren: () => import('./page/principal/principal.module').then( m => m.PrincipalPageModule)
  },
  {
    path: 'test-api',
    loadChildren: () => import('./page/test-api/test-api.module').then( m => m.TestApiPageModule)
  },
  {
    path: 'agregar-vehiculo',
    loadChildren: () => import('./page/agregar-vehiculo/agregar-vehiculo.module').then( m => m.AgregarVehiculoPageModule)
  },
  {
    path: 'lista-vehiculos',
    loadChildren: () => import('./page/lista-vehiculos/lista-vehiculos.module').then( m => m.ListaVehiculosPageModule)
  },
  {
    path: 'agregar-viaje',
    loadChildren: () => import('./page/agregar-viaje/agregar-viaje.module').then( m => m.AgregarViajePageModule)
  },
  {
    path: 'lista-viajes',
    loadChildren: () => import('./page/lista-viajes/lista-viajes.module').then( m => m.ListaViajesPageModule)
  },

  {
    path:'**',
    component: PageNotFoundComponent
  },
  
  

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
