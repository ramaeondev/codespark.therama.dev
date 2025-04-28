import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomepageComponent } from './homepage.component';
import { ApiService } from '../services/api.service';
import { ThemeService } from '../services/theme.service';
import { BabelTranspilerService } from '../services/babel-transpiler.service';
import { of, Subject } from 'rxjs';

const mockLanguages = [
  { id: 1, name: 'JavaScript', is_default: true },
  { id: 2, name: 'Python', is_default: false },
];

describe('HomepageComponent', () => {
  let component: HomepageComponent;
  let fixture: ComponentFixture<HomepageComponent>;
  let apiService: ApiService;
  let themeService: ThemeService;
  let babelService: BabelTranspilerService;
  let darkModeSubject: Subject<boolean>;

  beforeEach(async () => {
    darkModeSubject = new Subject<boolean>();
    await TestBed.configureTestingModule({
      declarations: [HomepageComponent],
      providers: [
        { provide: ApiService, useValue: { getLanguages: jest.fn(() => of(mockLanguages)) } },
        { provide: ThemeService, useValue: { darkMode$: darkModeSubject.asObservable(), toggleDarkMode: jest.fn() } },
        { provide: BabelTranspilerService, useValue: { transpileAndExecuteCode: jest.fn(async (code: string) => 'output: ' + code) } },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomepageComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
    themeService = TestBed.inject(ThemeService);
    babelService = TestBed.inject(BabelTranspilerService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load languages and select default', () => {
    expect(component.sidebarButtons.length).toBe(2);
    expect(component.selectedLanguage).toEqual(mockLanguages[0]);
  });

  it('should subscribe to dark mode changes', () => {
    darkModeSubject.next(true);
    expect(component.isDarkMode).toBe(true);
    darkModeSubject.next(false);
    expect(component.isDarkMode).toBe(false);
  });

  it('should toggle dark mode', () => {
    const spy = jest.spyOn(themeService, 'toggleDarkMode');
    component.toggleDarkMode();
    expect(spy).toHaveBeenCalled();
  });

  it('should change language', () => {
    component.changeLanguage(mockLanguages[1]);
    expect(component.selectedLanguage).toEqual(mockLanguages[1]);
  });

  it('should update code on code change', () => {
    component.onCodeChange('console.log(123);');
    expect(component.code).toBe('console.log(123);');
  });

  it('should call BabelTranspilerService and set output on runCode', async () => {
    component.code = 'console.log(42)';
    await component.runCode();
    expect(babelService.transpileAndExecuteCode).toHaveBeenCalledWith('console.log(42)');
    expect(component.output).toContain('console.log(42)');
  });

  it('should handle errors in runCode', async () => {
    (babelService.transpileAndExecuteCode as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    component.code = 'bad code';
    await component.runCode();
    expect(component.output).toContain('Error: fail');
  });

  it('should unsubscribe from darkModeSub on destroy', () => {
    const unsubscribeSpy = jest.spyOn(component["darkModeSub"], 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
