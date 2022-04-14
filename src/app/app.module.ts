import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

import { AppComponent } from './app.component';
import { ApiService } from './services/api.service';
import { RowRatioComponent } from './shared/row-ratio/row-ratio.component';
import { RowHistComponent } from './shared/row-hist/row-hist.component';
import { environment } from '../environments/environment';

 
@NgModule({
  declarations: [
    AppComponent,
    RowRatioComponent,
    RowHistComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, 
    AngularFireAuthModule,
  ],
  providers: [
    ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
