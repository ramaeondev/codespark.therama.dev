import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { HomepageComponent } from './homepage.component';
import { HomepageRoutingModule } from './homepage-routing.module';
import { CodeEditorComponent } from "./code-editor/code-editor.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RunButtonComponent } from './run-button/run-button.component';
import { LanguageSelectorComponent } from './language-selector/language-selector.component';
import { ResultComponent } from './result/result.component';
import { ConsoleComponent } from './console/console.component';

@NgModule({
  declarations: [
    HomepageComponent,
    CodeEditorComponent,
    RunButtonComponent,
    LanguageSelectorComponent,
    ResultComponent,
    ConsoleComponent      
  ],
  imports: [
    CommonModule,
    MonacoEditorModule.forRoot(), 
    HomepageRoutingModule,
    FormsModule,
    ReactiveFormsModule 
]
})
export class HomepageModule { } 
