package com.apiTpte.apiRestTpte.Controller;




import com.apiTpte.apiRestTpte.Entidades.Ticket;
import com.apiTpte.apiRestTpte.Repository.JdbcTpteRepository;
import com.apiTpte.apiRestTpte.Servicios.AfipAuthService;
import com.apiTpte.apiRestTpte.Servicios.AfipCredentials;
import com.apiTpte.apiRestTpte.Servicios.AfipWsfeClient;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
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
    
    private String token;
    private String sign;

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

    // devuelve ticket de acceso a servicios de afip, si el ticket grabado está expirado -> solicita uno nuevo
    @GetMapping("/afip/ticket")
    public ResponseEntity<Ticket> getTicket() throws Exception {     
        SimpleDateFormat  ffecha = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Ticket ticket = tpteRepository.selectTicket(); // obtiene el ticket grabado
        String fecexp = ticket.getFechaexp();
        Date fechaexp = ffecha.parse(fecexp);
        Date   hoy    = new Date();
        ZoneId.of("America/Argentina/Buenos_Aires");
        int resp    =  0;
        if (ticket.getToken()==null || ticket.getToken().isEmpty() || hoy.after(fechaexp)){ //token nulo o expirado, autenticar
           try {
              AfipCredentials crede = afipAuthService.autenticar("wsfe");                           
              String fesolcred = crede.generationTime().substring(0,19).replace("T"," ");
              String feexpcred = crede.expirationTime().substring(0,19).replace("T"," ");
              ticket.setFechasol(fesolcred);
              ticket.setFechaexp(feexpcred);
              ticket.setToken(crede.token());
              ticket.setSign(crede.sign());
              token = ticket.getToken();
              sign  = ticket.getSign();
              System.out.println("fesolcred : "+fesolcred);
              System.out.println("fe.ticket : "+ticket.getFechasol());
              resp = tpteRepository.saveTicket(ticket);
              return ResponseEntity.ok(ticket);

           } catch (Exception ex){
              ex.printStackTrace(); // esto imprimirá el error real en tu consola
              return ResponseEntity.status(HttpStatus.SC_INTERNAL_SERVER_ERROR)
                    .body(null);
           }           
        } else { // no es nulo, ni esta vencido          
          token = ticket.getToken();
          sign  = ticket.getSign();
          System.out.println("fe.ticket No Vencido : "+ticket.getFechasol());
          return ResponseEntity.ok(ticket);
        }
      
    }

    @RequestMapping(value="/afip/ultComp", params={"tcomp"})
    public long getUltimoComp(@RequestParam("tcomp") String tcom){
        int tcomprob = 1;
        switch (tcom){ // analiza campo
          case "FACA" : { tcomprob = 1; }
                         break;
          case "NDCA"  : { tcomprob = 3; }
                         break;
          case "FACB"  : { tcomprob = 6; }
                         break;
          case "NDCB"  : { tcomprob = 8; }
                         break;
          case "NDDA"  : { tcomprob = 2; }
                         break;
          case "NDDB"  : { tcomprob = 7; }
                         break;
      };
      long ultimo;
      AfipWsfeClient wsfeClient = new AfipWsfeClient();
      try {
        ultimo = wsfeClient.getUltimoComprobante(
                  token,
                  sign,
                  30716748754L,
                  8,
                  tcomprob
            );
          return ultimo;
      } catch (Exception ex) {
         ex.printStackTrace();
         return 0;
      }
    }
      
}
