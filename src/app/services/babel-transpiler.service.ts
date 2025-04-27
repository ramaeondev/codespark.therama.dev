import { Injectable } from '@angular/core';
import * as Babel from '@babel/standalone';

@Injectable({
  providedIn: 'root'
})
export class BabelTranspilerService {
  constructor() { }

  async transpileAndExecuteCode(code: string): Promise<string> {
    try {
      // Transpile the code using Babel
      const transpiledCode = Babel.transform(code, {
        presets: ['env'],
      }).code;

      // Now, execute the transpiled code and capture the output
      const output = this.executeCode(transpiledCode ?? "");

      return output;
    } catch (error: unknown) {
      console.error('Error transpiling or executing code:', error);
      throw new Error('Error: ' + (error instanceof Error ? error.message : String(error)));
    }
  }

  private executeCode(transpiledCode: string): string {
    try {
      // Capture console output
      let output = '';
      const originalConsoleLog = console.log;
      console.log = (message: any) => {
        output += message + '\n';
      };

      // Run the transpiled code
      eval(transpiledCode);

      // Restore original console.log
      console.log = originalConsoleLog;
      if (!output) {
        // If the code is an expression, we return the result of that expression
        output = String(eval(transpiledCode));
      }
      return output.trim();
    } catch (error: unknown) {
      console.error('Error executing code:', error);
      return 'Execution Error: ' + (error instanceof Error ? error.message : String(error));
    }
  }
}
