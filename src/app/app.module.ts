import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CabeceraComponent } from './cabecera/cabecera.component';
import { PieComponent } from './pie/pie.component';
import { ContactanosComponent } from './cuerpo/contactanos/contactanos.component';
import { AdminComponent } from './cuerpo/admin/admin.component';
import { InicioComponent } from './cuerpo/inicio/inicio.component';
import { APP_ROUTING } from './app.routes';
import { DataServicio } from './servicios/data.servicio';
import { DetalleComponent } from './cuerpo/detalle/detalle.component';
import { ResultadoComponent } from './cuerpo/resultado/resultado.component';
import { HttpModule } from '@angular/http'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PdfViewerModule } from 'ng2-pdf-viewer';

// Config
import { AngularFireModule } from 'angularfire2';
import { firebaseConfig } from './config/firebase.config';


@NgModule({
  declarations: [
    AppComponent,
    CabeceraComponent,
    PieComponent,
    ContactanosComponent,
    AdminComponent,
    InicioComponent,
    DetalleComponent,
    ResultadoComponent
  ],
  imports: [
    BrowserModule,
    APP_ROUTING,
    HttpModule,
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  providers: [DataServicio],
  bootstrap: [AppComponent]
})
export class AppModule { }
