import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss'],
  standalone: false
})

export class CodeEditorComponent {
  @Input() code: string = 'function x() {\nconsole.log("Hello world!");\n}';
  @Input() language: string = 'javascript';
  @Output() codeChange = new EventEmitter<string>();
  editorOptions = {theme: 'vs-dark', language: 'javascript'};



}
