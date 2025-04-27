import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
  standalone: false
})
export class ResultComponent {
  @Input() output: string = '';
  @Input() language: string = 'text';
  editorOptions = {theme: 'vs-dark', language: 'javascript'};

}
