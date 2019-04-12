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
import { SheetComponent } from './sheet/sheet.component';
import { IndexCardComponent } from './index-card/index-card.component';
import { SheetMenuComponent } from './sheet-menu/sheet-menu.component';

// Dialog Components
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { EditIndexCardDialogComponent } from './edit-index-card-dialog/edit-index-card-dialog.component';
import { CreateSheetDialogComponent } from './create-sheet-dialog/create-sheet-dialog.component';
import { CreateIndexCardDialogComponent } from './create-index-card-dialog/create-index-card-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SheetComponent,
    IndexCardComponent,
    SheetMenuComponent,
    ConfirmationDialogComponent,
    EditIndexCardDialogComponent,
    CreateSheetDialogComponent,
    CreateIndexCardDialogComponent
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
    EditIndexCardDialogComponent,
    CreateSheetDialogComponent,
    CreateIndexCardDialogComponent
  ]
})
export class AppModule { }
