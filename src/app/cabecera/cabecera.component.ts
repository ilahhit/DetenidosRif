import { Component } from '@angular/core';
import { DataServicio, Detenido } from '../servicios/data.servicio';
import { InicioComponent } from '../cuerpo/inicio/inicio.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cabecera',
  templateUrl: './cabecera.component.html',
  styleUrls: ['./cabecera.component.css']
})
export class CabeceraComponent {

  encontrados: Detenido[] = [];
  criterio:string="";
  mostrar:boolean=true;
  detenido:Detenido = {
    nombre:"",
    edad:"",
    img:"",
    informacion:"",
  }
  detenidos:Detenido[]=[];
  numTotal:number;
  detenidosTotal:Detenido[]=[];

  numOukacha:number=0;
  detenidosOukacha:Detenido[]=[];

  numAlhoceima:number=0;
  detenidosAlhoceima:Detenido[]=[];

  numOthers:number=0;
  detenidosOtros:Detenido[]=[];

  constructor(private _dataServicio: DataServicio, 
              private router: Router){
    this.getListDetenidos();
  }

  buscarDetenido(){
    console.log(this.criterio);
    this.router.navigate(['/busqueda', this.criterio]);
  }

  public getListDetenidos(){
    this._dataServicio.getDetenidoFireBase().subscribe(data => {
      var listeDetenidos:Detenido[]=[];
      for(let key in data){
        let detenido:Detenido = data[key];
        detenido.key$=key; 
        listeDetenidos.push(detenido);
        this.contarPalabras(detenido);
      }
      this.detenidos = listeDetenidos;
    });
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

    this.numTotal = this.numAlhoceima + this.numOthers + this.numOukacha;
  }

  public filtrarLista(criterio:string){
    console.log("filtrarLista => criterio: "+criterio);
    console.log(this.criterio);
    if (criterio.indexOf("oukacha")>=0){
      console.log("filtrarLista => criterio => En el IF");
      this.detenidos = this.detenidosOukacha;
    }

    console.log("this.detenidos: "+this.detenidos.length);
  }

}
