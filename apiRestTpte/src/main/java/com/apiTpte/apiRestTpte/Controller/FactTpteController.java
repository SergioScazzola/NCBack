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
import com.apiTpte.apiRestTpte.Repository.TpteRepository;



@CrossOrigin(origins = "${FRONTEND_URL}")
@RestController
@RequestMapping("/api/")
 
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

  @RequestMapping(value="/facstp/max")
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
   
}
