package com.apiTpte.apiRestTpte.Controller;




import com.apiTpte.apiRestTpte.Servicios.AfipAuthService;
import com.apiTpte.apiRestTpte.Servicios.AfipCredentials;

import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api")

public class AfipController {

    private final AfipAuthService afipAuthService;

    // Inyección por constructor
    public AfipController(AfipAuthService afipAuthService) {
        this.afipAuthService = afipAuthService;
    }

    //@Autowired
    //JdbcTpteRepository tpteRepository;
   
    @GetMapping("/afip/auth")
    public AfipCredentials autenticar(
            @RequestParam(defaultValue = "wsfe") String service
    ) throws Exception {     
        return afipAuthService.autenticar(service);
    }

    
}
