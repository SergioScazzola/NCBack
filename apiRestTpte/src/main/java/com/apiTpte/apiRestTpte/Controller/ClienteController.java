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

import com.apiTpte.apiRestTpte.Entidades.Cliente;
import com.apiTpte.apiRestTpte.Repository.TpteRepository;



@CrossOrigin(origins = "${FRONTEND_URL}")
@RestController
@RequestMapping("/api/")
 
public class ClienteController {
    @Autowired
    TpteRepository tpteRepository;
   
    @SuppressWarnings("null")
    @GetMapping("/clientes")
    public ResponseEntity<List<Cliente>> getAllEmpresas() {
    try {
      List<Cliente> clientes = null;
            
      clientes = tpteRepository.AllClientes();
    
      if (clientes.isEmpty()) {
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
      } else {
         return new ResponseEntity<>(clientes, HttpStatus.OK);
      }
    } catch (Exception e) {
       return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @RequestMapping(value="/clientes/max")
  public int getCantClientes(){
     int cantc = tpteRepository.getMaxClientes();
     return cantc;
  }
  
  @RequestMapping(value ="/cliente" , params={"id"} )
  public ResponseEntity<Cliente> getClienteById(@RequestParam("id") Integer idcliente) {
    Cliente cliente = tpteRepository.findClienteById(idcliente);
    if (cliente != null){
      return new ResponseEntity<>(cliente, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
  }
    @PostMapping(value="/cliente/nuevo")
    // Graba un nuevo Cliente
    public ResponseEntity<String> crearCliente(@RequestBody Cliente cliente) {
       try {
        int nrocliente = tpteRepository.saveCliente(cliente);
        return new ResponseEntity<>(Integer.toString(nrocliente), HttpStatus.CREATED);
       } catch (Exception e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    @PutMapping(value="/cliente/actualizar", params={"id"})
    public ResponseEntity<String> updateCliente(@RequestParam("id") Integer idcliente,
                                                @RequestBody Cliente cliente){
      try {
        int resultado = tpteRepository.actualizarCliente(idcliente,cliente);    
        return new ResponseEntity<>(Integer.toString(resultado), HttpStatus.OK);
      } catch (Exception e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
     
      } 
    }
     @DeleteMapping(value="/cliente", params={"id"})    
    public ResponseEntity<String> borrarCliente(@RequestParam("id") Integer idcliente){
      try {
        int nrocliente = tpteRepository.deleteCliente(idcliente);
        return new ResponseEntity<>(Integer.toString(nrocliente),HttpStatus.OK);
      } catch (Exception e) {
        return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR );
      }

    }
   
}
