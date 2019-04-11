import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatSidenavModule,
  MatSnackBarModule
} from '@angular/material';

import {
  DragDropModule
} from '@angular/cdk/drag-drop'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';

import { HeaderComponent } from './header/header.component';
import { PageViewComponent } from './page-view/page-view.component';
import { IndexCardComponent } from './index-card/index-card.component';
import { SheetMenuComponent } from './sheet-menu/sheet-menu.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { EditIndexCardDialogueComponent } from './edit-index-card-dialogue/edit-index-card-dialogue.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PageViewComponent,
    IndexCardComponent,
    SheetMenuComponent,
    ConfirmationDialogComponent,
    EditIndexCardDialogueComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    FormsModule,
    // Angular Material imports
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatSidenavModule,
    MatSnackBarModule,
    // CDK modules
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    ConfirmationDialogComponent,
    EditIndexCardDialogueComponent
  ]
})
export class AppModule { }
