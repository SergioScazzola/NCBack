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

import com.apiTpte.apiRestTpte.Entidades.Pago;
import com.apiTpte.apiRestTpte.Repository.TpteRepository;



@CrossOrigin(origins = "${FRONTEND_URL}")
@RestController
@RequestMapping("/api/")
 
public class PagoController {
    @Autowired
    TpteRepository tpteRepository;
   
    @SuppressWarnings("null")
    @GetMapping("/pagos")
    public ResponseEntity<List<Pago>> getAllPagos() {
    try {
      List<Pago> pagos = null;
            
      pagos = tpteRepository.AllPagos();
    
      if (pagos.isEmpty()) {
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
      } else {
         return new ResponseEntity<>(pagos, HttpStatus.OK);
      }
    } catch (Exception e) {
       return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @RequestMapping(value="/pagos/max")
  public int getCantPagos(){
     int cantp = tpteRepository.getMaxPagos();
     return cantp;
  }
  
  @RequestMapping(value ="/pago" , params={"id"} )
  public ResponseEntity<Pago> getPagoById(@RequestParam("id") Integer idpago) {
    Pago pago = tpteRepository.findPagoById(idpago);
    if (pago != null){
      return new ResponseEntity<>(pago, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
  }
    @PostMapping(value="/pago/nuevo")
    // Graba un nuevo Pago a la Emp.de Tpte.
    public ResponseEntity<String> crearPago(@RequestBody Pago pago) {
       try {
        int nrop = tpteRepository.savePago(pago);
        return new ResponseEntity<>(Integer.toString(nrop), HttpStatus.CREATED);
       } catch (Exception e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    @PutMapping(value="/pago/actualizar", params={"id"})
    public ResponseEntity<String> updatePago(@RequestParam("id") Integer idpago,
                                                @RequestBody Pago pago){
      try {
        int resultado = tpteRepository.actualizarPago(idpago,pago);    
        return new ResponseEntity<>(Integer.toString(resultado), HttpStatus.OK);
      } catch (Exception e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
     
      } 
    }
    @DeleteMapping(value="/pago", params={"id"})    
    public ResponseEntity<String> borrarPago(@RequestParam("id") Integer idpago){
      try {
        int nropago = tpteRepository.deletePago(idpago);
        return new ResponseEntity<>(Integer.toString(nropago),HttpStatus.OK);
      } catch (Exception e) {
        return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR );
      }

    }
   
}
