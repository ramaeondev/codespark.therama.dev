import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

// // Fix Monaco Editor worker loading for Angular
// (window as any).MonacoEnvironment = {
//   getWorkerUrl: function (moduleId: string, label: string) {
//     // Map Monaco language label to worker script
//     let workerPath = 'assets/monaco/min/vs/base/worker/workerMain.js';
//     if (label === 'typescript' || label === 'javascript') {
//       workerPath = 'assets/monaco/min/vs/language/typescript/tsWorker.js';
//     } else if (label === 'python') {
//       // Monaco does not ship a python worker, but if you use a plugin, set its path here
//       workerPath = 'assets/monaco/min/vs/base/worker/workerMain.js';
//     }
//     return `data:text/javascript;charset=utf-8,importScripts('${workerPath}');`;
//   }
// };

platformBrowserDynamic().bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true,
})
  .catch(err => console.error(err));
