import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LOGINPageRoutingModule } from './login-routing.module';

import { LOGINPage } from './login.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LOGINPageRoutingModule
  ],
  declarations: [LOGINPage]
})
export class LOGINPageModule {}
