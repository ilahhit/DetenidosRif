import { RouterModule, Routes} from '@angular/router';
import { Component } from '@angular/core';
import { ContactanosComponent } from './cuerpo/contactanos/contactanos.component';
import { AdminComponent } from './cuerpo/admin/admin.component';
import { InicioComponent } from './cuerpo/inicio/inicio.component';
import { DetalleComponent } from './cuerpo/detalle/detalle.component';
import { ResultadoComponent } from './cuerpo/resultado/resultado.component';

const APP_ROUTES: Routes = [
    { path: 'home', component: InicioComponent},
    { path: 'filtrar/:categoria', component: InicioComponent},
    { path: 'contact', component: ContactanosComponent},
    { path: 'admin', component: AdminComponent},
    { path: 'detalle/:id', component: DetalleComponent},
    { path: 'busqueda/:criterio', component: ResultadoComponent},
    { path: '**', pathMatch: 'full', redirectTo: 'home' }
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);