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

import com.apiTpte.apiRestTpte.Entidades.Gasto;
import com.apiTpte.apiRestTpte.Repository.TpteRepository;



@CrossOrigin(origins = "${FRONTEND_URL}")
@RestController
@RequestMapping("/api/")
 
public class GastoController {
    @Autowired
    TpteRepository tpteRepository;
   
    @SuppressWarnings("null")
    @GetMapping("/gastos")
    public ResponseEntity<List<Gasto>> getAllCobros() {
    try {
      List<Gasto> gastos = null;
            
      gastos = tpteRepository.AllGastos();
    
      if (gastos.isEmpty()) {
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
      } else {
         return new ResponseEntity<>(gastos, HttpStatus.OK);
      }
    } catch (Exception e) {
       return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @RequestMapping(value="/gastos/max")
  public int getCantGastos(){
     int cantg = tpteRepository.getMaxGastos();
     return cantg;
  }
  
  @RequestMapping(value ="/gasto" , params={"id"} )
  public ResponseEntity<Gasto> getGastoById(@RequestParam("id") Integer idgasto) {
    Gasto gasto = tpteRepository.findGastoById(idgasto);
    if (gasto != null){
      return new ResponseEntity<>(gasto, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
  }
    @PostMapping(value="/gasto/nuevo")
    // Graba un nuevo Gasto
    public ResponseEntity<String> crearGasto(@RequestBody Gasto gasto) {
       try {
        int nrog = tpteRepository.saveGasto(gasto);
        return new ResponseEntity<>(Integer.toString(nrog), HttpStatus.CREATED);
       } catch (Exception e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    @PutMapping(value="/gasto/actualizar", params={"id"})
    public ResponseEntity<String> updateGasto(@RequestParam("id") Integer idgasto,
                                                @RequestBody Gasto gasto){
      try {
        int resultado = tpteRepository.actualizarGasto(idgasto,gasto); 
        return new ResponseEntity<>(Integer.toString(resultado), HttpStatus.OK);
      } catch (Exception e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
     
      } 
    }
    @DeleteMapping(value="/gasto", params={"id"})    
    public ResponseEntity<String> borrarGasto(@RequestParam("id") Integer idgasto){
      try {
        int nrogasto = tpteRepository.deleteGasto(idgasto);
        return new ResponseEntity<>(Integer.toString(nrogasto),HttpStatus.OK);
      } catch (Exception e) {
        return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR );
      }

    }
   
}
