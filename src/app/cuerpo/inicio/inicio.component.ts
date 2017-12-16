import { Component, OnInit } from '@angular/core';
import { DataServicio, Detenido } from '../../servicios/data.servicio';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  detenidos:any[] = [];
  criterio: String;

  numTotal:number;
  detenidosTotal:Detenido[]=[];

  numOukacha:number=0;
  detenidosOukacha:Detenido[]=[];

  numAlhoceima:number=0;
  detenidosAlhoceima:Detenido[]=[];

  numOthers:number=0;
  detenidosOtros:Detenido[]=[];
  
  constructor(private _dataServicio: DataServicio, 
              private router: Router,
              private activatedRoute: ActivatedRoute) {
      this._dataServicio.getDetenidoFireBase().subscribe(data => {
        for(let key in data){
              let detenido:Detenido = data[key];
              detenido.key$=key; 
              this.detenidos.push(detenido);
              this.contarPalabras(detenido);
        }
        this.ordenarListe();
      });
  }

  ordenarListe(){
    this.detenidos.sort(function(a,b) {return (a.nombre > b.nombre) ? 1 : ((b.nombre > a.nombre) ? -1 : 0);} ); 
  }

compare(a:Detenido,b:Detenido) {
    if (a.nombre < b.nombre)
      return -1;
    if (a.nombre > b.nombre)
      return 1;
    return 0;
  }

  ngOnInit(){
  }

  verDetalle(key: number){
    console.log("index: "+key);
    this.router.navigate(['/detalle', key]);
  }


  buscarDetenido(){
    console.log(this.criterio);
    this.router.navigate(['/busqueda', this.criterio]);
  }

   /**
   * Contar el numero de los detenidos en las carceles.
   * @param detenido 
   */
  private contarPalabras(detenido:Detenido){
    if (detenido.informacion.trim().toUpperCase().indexOf("Oukacha".trim().toUpperCase())>=0){
      this.numOukacha++;
      this.detenidosOukacha.push(detenido);
    }else if (detenido.informacion.trim().toUpperCase().indexOf("prisión local de Al Hoceima".trim().toUpperCase())>=0){
      this.numAlhoceima++;
      this.detenidosAlhoceima.push(detenido);
    }else{
      this.numOthers++
      this.detenidosOtros.push(detenido);
    }
    this.detenidosTotal.push(detenido);
    this.numTotal = this.numAlhoceima + this.numOthers + this.numOukacha;
  }

  public filtrarLista(criterio:string){
    console.log("filtrarLista => criterio: "+criterio);
    console.log(this.criterio);
    if (criterio.indexOf("oukacha")>=0){
      console.log("filtrarLista => criterio => En el IF");
      this.detenidos = this.detenidosOukacha;
    }else if (criterio.indexOf("alhucemas")>=0){
      this.detenidos = this.detenidosAlhoceima;
    }else if (criterio.indexOf("otros")>=0){
      this.detenidos = this.detenidosOtros;
    }else{
      this.detenidos = this.detenidosTotal;
    }
    console.log("this.detenidos: "+this.detenidos.length);
  }


}
