package com.apiTpte.apiRestTpte.Controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.apiTpte.apiRestTpte.Entidades.Camion;
import com.apiTpte.apiRestTpte.Repository.TpteRepository;



@CrossOrigin(origins = "${FRONTEND_URL}")
@RestController
@RequestMapping("/api/")
 
public class CamionController {
    @Autowired
    TpteRepository tpteRepository;
   
    @SuppressWarnings("null")
    @GetMapping("/camiones")
    public ResponseEntity<List<Camion>> getAllCamiones() {
    try {
      List<Camion> camiones = null;
            
      camiones = tpteRepository.AllCamiones();
    
      if (camiones.isEmpty()) {
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
      } else {
         return new ResponseEntity<>(camiones, HttpStatus.OK);
      }
    } catch (Exception e) {
       return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @RequestMapping(value="/camiones/max")
  public int getCantCamiones(){
     int cantc = tpteRepository.getMaxCamiones();
     return cantc;
  }
  
  @RequestMapping(value ="/camion" , params={"id"} )
  public ResponseEntity<Camion> getLaboreoById(@RequestParam("id") Integer idcamion) {
    Camion camion = tpteRepository.findCamionById(idcamion);
    if (camion != null){
      return new ResponseEntity<>(camion, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
  }
    @PostMapping(value="/camion/nuevo")
    // Graba un nuevo campo
    public ResponseEntity<String> crearCamion(@RequestBody Camion camion) {
       try {
        int nrocamion = tpteRepository.saveCamion(camion);
        return new ResponseEntity<>(Integer.toString(nrocamion), HttpStatus.CREATED);
       } catch (Exception e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    @PutMapping(value="/camion/actualizar", params={"id"})
    public ResponseEntity<String> updateCamion(@RequestParam("id") Integer idcamion,
                                                @RequestBody Camion camion){
      try {
        int resultado = tpteRepository.actualizarCamion(idcamion,camion);    
        return new ResponseEntity<>(Integer.toString(resultado), HttpStatus.OK);
      } catch (Exception e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
     
      } 
    }
     @DeleteMapping(value="/camion", params={"id"})    
    public ResponseEntity<String> borrarCamion(@RequestParam("id") Integer idcamion){
      try {
        int nrocampo = tpteRepository.deleteCamion(idcamion);
        return new ResponseEntity<>(Integer.toString(nrocampo),HttpStatus.OK);
      } catch (Exception e) {
        return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR );
      }

    }
    /*@RequestMapping(value ="/camposxCliente" , params={"idCliente"} )
    public ResponseEntity<List<Campo>> getCamposByCli(@RequestParam("idCliente") Integer nrocliente) {
      List<Campo> campos = degrosRepository.findCamposByCliente(nrocliente);      
      if ( campos!= null){
        return new ResponseEntity<>(campos, HttpStatus.OK);
      } else {
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }
    }*/
   
}
