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

import com.apiTpte.apiRestTpte.Entidades.FactTpte;
import com.apiTpte.apiRestTpte.Entidades.ItfactT;
import com.apiTpte.apiRestTpte.Repository.TpteRepository;





@CrossOrigin(origins = "${FRONTEND_URL}")
@RestController
@RequestMapping("/factp/")
 
public class FactTpteController {
    @Autowired
    TpteRepository tpteRepository;
   
    @SuppressWarnings("null")
    @GetMapping("/facstp")
    public ResponseEntity<List<FactTpte>> getAllFacstp() {
    try {
      List<FactTpte> facs = null;
            
      facs = tpteRepository.AllFacstp();
    
      if (facs.isEmpty()) {
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
      } else {
         return new ResponseEntity<>(facs, HttpStatus.OK);
      }
    } catch (Exception e) {
       return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @RequestMapping(value="/max")
  public int getCantFacstp(){
     int cantf = tpteRepository.getMaxFacstp();
     return cantf;
  }
  
  @RequestMapping(value ="/factp" , params={"id"} )
  public ResponseEntity<FactTpte> getClienteById(@RequestParam("id") Integer idfac) {
    FactTpte fac = tpteRepository.findFactpById(idfac);
    if (fac != null){
      return new ResponseEntity<>(fac, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
  }
    @PostMapping(value="/factp/nuevo")
    // Graba una nueva Factura de Transporte
    public ResponseEntity<String> crearFactp(@RequestBody FactTpte fac) {
       try {
        int nrof = tpteRepository.saveFactp(fac);
        return new ResponseEntity<>(Integer.toString(nrof), HttpStatus.CREATED);
       } catch (Exception e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    @PutMapping(value="/factp/actualizar", params={"id"})
    public ResponseEntity<String> updateFactp(@RequestParam("id") Integer idfactura,
                                                @RequestBody FactTpte fac){
      try {
        int resultado = tpteRepository.actualizarFactp(idfactura,fac);    
        return new ResponseEntity<>(Integer.toString(resultado), HttpStatus.OK);
      } catch (Exception e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
     
      } 
    }
     @DeleteMapping(value="/factp", params={"id"})    
    public ResponseEntity<String> borrarFactp(@RequestParam("id") Integer idfac){
      try {
        int nrofac = tpteRepository.deleteFactp(idfac);
        return new ResponseEntity<>(Integer.toString(nrofac),HttpStatus.OK);
      } catch (Exception e) {
        return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR );
      }

    }
    
    // DETALLE de la Factura de la Empresa de Trasporte
    @SuppressWarnings("null")
    @GetMapping(value="/factp/detalle",params={"idfac"})
    public ResponseEntity<List<ItfactT>> getInfoDetalleFactp(@RequestParam("idfac") Integer idfactura) {
    try {
      List<ItfactT> items = null;
            
      items = tpteRepository.getDetalleFactp(idfactura);
    
      if (items.isEmpty()) {
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
      } else {
         return new ResponseEntity<>(items, HttpStatus.OK);
      }
    } catch (Exception e) {
       return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @PostMapping(value="/factp/detalle/nuevo")
    // Graba un nuevo Item de Factura de Transporte
    public ResponseEntity<String> crearItemFactp(@RequestBody ItfactT itfac) {
       try {
        int nroit = tpteRepository.saveItemFactp(itfac);
        return new ResponseEntity<>(Integer.toString(nroit), HttpStatus.CREATED);
       } catch (Exception e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    @PutMapping(value="/factp/detalle/actualizar")
    public ResponseEntity<String> updateItemFactp(@RequestBody ItfactT itfac){
      try {
        int resultado = tpteRepository.actualizarItemFactp(itfac);    
        return new ResponseEntity<>(Integer.toString(resultado), HttpStatus.OK);
      } catch (Exception e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
     
      } 
    }
     @DeleteMapping(value="/factp/detalle/borrar", params={"idfac","nroitem"})    
    public ResponseEntity<String> borrarItemFactp(@RequestParam("idfac")   Integer nrofac,
                                                  @RequestParam("nroitem") Integer nroit){
                                               
      try {
        int nroi = tpteRepository.deleteItemFactp(nrofac,nroit);
        return new ResponseEntity<>(Integer.toString(nroi),HttpStatus.OK);
      } catch (Exception e) {
        return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR );
      }

    }
}
