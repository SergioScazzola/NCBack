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

import com.apiTpte.apiRestTpte.Entidades.Chofer;
import com.apiTpte.apiRestTpte.Entidades.FactTpte;
import com.apiTpte.apiRestTpte.Entidades.Gasto;
import com.apiTpte.apiRestTpte.Entidades.Pago;
import com.apiTpte.apiRestTpte.Entidades.SaldoChof;

import com.apiTpte.apiRestTpte.Repository.JdbcTpteRepository;






@RestController
@RequestMapping("/api/chofer")
 
public class ChoferController {
    @Autowired
    JdbcTpteRepository tpteRepository;
   
    @SuppressWarnings("null")
    @GetMapping("/choferes")
    public ResponseEntity<List<Chofer>> getAllChoferes() {
        return ResponseEntity.ok(tpteRepository.AllChoferes());
   
  }
   //  Facturas de Transporte por Chofer
    @SuppressWarnings("null")
   @RequestMapping(value="/factxchofer", params={"idchof"})
    public ResponseEntity<List<FactTpte>> getFactTpteXChofer(@RequestParam("idchof") Integer idchofer) {
    try {
      List<FactTpte> facturas = null;
            
      facturas = tpteRepository.FacTXChofer(idchofer);
    
      if (facturas.isEmpty()) {
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
      } else {
         return new ResponseEntity<>(facturas, HttpStatus.OK);
      }
    } catch (Exception e) {
       return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
   //  Gastos de Viajes por Chofer
   @SuppressWarnings("null")
   @RequestMapping(value="/gastosxchofer", params={"idchof"})
    public ResponseEntity<List<Gasto>> getGastosXChofer(@RequestParam("idchof") Integer idchofer) {
    try {
      List<Gasto> gastos = null;
            
    gastos = tpteRepository.GastosXChofer(idchofer);
    
      if (gastos.isEmpty()) {
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
      } else {
         return new ResponseEntity<>(gastos, HttpStatus.OK);
      }
    } catch (Exception e) {
       return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

   // Pagos a Choferes
   @SuppressWarnings("null")
   @RequestMapping(value="/pagosxchofer", params={"idchof"})
    public ResponseEntity<List<Pago>> getPagosXChofer(@RequestParam("idchof") Integer idchofer) {
    try {
      List<Pago> pagos = null;
            
    pagos = tpteRepository.PagosXChofer(idchofer);
    
      if (pagos.isEmpty()) {
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
      } else {
         return new ResponseEntity<>(pagos, HttpStatus.OK);
      }
    } catch (Exception e) {
       return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }



  @RequestMapping(value="/max")
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

    // SALDOS DE LOS CHOFERES

    @RequestMapping(value = "/saldosxchof", params={"nrochof"})
    public ResponseEntity<List<SaldoChof>> getSaldosPorChofer(@RequestParam("nrochof") int nchof) {
    try {
      List<SaldoChof> saldos = null;
            
      saldos = tpteRepository.getSaldosPorChofer(nchof);
    
      if (saldos.isEmpty()) {
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
      } else {
         return new ResponseEntity<>(saldos, HttpStatus.OK);
      }
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PostMapping(value="/saldo/nuevo")
    // Graba un nuevo Saldo del Chofer
    public ResponseEntity<String> crearSaldoChofer(@RequestBody SaldoChof saldoc) {
       try {
        int nros = tpteRepository.saveSaldoChofer(saldoc);
        return new ResponseEntity<>(Integer.toString(nros), HttpStatus.CREATED);
       } catch (Exception e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
      }

    }
     @PutMapping(value="/actsaldochof")
     public ResponseEntity<String> updateSaldoCliente(@RequestBody SaldoChof saldochof){
      try {
        int resultado = tpteRepository.actSaldodelChofer(saldochof);    
        return new ResponseEntity<>(Integer.toString(resultado), HttpStatus.OK);
      } catch (Exception e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
     
      } 
    }
      // actualiza el saldo inicial del Chofer en la tabla "choferes"
    @PutMapping(value="/actsaldoini")
     public ResponseEntity<String> updateSaldoChofer(@RequestBody SaldoChof saldoc){
      try {
        int resultado = tpteRepository.actSaldoInicial(saldoc);    
        return new ResponseEntity<>(Integer.toString(resultado), HttpStatus.OK);
      } catch (Exception e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
     
      } 
    }
                                     
    @RequestMapping(value ="/saldo" , params={"idchofer","nrosaldo"} )
  public ResponseEntity<SaldoChof> getSaldodelChofer(@RequestParam("idchofer") Integer idchof,
                                                   @RequestParam("nrosaldo") Integer  nros) {
    SaldoChof scli = tpteRepository.getSaldoDelChofer(idchof,nros);
    if (scli != null){
      return new ResponseEntity<>(scli, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
  }
   
}
