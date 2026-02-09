package com.apiTpte.apiRestTpte.Controller;


import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.CrossOrigin;

import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import com.apiTpte.apiRestTpte.Repository.JdbcTpteRepository;



@CrossOrigin(origins = "${FRONTEND_URL}")
@RestController
@RequestMapping("/api/")
 
public class TpteController {
    @Autowired
    JdbcTpteRepository tpteRepository;
   
    
}
