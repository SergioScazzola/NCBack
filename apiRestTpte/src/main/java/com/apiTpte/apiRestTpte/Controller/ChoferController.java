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

import com.apiTpte.apiRestTpte.Entidades.Chofer;
import com.apiTpte.apiRestTpte.Repository.TpteRepository;



@CrossOrigin(origins = "${FRONTEND_URL}")
@RestController
@RequestMapping("/api/")
 
public class ChoferController {
    @Autowired
    TpteRepository tpteRepository;
   
    @SuppressWarnings("null")
    @GetMapping("/choferes")
    public ResponseEntity<List<Chofer>> getAllChoferes() {
    try {
      List<Chofer> choferes = null;
            
      choferes = tpteRepository.AllChoferes();
    
      if (choferes.isEmpty()) {
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
      } else {
         return new ResponseEntity<>(choferes, HttpStatus.OK);
      }
    } catch (Exception e) {
       return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @RequestMapping(value="/choferes/max")
  public int getCantChoferes(){
     int cantc = tpteRepository.getMaxChoferes();
     return cantc;
  }
  
  @RequestMapping(value ="/chofer" , params={"id"} )
  public ResponseEntity<Chofer> getChoferById(@RequestParam("id") Integer idchofer) {
    Chofer chofer = tpteRepository.findChoferById(idchofer);
    if (chofer != null){
      return new ResponseEntity<>(chofer, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
  }
    @PostMapping(value="/chofer/nuevo")
    // Graba un nuevo chofer
    public ResponseEntity<String> crearChofer(@RequestBody Chofer chofer) {
       try {
        int nrochofer = tpteRepository.saveChofer(chofer);
        return new ResponseEntity<>(Integer.toString(nrochofer), HttpStatus.CREATED);
       } catch (Exception e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    @PutMapping(value="/chofer/actualizar", params={"id"})
    public ResponseEntity<String> updateChofer(@RequestParam("id") Integer idchofer,
                                                @RequestBody Chofer chofer){
      try {
        int resultado = tpteRepository.actualizarChofer(idchofer,chofer);    
        return new ResponseEntity<>(Integer.toString(resultado), HttpStatus.OK);
      } catch (Exception e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
     
      } 
    }
     @DeleteMapping(value="/chofer", params={"id"})    
    public ResponseEntity<String> borrarChofer(@RequestParam("id") Integer idchofer){
      try {
        int nrochofer = tpteRepository.deleteChofer(idchofer);
        return new ResponseEntity<>(Integer.toString(nrochofer),HttpStatus.OK);
      } catch (Exception e) {
        return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR );
      }

    }
   
}
