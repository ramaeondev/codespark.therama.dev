import { Component } from '@angular/core';

@Component({
  selector: 'app-homepage',
  standalone: false,
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
})
export class HomepageComponent {
  code: string = '';
  language: string = 'javascript';
  programOutput: string = '';
  consoleLogs: string = '';

  onLanguageChanged(lang: string) {
    this.language = lang;
  }

  onCodeChanged(newCode: string) {
    this.code = newCode;
  }

  onOutput(output: string) {
    this.programOutput = output;
    // Optionally set this.consoleLogs if needed
  }
}

