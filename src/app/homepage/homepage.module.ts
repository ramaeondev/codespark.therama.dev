import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomepageComponent } from './homepage.component';
import { HomepageRoutingModule } from './homepage-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorComponent } from './editor.component';

@NgModule({
  declarations: [
    HomepageComponent,
    EditorComponent 
  ],
  imports: [
    CommonModule,
    FormsModule,
    HomepageRoutingModule,
    ReactiveFormsModule
  ]
})
export class HomepageModule { } 
