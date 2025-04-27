import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private darkModeSubject: BehaviorSubject<boolean>;
  public darkMode$: Observable<boolean>;

  constructor() {
    const storedDarkMode = localStorage.getItem('darkMode');
    const initialDarkMode = storedDarkMode === 'true';
    this.darkModeSubject = new BehaviorSubject<boolean>(initialDarkMode);
    this.darkMode$ = this.darkModeSubject.asObservable();
    this.applyDarkMode(initialDarkMode);
  }

  toggleDarkMode() {
    const newValue = !this.darkModeSubject.value;
    this.setDarkMode(newValue);
  }

  setDarkMode(isDark: boolean) {
    this.darkModeSubject.next(isDark);
    localStorage.setItem('darkMode', isDark ? 'true' : 'false');
    this.applyDarkMode(isDark);
  }

  getDarkMode(): boolean {
    return this.darkModeSubject.value;
  }

  private applyDarkMode(isDark: boolean) {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
