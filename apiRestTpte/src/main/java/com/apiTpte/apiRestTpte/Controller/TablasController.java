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

import com.apiTpte.apiRestTpte.Entidades.Marca;
import com.apiTpte.apiRestTpte.Repository.JdbcTpteRepository;




@CrossOrigin(origins = "${FRONTEND_URL}")
@RestController
@RequestMapping("/tablas")
 
public class TablasController {
    @Autowired
    JdbcTpteRepository tpteRepository;
   
    //@SuppressWarnings("null")
    @GetMapping(value="/marcas")
    public ResponseEntity<List<Marca>> getAllMarcas() {
       return ResponseEntity.ok(tpteRepository.AllMarcas());
  
  }

 
   
}
