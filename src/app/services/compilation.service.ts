import { Injectable } from '@angular/core';
import { SupportedLanguages } from '../models/languages.model';
import { ToastrService } from 'ngx-toastr';


export interface CompilationResult {
  success: boolean;
  output: string;
  errors: string[];
  executionTime?: number;
}

const languageCompilationTimes: Record<string, number> = {
  javascript: 100,
  typescript: 200,
  python: 150,
  java: 500,
  c: 300,
  cpp: 350,
  csharp: 400,
  php: 150,
  ruby: 150,
  go: 250,
};

const mockOutputs: Record<string, (code: string) => CompilationResult> = {
  javascript: (code) => {
    try {
        if (code.includes('console.log')) {
          const output = code.match(/console\.log\((.*)\)/)?.[1] || '';
          
          // Evaluate the expression inside console.log and output the result
          let evaluatedOutput;
          try {
            evaluatedOutput = eval(output); // Use eval to execute the expression
          } catch (e) {
            if (e instanceof Error) {
                evaluatedOutput = `Error evaluating expression: ${e.message}`;
              } else {
                evaluatedOutput = 'Error evaluating expression: Unknown error';
              }
            }
  
          return {
            success: true,
            output: `${evaluatedOutput}\n`,  // Output the result of the evaluated expression
            errors: [],
            executionTime: 10,
          };
        }
        return {
          success: true,
          output: "Code executed successfully, but no console output detected.\n",
          errors: [],
          executionTime: 5,
        };
      } catch (error) {
        return {
          success: false,
          output: '',
          errors: [`Error: ${error instanceof Error ? error.message : String(error)}`],
          executionTime: 2,
        };
      }
    },
  typescript: (code) => {
    if (code.includes('console.log')) {
      return {
        success: true,
        output: 'Hello, World!\n',
        errors: [],
        executionTime: 15,
      };
    }
    return {
      success: true,
      output: 'Code compiled and executed successfully.\n',
      errors: [],
      executionTime: 10,
    };
  },

  python: (code) => {
    if (code.includes('print')) {
      return {
        success: true,
        output: 'Hello, World!\n',
        errors: [],
        executionTime: 8,
      };
    }
    return {
      success: true,
      output: 'Code executed successfully.\n',
      errors: [],
      executionTime: 5,
    };
  },

  java: () => ({ success: true, output: 'Hello, World!\n', errors: [], executionTime: 50 }),
  c: () => ({ success: true, output: 'Hello, World!\n', errors: [], executionTime: 30 }),
  cpp: () => ({ success: true, output: 'Hello, World!\n', errors: [], executionTime: 35 }),
  csharp: () => ({ success: true, output: 'Hello, World!\n', errors: [], executionTime: 40 }),
  php: () => ({ success: true, output: 'Hello, World!\n', errors: [], executionTime: 15 }),
  ruby: () => ({ success: true, output: 'Hello, World!\n', errors: [], executionTime: 12 }),
  go: () => ({ success: true, output: 'Hello, World!\n', errors: [], executionTime: 20 }),
};

// Mock error detection
const hasError = (code: string, language: SupportedLanguages): string[] => {
  const errors: string[] = [];

  if (language.language === 'javascript' || language.language === 'typescript') {
    if (code.includes('console.log(') && !code.includes(');')) {
      errors.push('Syntax error: Missing closing parenthesis at line 3');
    }

    if (code.includes('function') && !code.includes('{')) {
      errors.push('Syntax error: Missing opening brace at line 2');
    }
  }

  if (language.language === 'python') {
    if (code.includes('def') && !code.includes(':')) {
      errors.push('SyntaxError: Missing colon at line 2');
    }
  }

  if (Math.random() < 0.2) {
    if (language.language === 'javascript' || language.language === 'typescript') {
      errors.push('Warning: Unused variable at line 2');
    } else if (language.language === 'python') {
      errors.push("Warning: Indentation doesn't follow PEP 8 at line 3");
    }
  }

  return errors;
};

@Injectable({
  providedIn: 'root',
})
export class CompilationService {
  constructor(private toast: ToastrService) {}
  async compileCode(code: string, language: SupportedLanguages): Promise<CompilationResult> {
    console.log('language code...', language.language);   
    console.log('code...', code);     

    try {
      const delay = languageCompilationTimes[language.language] || 200;
      await new Promise((resolve) => setTimeout(resolve, delay));

      const errors = hasError(code, language);
      console.log('Errors:', errors); // Debugging line

      // If there are any errors that are not warnings, handle them
      if (errors.length > 0 && errors.some((e) => !e.startsWith('Warning'))) {
        console.log('Compilation failed due to errors');
        this.toast.error('Compilation failed with errors');
        return {
          success: false,
          output: '',
          errors,
          executionTime: Math.round(delay / 10),
        };
      }

      const mockHandler = mockOutputs[language.language] || mockOutputs['javascript'];
      console.log('Using handler for language:', language.language); // Debugging line
      const result = mockHandler(code);

      console.log('Result before adding errors:', result); // Debugging line
      // If errors exist, append them to the result
      if (errors.length > 0) {
        result.errors = errors;
      }

      // Display success toast and return result
      this.toast.success('Compilation successful');
      console.log('Final result:', result); // Debugging line
      return result;
    } catch (error) {
      console.error('Compilation error:', error);
      this.toast.error('Compilation failed');
      return {
        success: false,
        output: '',
        errors: [
          `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        ],
        executionTime: 0,
      };
    }
  }
}
