import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageViewService } from './services/page-view.service';
import { AceEditorService } from './services/ace-editor.service';
import {
  IfEditModeDirective,
  IfViewModeDirective,
  AddClassOnEditModeDirective
} from './directives/edit-mode.directive';
import {
  IfLoggedInDirective,
  IfLoggedOutDirective
} from './directives/auth.directive';
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
    PageViewService,
    AceEditorService
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
