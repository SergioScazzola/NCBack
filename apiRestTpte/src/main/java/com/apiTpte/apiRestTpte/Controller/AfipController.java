package com.apiTpte.apiRestTpte.Controller;




import com.apiTpte.apiRestTpte.Entidades.Ticket;
import com.apiTpte.apiRestTpte.Repository.JdbcTpteRepository;
import com.apiTpte.apiRestTpte.Servicios.AfipAuthService;
import com.apiTpte.apiRestTpte.Servicios.AfipCredentials;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.http.HttpStatus;
import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api")

public class AfipController {
    
    @Autowired
    JdbcTpteRepository tpteRepository;
    private final AfipAuthService afipAuthService;

    // Inyección por constructor
    public AfipController(AfipAuthService afipAuthService) {
        this.afipAuthService = afipAuthService;
    }

 
   
    @GetMapping("/afip/auth")
    public AfipCredentials autenticar(
            @RequestParam(defaultValue = "wsfe") String service
    ) throws Exception {     
        return afipAuthService.autenticar(service);
    }

    @GetMapping("/afip/ticket")
    public ResponseEntity<Ticket> getTicket() throws Exception {     
        Ticket ticket = tpteRepository.selectTicket();
        Date fecexp = ticket.getFechaexp();
        Date hoy    = new Date();
        int resp    =  0;
        if (ticket.getToken()==null || ticket.getToken().isEmpty() || hoy.after(fecexp)){ //token nulo o expirado, autenticar
           try {
              AfipCredentials crede = afipAuthService.autenticar("wsfe");
              SimpleDateFormat  ffecha = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
              String fesolcred = crede.generationTime().substring(0,19).replace("T"," ");
              String feexpcred = crede.expirationTime().substring(0,19).replace("T"," ");
              ticket.setFechasol(ffecha.parse(fesolcred));
              ticket.setFechaexp(ffecha.parse(feexpcred));
              ticket.setToken(crede.token());
              ticket.setSign(crede.sign());
              resp = tpteRepository.saveTicket(ticket);
              return ResponseEntity.ok(ticket);

           } catch (Exception ex){
              ex.printStackTrace(); // esto imprimirá el error real en tu consola
              return ResponseEntity.status(HttpStatus.SC_INTERNAL_SERVER_ERROR)
                    .body(null);
           }           
        } else { // no es nulo, ni esta vencido
          return ResponseEntity.ok(ticket);
        }
      
    }
    
}
