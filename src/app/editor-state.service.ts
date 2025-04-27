import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface EditorOptions {
  theme: string;
  language: string;
  readOnly?: boolean;
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class EditorStateService {
  private consoleLogsSubject = new BehaviorSubject<string[]>([]);
  consoleLogs$ = this.consoleLogsSubject.asObservable();

  addConsoleLog(message: string) {
    const logs = this.consoleLogsSubject.value;
    this.consoleLogsSubject.next([...logs, message]);
  }

  clearConsoleLogs() {
    this.consoleLogsSubject.next([]);
  }
  private codeSubject = new BehaviorSubject<string>('');
  code$ = this.codeSubject.asObservable();

  private programOutputSubject = new BehaviorSubject<string>('');
  programOutput$ = this.programOutputSubject.asObservable();

  private languageSubject = new BehaviorSubject<string>('javascript');
  private editorOptionsSubject = new BehaviorSubject<EditorOptions>({
    theme: 'vs-dark',
    language: 'javascript',
    automaticLayout: true,
    readOnly: false
  });

  // Observable for components to subscribe
  language$ = this.languageSubject.asObservable();
  editorOptions$ = this.editorOptionsSubject.asObservable();

  // Get current values
  get code() {
    return this.codeSubject.value;
  }
  setCode(code: string) {
    this.codeSubject.next(code);
  }

  get programOutput() {
    return this.programOutputSubject.value;
  }
  setProgramOutput(output: string) {
    this.programOutputSubject.next(output);
  }

  get language() {
    return this.languageSubject.value;
  }
  setLanguage(lang: string) {
    this.languageSubject.next(lang);
    // Update editor options as well
    this.setEditorOptions({ ...this.editorOptions, language: lang });
  }

  get editorOptions() {
    return this.editorOptionsSubject.value;
  }
  setEditorOptions(options: Partial<EditorOptions>) {
    this.editorOptionsSubject.next({ ...this.editorOptions, ...options });
  }

  async executeCode() {
    const code = this.code.trim();
    const language = this.language.trim().toLowerCase();
    this.clearConsoleLogs();

    this.logToConsole('Code to execute:', code);
    this.logToConsole('Language:', language);

    if (language === 'javascript') {
      const logs: string[] = [];
      const originalConsoleLog = console.log;
      console.log = (...args: any[]) => {
        const message = args.map(arg =>
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        logs.push(message);
        originalConsoleLog.apply(console, args);
      };
      try {
        // Execute ANY JavaScript, including async code
        const asyncWrapper = `(async () => { ${code} })()`;
        const result = await (new Function(asyncWrapper))();
        this.setProgramOutput(result !== undefined ? String(result) : '(No Output)');
      } catch (error: unknown) {
        let errorMsg: string;
        if (error instanceof Error) {
          errorMsg = error.message;
        } else {
          errorMsg = String(error);
        }
        this.setProgramOutput(errorMsg);
        logs.push(errorMsg);
      } finally {
        console.log = originalConsoleLog;
        logs.forEach(log => this.addConsoleLog(log));
      }
    } else if (language === 'python') {
      const msg = 'Python execution not implemented yet.';
      this.setProgramOutput(msg);
      this.addConsoleLog(msg);
    } else {
      const msg = `Language "${language}" not supported.`;
      this.setProgramOutput(msg);
      this.addConsoleLog(msg);
    }
  }

  private logToConsole(...args: any[]) {
    const message = args.map(arg =>
      typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
    ).join(' ');
    this.addConsoleLog(message);
  }
}
