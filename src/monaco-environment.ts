import * as monaco from 'monaco-editor';

// Check if MonacoEnvironment is available
if (typeof MonacoEnvironment !== 'undefined') {
  MonacoEnvironment.getWorkerUrl = function (moduleId: string) {
    // Specify where Monaco worker files are located (inside the public folder)
    return `/assets/${moduleId}.worker.js`;
  };
}
