import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { HeaderModule } from './header/header.module';
import { FormModule } from './form/form.module';
import { StoreModule } from './store/store.module';

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, BrowserAnimationsModule, HeaderModule, FormModule, StoreModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
