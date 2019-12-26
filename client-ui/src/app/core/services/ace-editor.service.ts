import { Injectable } from '@angular/core';
declare var ace: any; // Grab the ACE editor library

@Injectable({
  providedIn: 'root'
})
export class AceEditorService {

  constructor() { }

  public initEditor(
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
      // theme: `ace/theme/crimson_editor`, // Light Theme Editor
      theme: `ace/theme/dracula`, // Dark Theme Editor
      readOnly: readOnly,
      value: text,
      maxLines: maxLines,
      useWorker: false,
      behavioursEnabled: true,
      autoScrollEditorIntoView: true,
      minLines: minLines,
      wrap: true,
      // Disable on readOnly
      showLineNumbers: !readOnly,
      showPrintMargin: !readOnly,
      showGutter: !readOnly,
      highlightActiveLine: !readOnly
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
    } else {
      editor.renderer.$cursorLayer.element.style.display = "none"
      editor.on("blur", function(e, editor) {
        if (document.activeElement != editor.textInput.getElement())
            editor.selection.clearSelection();
      });
    };
    return editor;

  }

  public setWriteEditor() {
  }

  public updateEditorCode(editor: any, text: string) {
    editor.setValue(text);
  }

  public updateEditorLanguage(editor: any, language: string) {
    editor.setMode(`ace/mode/${language}`);
  }

}
