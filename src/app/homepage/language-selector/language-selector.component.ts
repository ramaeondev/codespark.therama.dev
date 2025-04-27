import { Component } from '@angular/core';

import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'],
  standalone: false
})
export class LanguageSelectorComponent {
  @Output() languageChanged = new EventEmitter<string>();
  languages = [
    { id: 'javascript', name: 'JavaScript', disabled: false },
    { id: 'python', name: 'Python', disabled: false },
    { id: 'cpp', name: 'C++', disabled: true },
    { id: 'java', name: 'Java', disabled: true }
  ];
  selectedLanguage = this.languages[0].id;

  selectLanguage(lang: string) {
    this.selectedLanguage = lang;
    this.languageChanged.emit(lang);
  }

  onLanguageChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectLanguage(selectElement.value);
  }
}
