import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-run-button',
  templateUrl: './run-button.component.html',
  styleUrls: ['./run-button.component.scss'],
  standalone: false
})
export class RunButtonComponent {
  @Input() code = '';
  @Input() language = 'javascript';
  @Output() outputGenerated = new EventEmitter<string>();


  onRun() {
    if (this.language === 'javascript') {
      try {
        const result = Function('"use strict";return (' + this.code + ')')();
        this.outputGenerated.emit(result);
      } catch (error:any) {
        this.outputGenerated.emit(error.toString());
      }
    } else if (this.language === 'python') {
      // this.codeService.runPythonCode(this.code).subscribe({
      //   next: (res) => this.outputGenerated.emit(res.output || res.error),
      //   error: (err) => this.outputGenerated.emit(err.message),
      // });
    }
  }
}
