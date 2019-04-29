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
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatToolbarModule
} from '@angular/material';
import {
  DragDropModule
} from '@angular/cdk/drag-drop'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Module with all Services, Directives and Gaurds
import { CoreModule } from './core/core.module';

// App Components that live on the main page
import { HeaderComponent } from './header/header.component';
import { SheetComponent } from './sheet/sheet.component';
import { IndexCardComponent } from './index-card/index-card.component';
import { SheetMenuComponent } from './sheet-menu/sheet-menu.component';

// Dialog Components
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { EditIndexCardDialogComponent } from './edit-index-card-dialog/edit-index-card-dialog.component';
import { CreateSheetDialogComponent } from './create-sheet-dialog/create-sheet-dialog.component';
import { CreateIndexCardDialogComponent } from './create-index-card-dialog/create-index-card-dialog.component';
import { LoaderComponent } from './loader/loader.component';

@NgModule({
  declarations: [
    // Components
    AppComponent,
    HeaderComponent,
    SheetComponent,
    IndexCardComponent,
    SheetMenuComponent,
    ConfirmationDialogComponent,
    EditIndexCardDialogComponent,
    CreateSheetDialogComponent,
    CreateIndexCardDialogComponent,
    LoaderComponent
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
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatToolbarModule,
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
