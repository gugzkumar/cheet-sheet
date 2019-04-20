import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SheetService } from './services/sheet.service';
import { AceEditorService } from './services/ace-editor.service';
import { AuthResolver } from './guardsAndResolvers/auth.resolve';
import {
  IfEditModeDirective,
  IfViewModeDirective,
  AddClassOnEditModeDirective
} from './directives/edit-mode.directives';
import {
  IfLoggedInDirective,
  IfLoggedOutDirective
} from './directives/auth.directives';
import { EditorDirective } from './directives/editor.directive';

@NgModule({
  declarations: [
    IfEditModeDirective,
    IfViewModeDirective,
    AddClassOnEditModeDirective,
    IfLoggedInDirective,
    IfLoggedOutDirective,
    EditorDirective
  ],
  imports: [
    CommonModule
  ],
  providers: [
    SheetService,
    AceEditorService,
    AuthResolver
  ],
  exports: [
    IfEditModeDirective,
    IfViewModeDirective,
    AddClassOnEditModeDirective,
    IfLoggedInDirective,
    IfLoggedOutDirective,
    EditorDirective
  ]
})
export class CoreModule { }
