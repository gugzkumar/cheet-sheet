import { Injectable } from '@angular/core';
declare var ace: any; // Grab the ACE editor library

@Injectable({
  providedIn: 'root'
})
export class AceEditorService {

  constructor() { }

  public setReadOnlyEditor(
    // editorId: string,
    div: Element,
    language: string,
    text: string,
    readOnly: boolean,
    maxLines: number,
    minLines: number
  ): void {
    const editor = ace.edit(div, {
      mode: `ace/mode/${language}`,
      theme: `ace/theme/dracula`,
      readOnly: readOnly,
      value: text,
      maxLines: maxLines,
      useWorker: false,
      behavioursEnabled: true,
      autoScrollEditorIntoView: true,
      minLines: minLines
    });
    // editor.commands.addCommand(
    //   {
    //     name: 'saveFile',
    //     bindKey: {
    //       win: 'Ctrl-S',
    //       mac: 'Command-S',
    //       sender: 'editor|cli'
    //     },
    //     exec: function(env, args, request) {
    //       alert("HI!");
    //     }
    // });

    if (!readOnly) {

      editor.focus();
    };
    return editor;

  }

  public setWriteEditor() {
  }

  public updateEditorCode(editor: any, text: string) {
    editor.setValue(text);
  }
}
