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


import com.apiTpte.apiRestTpte.Entidades.Viaje;
import com.apiTpte.apiRestTpte.Repository.TpteRepository;



@CrossOrigin(origins = "${FRONTEND_URL}")
@RestController
@RequestMapping("/api/")
 
public class ViajeController {
    @Autowired
    TpteRepository tpteRepository;
   
    @SuppressWarnings("null")
    @GetMapping("/viajes")
    public ResponseEntity<List<Viaje>> getAllViajes() {
    try {
      List<Viaje> viajes = null;
            
      viajes = tpteRepository.AllViajes();
    
      if (viajes.isEmpty()) {
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
      } else {
         return new ResponseEntity<>(viajes, HttpStatus.OK);
      }
    } catch (Exception e) {
       return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @RequestMapping(value="/viajes/max")
  public int getCantViajes(){
     int cantv = tpteRepository.getMaxViajes();
     return cantv;
  }
  
  @RequestMapping(value ="/viaje" , params={"id"} )
  public ResponseEntity<Viaje> getViajeById(@RequestParam("id") Integer idviaje) {
    Viaje viaje = tpteRepository.findViajeById(idviaje);
    if (viaje != null){
      return new ResponseEntity<>(viaje, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
  }
    @PostMapping(value="/viaje/nuevo")
    // Graba un nuevo Viaje
    public ResponseEntity<String> crearViaje(@RequestBody Viaje viaje) {
       try {
        int nroviaje = tpteRepository.saveViaje(viaje);
        return new ResponseEntity<>(Integer.toString(nroviaje), HttpStatus.CREATED);
       } catch (Exception e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    @PutMapping(value="/viaje/actualizar", params={"id"})
    public ResponseEntity<String> updateViaje(@RequestParam("id") Integer idviaje,
                                                @RequestBody Viaje viaje){
      try {
        int resultado = tpteRepository.actualizarViaje(idviaje,viaje);    
        return new ResponseEntity<>(Integer.toString(resultado), HttpStatus.OK);
      } catch (Exception e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
     
      } 
    }
     @DeleteMapping(value="/viaje", params={"id"})    
    public ResponseEntity<String> borrarViaje(@RequestParam("id") Integer idviaje){
      try {
        int nroviaje = tpteRepository.deleteViaje(idviaje);
        return new ResponseEntity<>(Integer.toString(nroviaje),HttpStatus.OK);
      } catch (Exception e) {
        return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR );
      }

    }
   
}
