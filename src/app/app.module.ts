import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckbox
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

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PageViewComponent,
    IndexCardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    FormsModule,
    // Angular Material imports
    MatButtonModule,
    MatCardModule,
    // CDK modules
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
