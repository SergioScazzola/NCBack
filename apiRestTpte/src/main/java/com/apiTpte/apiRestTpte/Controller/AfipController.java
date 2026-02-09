package com.apiTpte.apiRestTpte.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.apiTpte.apiRestTpte.Entidades.ultimoComprobanteDTO;
import com.apiTpte.apiRestTpte.Servicios.AfipService;

@RestController
@RequestMapping("/afip")
public class AfipController {
private final AfipService afipService;

    public AfipController(AfipService afipService) {
        this.afipService = afipService;
    }

    @GetMapping("/ultcomp")
    public ultimoComprobanteDTO UltimoComprobante() {
        /*ultimoComprobanteDTO pp = new ultimoComprobanteDTO();
        pp.setUltimo(1520L);      
        return pp;*/
        return afipService.obtenerUltimoComprobante();
    }
}
