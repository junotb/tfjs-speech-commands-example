export {};

declare global {
  interface Window {
    speechCommands: SpeechCommandNamespace;
  }
}