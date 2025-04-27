import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss'],
  standalone: false
})
export class ConsoleComponent {
  @Input() consoleLogs: string = '';
  @Input() language: string = 'text';
  editorOptions = {theme: 'vs-dark', language: 'javascript'};



}
