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

import com.apiTpte.apiRestTpte.Entidades.Cobro;
import com.apiTpte.apiRestTpte.Repository.TpteRepository;



@CrossOrigin(origins = "${FRONTEND_URL}")
@RestController
@RequestMapping("/api/")
 
public class CobroController {
    @Autowired
    TpteRepository tpteRepository;
   
    @SuppressWarnings("null")
    @GetMapping("/cobros")
    public ResponseEntity<List<Cobro>> getAllCobros() {
    try {
      List<Cobro> cobros = null;
            
      cobros = tpteRepository.AllCobros();
    
      if (cobros.isEmpty()) {
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
      } else {
         return new ResponseEntity<>(cobros, HttpStatus.OK);
      }
    } catch (Exception e) {
       return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @RequestMapping(value="/cobros/max")
  public int getCantCobros(){
     int cantc = tpteRepository.getMaxCobros();
     return cantc;
  }
  
  @RequestMapping(value ="/cobro" , params={"id"} )
  public ResponseEntity<Cobro> getPagoById(@RequestParam("id") Integer idcobro) {
    Cobro cobro = tpteRepository.findCobroById(idcobro);
    if (cobro != null){
      return new ResponseEntity<>(cobro, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
  }
    @PostMapping(value="/cobro/nuevo")
    // Graba un nuevo Cobro al Cliente
    public ResponseEntity<String> crearPago(@RequestBody Cobro cobro) {
       try {
        int nroc = tpteRepository.saveCobro(cobro);
        return new ResponseEntity<>(Integer.toString(nroc), HttpStatus.CREATED);
       } catch (Exception e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    @PutMapping(value="/cobro/actualizar", params={"id"})
    public ResponseEntity<String> updateCobro(@RequestParam("id") Integer idcobro,
                                                @RequestBody Cobro cobro){
      try {
        int resultado = tpteRepository.actualizarCobro(idcobro,cobro); 
        return new ResponseEntity<>(Integer.toString(resultado), HttpStatus.OK);
      } catch (Exception e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
     
      } 
    }
    @DeleteMapping(value="/cobro", params={"id"})    
    public ResponseEntity<String> borrarCobro(@RequestParam("id") Integer idcobro){
      try {
        int nrocobro = tpteRepository.deleteCobro(idcobro);
        return new ResponseEntity<>(Integer.toString(nrocobro),HttpStatus.OK);
      } catch (Exception e) {
        return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR );
      }

    }
   
}
