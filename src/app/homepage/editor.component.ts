import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, OnDestroy, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import * as monaco from 'monaco-editor';
import { ThemeService } from '../services/theme.service';
import { Subscription } from 'rxjs';
import { SupportedLanguages } from '../models/languages.model';

@Component({
  selector: 'app-editor',
  template: `<div #editorContainer class="h-full w-full rounded-md overflow-hidden border"></div>`,
  standalone: false
})
export class EditorComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  isDarkMode = false;
  private darkModeSub!: Subscription;
  constructor(private themeService: ThemeService) { } 
  ngOnInit(): void {
    this.darkModeSub = this.themeService.darkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark;
      this.updateEditorTheme();
    });
  }
  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef<HTMLDivElement>;

  @Input() language!: SupportedLanguages;
  @Input() value: string = '';
  @Input() errors: string[] = [];

  @Output() valueChange = new EventEmitter<string>();

  private editorInstance: monaco.editor.IStandaloneCodeEditor | null = null;
  private contentChangeSubscription: monaco.IDisposable | null = null;

  private updateEditorTheme() {
    if (this.editorInstance) {
      monaco.editor.setTheme(this.isDarkMode ? 'vs-dark' : 'vs');
    }
  }

  ngAfterViewInit() {
    if (this.editorContainer) {
      (self as any).MonacoEnvironment = { 
        getWorker(_: any, label: string) {
          switch (label) {
            case 'json':
              return new Worker('/assets/json.worker.js', { type: 'module' });
            case 'css':
            case 'scss':
            case 'less':
              return new Worker('/assets/css.worker.js', { type: 'module' });
            case 'html':
            case 'handlebars':
            case 'razor':
              return new Worker('/assets/html.worker.js', { type: 'module' });
            case 'typescript':
            case 'javascript':
              return new Worker('/assets/ts.worker.js', { type: 'module' });
            default:
              return new Worker('/assets/editor.worker.js', { type: 'module' });
          }
        }
      };  
      this.editorInstance = monaco.editor.create(this.editorContainer.nativeElement, {
        value: this.value,
        language: this.language?.language, 
        theme: this.isDarkMode ? 'vs-dark' : 'light',
        automaticLayout: true,
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        lineNumbers: 'on',
        renderLineHighlight: 'all',
        cursorBlinking: 'smooth',
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        fontSize: 14,
        renderWhitespace: 'selection',
        glyphMargin: true,
        folding: true,
        rulers: [],
        wordWrap: 'off',
        quickSuggestions: true,
        acceptSuggestionOnCommitCharacter: true,
        acceptSuggestionOnEnter: 'on',
        accessibilitySupport: 'auto',
      });

      // Listen for changes
      this.contentChangeSubscription = this.editorInstance.onDidChangeModelContent(() => {
        this.valueChange.emit(this.editorInstance?.getValue() ?? '');
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.editorInstance) {
      // Update language
      if (changes['language']) {
        const model = this.editorInstance.getModel();
        if (model) {
          monaco.editor.setModelLanguage(model, this.language.language);
        }
      }

      // Update markers for errors
      if (changes['errors']) {
        this.updateMarkers();
      }
    }
  }

  ngOnDestroy() {
    if (this.darkModeSub) {
      this.darkModeSub.unsubscribe();
    }
    if (this.editorInstance) {
      this.editorInstance.dispose();
    }
    if (this.contentChangeSubscription) {
      this.contentChangeSubscription.dispose();
    }
  }

  private updateMarkers() {
    if (!this.editorInstance) return;
    const model = this.editorInstance.getModel();
    if (!model) return;

    try {
      // Clear existing markers
      monaco.editor.setModelMarkers(model, 'owner', []);

      if (this.errors.length > 0) {
        const lineCount = model.getLineCount();

        const markers = this.errors.map((errorMsg) => {
          const lineMatch = errorMsg.match(/line (\d+)/i);
          let line = lineMatch ? parseInt(lineMatch[1], 10) : 1;

          if (isNaN(line) || line < 1) line = 1;
          else if (line > lineCount) line = lineCount;

          const safeColumn = Math.min(model.getLineMaxColumn(line), model.getLineLength(line) + 1);

          return {
            severity: monaco.MarkerSeverity.Error,
            message: errorMsg,
            startLineNumber: line,
            startColumn: 1,
            endLineNumber: line,
            endColumn: safeColumn
          };
        });

        monaco.editor.setModelMarkers(model, 'owner', markers);
      }
    } catch (error) {
      console.error('Error setting Monaco markers:', error);
    }
  }
}
