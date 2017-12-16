import { Component } from '@angular/core';
import { DataServicio, Detenido } from './servicios/data.servicio';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Detenidos del Rif';
  detenidos:Detenido[]=[];
}
