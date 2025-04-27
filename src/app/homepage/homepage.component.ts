import { Component, OnInit, OnDestroy } from '@angular/core';
import { ThemeService } from '../services/theme.service';
import { Subscription } from 'rxjs';
import { SupportedLanguages } from '../models/languages.model';
import { ApiService } from '../services/api.service';
import { CompilationService } from '../services/compilation.service';

@Component({
  selector: 'app-homepage',
  standalone: false,
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit, OnDestroy {
  sidebarButtons: SupportedLanguages[] = [];
  isDarkMode = false;
  private darkModeSub!: Subscription;
  selectedLanguage!: SupportedLanguages; 
  code: string = '';
  errors: string[] = [];
  output: string = '';
  constructor(private api: ApiService, private themeService: ThemeService, private compilationService: CompilationService) { }

  ngOnInit(): void {
    this.api.getLanguages().subscribe((data: SupportedLanguages[]) => {
      this.sidebarButtons = data;
      this.selectedLanguage = this.sidebarButtons.filter(
        (lang: SupportedLanguages) => lang.is_default
      )[0];
    });
    this.darkModeSub = this.themeService.darkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark;
    });
  }

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }

  changeLanguage(lng: SupportedLanguages) {
    this.selectedLanguage = lng;
  }

  ngOnDestroy(): void {
    this.darkModeSub.unsubscribe();
  }
  
  onCodeChange(newCode: string) {
    this.code = newCode;
    console.log(this.code); 
    // Optionally, trigger validation again and update errors
  }
  async runCode() {
    const result = await this.compilationService.compileCode(this.code, this.selectedLanguage);
    this.output = result.output;
    console.log(this.output);  // Log the result or handle it as needed
  }
}

