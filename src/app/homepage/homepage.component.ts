import { Component, OnInit, OnDestroy } from '@angular/core';
import { ThemeService } from '../services/theme.service';
import { Subscription } from 'rxjs';
import { SupportedLanguages } from '../models/languages.model';
import { ApiService } from '../services/api.service';
import { CompilationService } from '../services/compilation.service';
import { BabelTranspilerService } from '../services/babel-transpiler.service';

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
  constructor(private api: ApiService, private themeService: ThemeService, private babelService: BabelTranspilerService) { }

  ngOnInit(): void {
    this.api.getLanguages().subscribe((data: SupportedLanguages[]) => {
      this.sidebarButtons = data;
      this.selectedLanguage = this.sidebarButtons.find(
        (lang: SupportedLanguages) => lang.is_default
      )!;
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
  }

 async runCode() {
    try {
      this.output = await this.babelService.transpileAndExecuteCode(this.code);
    } catch (error: unknown) {
      console.error('Error:', error);
      this.output = `Error: ${error instanceof Error ? error.message : String(error)}`;
    }
  }
}

