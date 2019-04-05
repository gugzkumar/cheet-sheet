import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageViewService } from './services/page-view.service';
import { AceEditorService } from './services/ace-editor.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    PageViewService,
    AceEditorService
  ]
})
export class CoreModule { }
