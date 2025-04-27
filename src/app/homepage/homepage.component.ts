import { Component, OnInit } from '@angular/core';
import { SupportedLanguages } from '../models/languages.model';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-homepage',
  standalone: false,
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
  sidebarButtons: SupportedLanguages[] = [];
  isDarkMode = false;
  selectedLanguage: SupportedLanguages | null = null;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getLanguages().subscribe((data: SupportedLanguages[]) => {
      this.sidebarButtons = data;
      this.selectedLanguage = this.sidebarButtons.filter(
        (lang: SupportedLanguages) => lang.is_default
      )[0];
    }); 
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  changeLanguage(lng: SupportedLanguages) {
    this.selectedLanguage = lng;
  }
}

