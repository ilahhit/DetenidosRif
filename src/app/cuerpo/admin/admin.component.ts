import { Component, OnInit } from '@angular/core';
import { DataServicio, Detenido } from '../../servicios/data.servicio';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpModule, Http, Headers, RequestOptions  } from '@angular/http'; 
import {Observable} from 'rxjs/Observable';
import {NgForm, FormGroup, Validator, FormControl} from '@angular/forms';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  file:File=null;
  detenido:Detenido = {
    nombre:"",
    edad:"",
    img:"",
    informacion:"",
  }

  detenidoReset:Detenido = {
    nombre:"",
    edad:"",
    img:"",
    informacion:"",
  }

  detenidos:Detenido[]=[];
  selectedDevice:string="";
  guardado:boolean;
  mensaje:string;
  connectado:boolean=false;
  usuario:string;
  password:string;
  mensajeConectar:string="";
  forma:FormGroup;

  constructor(private _servicioData: DataServicio,
              private _router: Router,
              private _http:Http) {
        this.getListDetenidos();
        this.connectado = true;
  }

  public getListDetenidos(){
    this._servicioData.getDetenidoFireBase().subscribe(data => {
      var listeDetenidos:Detenido[]=[];
      for(let key in data){
        let detenido:Detenido = data[key];
        detenido.key$=key; 
        listeDetenidos.push(detenido);
      }
      this.detenidos = listeDetenidos;
    });
  }

  connectar(){
   if (this.usuario=="MF" && this.password=="28102016"){
      this.connectado=true;
    }else{
      this.connectado=false;
      this.mensajeConectar = "Usuario o Password incorrecto.";
    }
  }

  onChange(key){
    if (key=="I"){
      this.getListDetenidos();
      this.limparTodo();
      this.mensaje="";
      this.guardado=false;
    }else{
      this.getListDetenidos();
      this.detenido = this._servicioData.getDetalleDetenido(key, this.detenidos);
      this.mensaje="";
      this.guardado=false;
      //this.file.=this.detenido.img;
    }
  }

  ngOnInit() {}

  /**
   * Guardar Detenido
   */
  guardarDetenido(formulario:NgForm) {
    console.log(formulario);
    console.log(this.detenido);
    //console.log(formulario.addControl(name));
    //**************************************
    //***        Modificar Detenido      ***
    //**************************************
    if (this._servicioData.existeDetenido(this.detenido, this.detenidos)){
      console.log("Ya existe, tenemos que Updatear.");
      if(this.file!=null){
        //Tenemos una foto a cargar
        console.log("Vamos a subir el fichero...  => "+this.file.name);
        this.cargarFoto(formulario, false);
      }else{
        console.log("No se ha subido Foto. Dejaremos la anterior.");
        this._servicioData.ModificarDetenido(this.detenido).subscribe( res =>{
          console.log("Vamos hacer Reset del formulario  Insert SIN FOTO.");
          formulario.controls.selectedDevice.setValue("I");
          formulario.controls.nombre.setValue("");
          formulario.controls.edad.setValue("");
          formulario.controls.informacion.setValue("");
          this.mensaje="Guardado con éxito.";
          this.guardado=true;
        });
        
      }

    //**************************************
    //***        Insertar Detenido       ***
    //**************************************  
    }else{
      console.log("No Existe, tenemos que Insertar.");
      if(this.file!=null){
        //Tenemos una foto a cargar
        console.log("Vamos a subir el fichero...  => "+this.file.name);
        //this._servicioData.cargarFoto(this.file, this.file.name, this.detenido, true);
        this.cargarFoto(formulario,true);
        //formulario.reset(this.detenidoReset);
      }else{
        console.log("No se ha subido Foto. Pondremos la por defecto");
        this.detenido.img = this._servicioData.urlImgNoFoto;
        this._servicioData.guardarDetenid(this.detenido).subscribe(res =>{
          console.log("Vamos hacer Reset del formulario  Insert SIN FOTO.");
          //formulario.controls.selectedDevice.setValue("");
          formulario.controls.nombre.setValue("");
          formulario.controls.edad.setValue("");
          formulario.controls.informacion.setValue("");
          this.mensaje="Insertado con éxito.";
          this.guardado=true;
        });
      }
    }
  }

  cargarFoto(formulario:any, insertar:boolean){
    let resultOK:boolean = true;
    this._servicioData.cargarFoto(this.file, this.file.name, this.detenido, insertar, resultOK);
    if (resultOK){
      this.mensaje="Modificado con éxito.";
      this.guardado=true;
      console.log("mensaje: "+this.mensaje);
      /*
      formulario.controls.selectedDevice.setValue("I");
      formulario.controls.nombre.setValue("");
      formulario.controls.edad.setValue("");
      formulario.controls.informacion.setValue("");
      */
    }else{
      console.log("ELSE .");
      this.guardado=false;
      this.mensaje="No se ha podido guardar.";
      console.log("mensaje: "+this.mensaje);
    }
    /*
    this._servicioData.cargarFoto(this.file, this.file.name, this.detenido, insertar).subscribe(res =>{
      if (res){
        this.mensaje="Guardado con éxito.";
        this.guardado=true;
        formulario.controls.selectedDevice.setValue("I");
        formulario.controls.nombre.setValue("");
        formulario.controls.edad.setValue("");
        formulario.controls.informacion.setValue("");
      }else{
        console.log("ELSE .");
        this.mensaje="No se ha podido guardar.";
      }
    });*/
  }

  /**
   * Metodo que limpia el formulario.
   */
  public limparTodo(){
    this.detenido.img="";
    this.detenido.edad="";
    this.detenido.informacion="";
    this.detenido.key$=null;
    this.detenido.nombre="";
    this.getListDetenidos();
  }

  /**
   * Coger el nombre + el fichero en una variable.
   * @param  
   */
  public recogerFicheroSeleccionado($event) {
    if ($event.target.files.length === 1) {
      this.file = $event.target.files[0];
    }
  }


}
