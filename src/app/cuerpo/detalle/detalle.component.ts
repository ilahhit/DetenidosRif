import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataServicio, Detenido } from '../../servicios/data.servicio';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  detalleDetenido:any;

  constructor(private activatedRoute: ActivatedRoute, 
              private _dataServicio: DataServicio,
              private router: Router) { 
    this.activatedRoute.params.subscribe(params => {
        this.detalleDetenido = this._dataServicio.getDetalleDetenido(params['id'], null);
    }
       
    )

  }

  volverHome(){
    this.router.navigate(['/home']);
  }

  ngOnInit() {
  }



}
