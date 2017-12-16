import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { HttpModule, Http, Headers } from '@angular/http'; 
import * as firebase from 'firebase';
import { firebaseConfig } from '../config/firebase.config';

@Injectable()
export class DataServicio {

   //urlDataBase = "https://detenidoshirakrif.firebaseio.com/Detenidos.json";
    //urlDataBaseNodo = "https://detenidoshirakrif.firebaseio.com/Detenidos/";
    
    urlDataBase =  "https://detenidos-59d55.firebaseio.com/Detenidos.json";
    urlDataBaseNodo = "https://detenidos-59d55.firebaseio.com/Detenidos/";

    carpetaImg  = "img";
    urlImgNoFoto="https://firebasestorage.googleapis.com/v0/b/detenidos-59d55.appspot.com/o/img%2Ffreedom.jpg?alt=media&token=0cadb32d-83e8-4d69-a927-8aee864279b6";

    private detenidos:Detenido[] =[];
    

    constructor(private _http: Http) {
        this.alimentarListaDetenidos();
    }

    /**
     * Este metodo se encarga de Subir la foto a Firebase + agregar informacion 
     * en la tabla del Detenido.
     * @param foto 
     * @param nombre 
     * @param detenido 
     */
    cargarFoto(foto: File, nombreFichero:string, detenido: Detenido, isInsert:boolean, resultOK :boolean): boolean{
        console.log("initializeApp FirebaseStorage");
        firebase.initializeApp(firebaseConfig);
        let storageRef = firebase.storage().ref();
        console.log("storageRef FirebaseStorage");
        let uploadTask:firebase.storage.UploadTask = storageRef.child(`/${this.carpetaImg}/${nombreFichero}`).put(foto) ;
        console.log("uploadTask FirebaseStorage 3...");
        let urlFinal="";
        uploadTask.on( firebase.storage.TaskEvent.STATE_CHANGED,
            ( snapshot ) => console.log("Subiendo..."),
            ( error ) =>  {console.error("Error al subir ", error ); resultOK=false},
            ( )=>{
                urlFinal = uploadTask.snapshot.downloadURL;
                console.log("fichero subido a la ruta => " + urlFinal );
                detenido.img = urlFinal;
                if (isInsert){
                    this.guardarDetenid(detenido).subscribe(res =>{
                        if (res==null){
                            console.log("ERROR al insertar el registro");
                            resultOK=false;
                            return false;  
                        }
                    });
                }else{
                    this.ModificarDetenido(detenido).subscribe(res =>{
                        if (res==null){
                            console.log("ERROR al Modificar el registro");
                            resultOK=false;
                            return false;  
                        }
                    });
                }
                resultOK=true;
                return true;
            }
        )

        resultOK=false;
        return false;
    }

    /**
     * El méthodo que se encarga de guardar
     * el registro en Firebase.
     * @param detenido 
     */
    guardarDetenid(detenido:Detenido){
        console.log(detenido);
        var detenidoGuardar:DetenidoModificar = null;
        if(detenido.key$==null){
            detenidoGuardar = this.convertirDetenidoSinKey(detenido);
        } 
        if (detenidoGuardar==null)
            var body = JSON.stringify(detenido);
        else
            var body = JSON.stringify(detenidoGuardar);
        let headers = new Headers({
          'Content-Type':	'application/json'
        });
        console.log("Vamos a insertar la linea.");
        return this._http.post( this.urlDataBase, body, {headers}  )
                .map( res =>{
                    console.log("Linea insertado "+res.json());
                    return res.json();
                })
    }


        /**
     * El méthodo que se encarga de guardar
     * el registro en Firebase.
     * @param detenido 
     */
    ModificarDetenido(detenido:Detenido){
        console.log(detenido);
        let detenidoGuardar:DetenidoModificar ={
            nombre:detenido.nombre,
            edad:detenido.edad,
            img:detenido.img,
            informacion:detenido.informacion
        };
        
        console.log(detenidoGuardar);
        let body = JSON.stringify(detenidoGuardar);
        let headers = new Headers({
          'Content-Type':	'application/json'
        });
        let urlCompleto = this.urlDataBaseNodo + detenido.key$ +".json";
        console.log("Vamos a insertar la linea en esta URL: "+urlCompleto);
        
        
        return this._http.put( urlCompleto, body, {headers}  )
                .map( res =>{
                    console.log("Linea insertado "+res.json());
                    return res.json();
                    },
                        error => {console.log(error); return null;}
                    )
    }

    /**
     * Recuperar la lista de los registros de la base de datos.
     */
    getDetenidoFireBase(){
        return this._http.get( this.urlDataBase  )
                .map( res =>{
                    return res.json();
                })
    }

    /**
     * Un methodo solo para alimentar la lista de los detenidos.
     */
    alimentarListaDetenidos(){
        this.getDetenidoFireBase().subscribe(data => {
            for(let key in data){
                  let detenido:Detenido = data[key];
                  detenido.key$=key; 
                  this.detenidos.push(detenido);
            }
        })
    }

    existeDetenido(pdetenido:any, listDetenidos){
        
        for (let detenido of listDetenidos){
            if (pdetenido.key$!=null && pdetenido.key$!="" && detenido.key$==pdetenido.key$){
                return true;
            }
        }
            return false;
    }


    /**
     * Recuperar los detalles del Detenido
     * @param id 
     */
    getDetalleDetenido(id: string, pdetenidos){
        if (pdetenidos==null){
            pdetenidos=this.detenidos;  
        }
        for (let detenido of pdetenidos){
            console.log(detenido.key$);
            if (detenido.key$==id){
                return detenido;
            }
        }
       
    }

    /**
     * Buscar en la lista de los detenidos por criterio de busqueda.
     * @param criterio 
     */
    buscarDetenido(criterio:String): Detenido[]{
        let encontrados: Detenido[] = [];
        for (let detenido of this.detenidos){
            if (detenido.nombre.trim().toUpperCase().indexOf(criterio.trim().toUpperCase())>=0){
                encontrados.push(detenido);
            }
        }
        return encontrados;
    }

    convertirDetenidoSinKey(detenido: Detenido){
        let detenidoGuardar:DetenidoModificar ={
            nombre:detenido.nombre,
            edad:detenido.edad,
            img:detenido.img,
            informacion:detenido.informacion
        };
        return detenidoGuardar;
    }
}


/**
 * La interface que nos declara el Objeto Detenido.
 */
export interface Detenido{
    nombre:string;
    edad:string;
    img:string;
    informacion:string;
    key$?:string;
}

export interface DetenidoModificar{
    nombre:string;
    edad:string;
    img:string;
    informacion:string;
}