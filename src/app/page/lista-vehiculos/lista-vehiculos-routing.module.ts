import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaVehiculosPage } from './lista-vehiculos.page';

const routes: Routes = [
  {
    path: '',
    component: ListaVehiculosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaVehiculosPageRoutingModule {}
