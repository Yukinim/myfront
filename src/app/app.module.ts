import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { D3Service, D3_DIRECTIVES } from './d3';

import { AppComponent } from './app.component';

import { SHARED_VISUALS } from './visuals/shared';


@NgModule({
  declarations: [
    AppComponent,
    ...SHARED_VISUALS,
    ...D3_DIRECTIVES
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule
  ],
  providers: [D3Service],
  bootstrap: [AppComponent]
})
export class AppModule { }
