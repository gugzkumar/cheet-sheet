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
    minLines: number,
    customEscFunction: () => any = () => {},
    customCtrlEnterFunction: () => any = () => {}
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
      minLines: minLines,
      wrap: true,
      fontSize: 15
    });
    editor.setAutoScrollEditorIntoView(true);

    if (!readOnly) {
      editor.focus();
      if(customCtrlEnterFunction) {
        editor.commands.addCommand({
            name: 'clickCtrlEnter',
            bindKey: { win: 'Ctrl-Enter', mac: 'Command-Enter', sender: 'editor|cli' },
            exec: customCtrlEnterFunction
        });
      }
      if(customEscFunction) {
        editor.commands.addCommand({
            name: 'clickEscape',
            bindKey: { win: 'Esc', mac: 'Esc', sender: 'editor|cli' },
            exec: customEscFunction
        });
      }
    };
    return editor;

  }

  public setWriteEditor() {
  }

  public updateEditorCode(editor: any, text: string) {
    editor.setValue(text);
  }
}
