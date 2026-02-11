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


import com.apiTpte.apiRestTpte.Entidades.EmpTpte;
import com.apiTpte.apiRestTpte.Repository.TpteRepository;



@CrossOrigin(origins = "${FRONTEND_URL}")
@RestController
@RequestMapping("/api/")
 
public class EmpTpteController {
    @Autowired
    TpteRepository tpteRepository;
   
    @SuppressWarnings("null")
    @GetMapping("/emps")
    public ResponseEntity<List<EmpTpte>> getAllEmpresas() {
    try {
      List<EmpTpte> emps = null;
            
      emps = tpteRepository.AllEmpresas();
    
      if (emps.isEmpty()) {
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
      } else {
         return new ResponseEntity<>(emps, HttpStatus.OK);
      }
    } catch (Exception e) {
       return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @RequestMapping(value="/emps/max")
  public int getCantEmpresas(){
     int cante = tpteRepository.getMaxEmpresas();
     return cante;
  }
  
  @RequestMapping(value ="/emptpte" , params={"id"} )
  public ResponseEntity<EmpTpte> getEmpresaById(@RequestParam("id") Integer idempresa) {
    EmpTpte emptpte = tpteRepository.findEmpresaById(idempresa);
    if (emptpte != null){
      return new ResponseEntity<>(emptpte, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
  }
    @PostMapping(value="/emptpte/nuevo")
    // Graba un nuevo chofer
    public ResponseEntity<String> crearEmpresa(@RequestBody EmpTpte emptpte) {
       try {
        int nroempresa = tpteRepository.saveEmpresa(emptpte);
        return new ResponseEntity<>(Integer.toString(nroempresa), HttpStatus.CREATED);
       } catch (Exception e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    @PutMapping(value="/emptpte/actualizar", params={"id"})
    public ResponseEntity<String> updateEmpresa(@RequestParam("id") Integer idempresa,
                                                @RequestBody EmpTpte emptpte){
      try {
        int resultado = tpteRepository.actualizarEmpresa(idempresa,emptpte);    
        return new ResponseEntity<>(Integer.toString(resultado), HttpStatus.OK);
      } catch (Exception e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
     
      } 
    }
     @DeleteMapping(value="/emptpte", params={"id"})    
    public ResponseEntity<String> borrarEmpresa(@RequestParam("id") Integer idempresa){
      try {
        int nroempresa = tpteRepository.deleteEmpresa(idempresa);
        return new ResponseEntity<>(Integer.toString(nroempresa),HttpStatus.OK);
      } catch (Exception e) {
        return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR );
      }

    }
   
}
