import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCardModule

} from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { PageViewComponent } from './page-view/page-view.component';
import { PageEditComponent } from './page-edit/page-edit.component';
import { IndexCardComponent } from './index-card/index-card.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PageViewComponent,
    PageEditComponent,
    IndexCardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    // Angular Material imports
    MatButtonModule,
    MatCardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
