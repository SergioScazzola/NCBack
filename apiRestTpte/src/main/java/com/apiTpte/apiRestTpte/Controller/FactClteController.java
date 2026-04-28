package com.apiTpte.apiRestTpte.Controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.apiTpte.apiRestTpte.Entidades.Camion;
import com.apiTpte.apiRestTpte.Entidades.FactCli;
import com.apiTpte.apiRestTpte.Entidades.ItfactC;
import com.apiTpte.apiRestTpte.Repository.TpteRepository;





@RestController
@RequestMapping("/api/faccl/")
 
public class FactClteController {
    @Autowired
    TpteRepository tpteRepository;
   
    @SuppressWarnings("null")
    @GetMapping(value="/facscl")
    public ResponseEntity<List<FactCli>> getAllFacscl() {
      try {
        List<FactCli> facscli = tpteRepository.AllFacscl();
        return ResponseEntity.ok(facscli);
    } catch (Exception e) {
        e.printStackTrace(); // esto imprimirá el error real en tu consola
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                             .body(null);
    }       
    }

  @RequestMapping(value="/max")
  public int getCantFacscl(){
     int cantf = tpteRepository.getMaxFacscl();
     return cantf;
  }
  
  @RequestMapping(value ="/faccl" , params={"id"} )
  public ResponseEntity<FactCli> getFacClienteById(@RequestParam("id") Integer idfac) {
    FactCli fac = tpteRepository.findFacclById(idfac);
    if (fac != null){
      return new ResponseEntity<>(fac, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
  }
    @PostMapping(value="/faccl/nuevo")
    // Graba una nueva Factura al Cliente
    public ResponseEntity<String> crearFaccl(@RequestBody FactCli fac) {
       try {
        int nrof = tpteRepository.saveFaccl(fac);
        return new ResponseEntity<>(Integer.toString(nrof), HttpStatus.CREATED);
       } catch (Exception e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    @PutMapping(value="/faccl/actualizar", params={"id"})
    public ResponseEntity<String> updateFactp(@RequestParam("id") Integer idfactura,
                                                @RequestBody FactCli fac){
      try {
        int resultado = tpteRepository.actualizarFaccl(idfactura,fac);    
        return new ResponseEntity<>(Integer.toString(resultado), HttpStatus.OK);
      } catch (Exception e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
     
      } 
    }
     @DeleteMapping(value="/faccl", params={"id"})    
    public ResponseEntity<String> borrarFacCL(@RequestParam("id") Integer idfac){
      try {
        int nrofac = tpteRepository.deleteFaccl(idfac);
        return new ResponseEntity<>(Integer.toString(nrofac),HttpStatus.OK);
      } catch (Exception e) {
        return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR );
      }

    }
    
    // DETALLE de la Factura al Cliente
    @SuppressWarnings("null")
    @GetMapping(value="/faccl/detalle",params={"idfac"})
    public ResponseEntity<List<ItfactC>> getInfoDetalleFaccl(@RequestParam("idfac") Integer idfactura) {
    try {
      List<ItfactC> items = null;
            
      items = tpteRepository.getDetalleFaccl(idfactura);
    
      if (items.isEmpty()) {
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
      } else {
         return new ResponseEntity<>(items, HttpStatus.OK);
      }
    } catch (Exception e) {
       return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @PostMapping(value="/detalle/nuevo")
    // Graba un nuevo Item de Factura al Cliente
    public ResponseEntity<String> crearItemFaccl(@RequestBody ItfactC itfac) {
       try {
        int nroit = tpteRepository.saveItemFaccl(itfac);
        return new ResponseEntity<>(Integer.toString(nroit), HttpStatus.CREATED);
       } catch (Exception e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    @PutMapping(value="/detalle/actualizar")
    public ResponseEntity<String> updateItemFaccl(@RequestBody ItfactC itfac){
      try {
        int resultado = tpteRepository.actualizarItemFaccl(itfac);    
        return new ResponseEntity<>(Integer.toString(resultado), HttpStatus.OK);
      } catch (Exception e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);     
      } 
    }
     @DeleteMapping(value="/detalle/borrar", params={"idfac","nroitem"})    
    public ResponseEntity<String> borrarItemFactp(@RequestParam("idfac")   Integer nrofac,
                                                  @RequestParam("nroitem") Integer nroit){
                                               
      try {
        int nroi = tpteRepository.deleteItemFaccl(nrofac,nroit);
        return new ResponseEntity<>(Integer.toString(nroi),HttpStatus.OK);
      } catch (Exception e) {
        return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR );
      }

    }
}
