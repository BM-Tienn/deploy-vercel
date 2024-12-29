export {};

declare global {
  interface Window {
    CSRF_TOKEN: string;
    editable?: {
      editableDefinitions: Array<any>;
    };
  }
}
