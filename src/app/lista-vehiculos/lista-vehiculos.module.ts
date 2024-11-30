import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaVehiculosPageRoutingModule } from './lista-vehiculos-routing.module';

import { ListaVehiculosPage } from './lista-vehiculos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaVehiculosPageRoutingModule
  ],
  declarations: [ListaVehiculosPage]
})
export class ListaVehiculosPageModule {}
