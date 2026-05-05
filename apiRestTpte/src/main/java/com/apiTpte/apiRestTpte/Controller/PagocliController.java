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


import com.apiTpte.apiRestTpte.Entidades.Pagocli;
import com.apiTpte.apiRestTpte.Entidades.Viaje;
import com.apiTpte.apiRestTpte.Repository.TpteRepository;



// PAGOS DEL CLIENTE
@RestController
@RequestMapping("/api/pagocli/")
 
public class PagocliController {
    @Autowired
    TpteRepository tpteRepository;
   
    @SuppressWarnings("null")
    @GetMapping("/pagos")
    public ResponseEntity<List<Pagocli>> getAllPagos() {
    try {
      List<Pagocli> pagos = null;
            
      pagos = tpteRepository.AllPagosCli();
    
      if (pagos.isEmpty()) {
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
      } else {
         return new ResponseEntity<>(pagos, HttpStatus.OK);
      }
    } catch (Exception e) {
       return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
   @SuppressWarnings("null")
   @RequestMapping(value="/pagosxcliente", params={"idcliente"})
    public ResponseEntity<List<Pagocli>> getPagosxCliente(@RequestParam("idcliente") Integer idcli) {
    try {
      List<Pagocli> pagos = null;
            
      pagos = tpteRepository.PagosxCliente(idcli);
    
      if (pagos.isEmpty()) {
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
      } else {
         return new ResponseEntity<>(pagos, HttpStatus.OK);
      }
    } catch (Exception e) {
       return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @RequestMapping(value="/pago/max")
  public int getCantPagos(){
     int cantp = tpteRepository.getMaxPagosCli();
     return cantp;
  }
  
  @RequestMapping(value ="/pago" , params={"id"} )
  public ResponseEntity<Pagocli> getPagoById(@RequestParam("id") Integer idpago) {
    Pagocli pago = tpteRepository.findPagoCliById(idpago);
    if (pago != null){
      return new ResponseEntity<>(pago, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
  }
  @PostMapping(value="/pago/nuevo")
    // Graba un nuevo Pago del Cliente
    public ResponseEntity<String> crearPago(@RequestBody Pagocli pago) {
       try {
        int nrop = tpteRepository.savePagoCli(pago);
        return new ResponseEntity<>(Integer.toString(nrop), HttpStatus.CREATED);
       } catch (Exception e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    @PutMapping(value="/pago/actualizar", params={"id"})
    public ResponseEntity<String> updatePago(@RequestParam("id") Integer idpago,
                                             @RequestBody Pagocli pago){
      try {
        int resultado = tpteRepository.actualizarPagoCli(idpago,pago);    
        return new ResponseEntity<>(Integer.toString(resultado), HttpStatus.OK);
      } catch (Exception e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
     
      } 
    }
    @DeleteMapping(value="/pago", params={"id"})    
    public ResponseEntity<String> borrarPago(@RequestParam("id") Integer idpago){
      try {
        int nropago = tpteRepository.deletePagoCli(idpago);
        return new ResponseEntity<>(Integer.toString(nropago),HttpStatus.OK);
      } catch (Exception e) {
        return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR );
      }

    }
   
}
