import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SheetService } from './services/sheet.service';
import { SheetResolver } from './guardsAndResolvers/sheet.resolve';
import { AceEditorService } from './services/ace-editor.service';
import { AuthResolver } from './guardsAndResolvers/auth.resolve';
import { LoaderService } from './services/loader.service';
import { LoaderInterceptor } from './interceptors/loader.interceptor';
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
    CommonModule,
    HttpClientModule
  ],
  providers: [
    SheetService,
    SheetResolver,
    AceEditorService,
    AuthResolver,
    LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }
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
