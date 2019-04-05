import { Injectable } from '@angular/core';
declare var ace: any; // Grab the ACE editor library

@Injectable({
  providedIn: 'root'
})
export class AceEditorService {

  constructor() { }

  public setReadOnlyEditor(editorId: string, language: string, text: string): void {
    ace.edit(`${editorId}`, {
      mode: `ace/mode/${language}`,
      theme: `ace/theme/dracula`,
      readOnly: true,
      value: text,
      maxLines:50
    });
  }

  public setWriteEditor() {

  }

  public saveEditorCode() {

  }
}
