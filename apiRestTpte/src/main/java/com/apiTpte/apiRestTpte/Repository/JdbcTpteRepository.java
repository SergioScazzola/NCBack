package com.apiTpte.apiRestTpte.Repository;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.apiTpte.apiRestTpte.Entidades.Camion;
import com.apiTpte.apiRestTpte.Entidades.Chofer;
import com.apiTpte.apiRestTpte.Entidades.Cliente;
import com.apiTpte.apiRestTpte.Entidades.Cobro;
import com.apiTpte.apiRestTpte.Entidades.EmpTpte;
import com.apiTpte.apiRestTpte.Entidades.FactCli;
import com.apiTpte.apiRestTpte.Entidades.FactTpte;
import com.apiTpte.apiRestTpte.Entidades.Gasto;
import com.apiTpte.apiRestTpte.Entidades.ItfactC;
import com.apiTpte.apiRestTpte.Entidades.ItfactT;
import com.apiTpte.apiRestTpte.Entidades.Pago;
import com.apiTpte.apiRestTpte.Entidades.Viaje;

@Repository
public class JdbcTpteRepository implements TpteRepository {
      @Autowired
      private JdbcTemplate jdbcTemplate;


      // *** CHOFERES *** //
    
      @Override
      public List<Chofer> AllChoferes() {   
        String selec = "SELECT * FROM choferes ORDER BY nombre";
        return jdbcTemplate.query(selec, BeanPropertyRowMapper.newInstance(Chofer.class));
      }
      @Override
      public int getMaxChoferes(){
        String consulta = "SELECT MAX(idChofer) FROM choferes";
     
        Object obj = jdbcTemplate.queryForObject(consulta,Integer.class);    
        if (obj==null){
          return 0;
        } else {
          return ((int)obj);
        }         
      }   
      @Override
      public Chofer findChoferById(int id) {
        String q = "SELECT * FROM choferes WHERE idChofer=?";
        try {
          Chofer chofer = jdbcTemplate.queryForObject(q,
              BeanPropertyRowMapper.newInstance(Chofer.class), id);          
          return chofer;
        } catch (IncorrectResultSizeDataAccessException e) {
          return null;
        }
      }
      
   

    @Override
    public int saveChofer(Chofer chofer){     
      // Graba nuevo Chofer 
      int resu = 0;
      try {                   
          resu = jdbcTemplate.update("INSERT choferes(idChofer,idEmpresa,empresa,nombre,domicilio,localidad,cuit,"+
                                    "nrodoc,telefono,notas) VALUES(?,?,?,?,?,?,?,?,?,?) ",
                    new Object[] { chofer.getIdChofer(),chofer.getIdEmpresa(),chofer.getEmpresa(),chofer.getNombre(),
                                   chofer.getDomicilio(),chofer.getLocalidad(),chofer.getCuit(),
                                   chofer.getNrodoc(),chofer.getTelefono(),chofer.getNotas()
                                });
        } catch (IncorrectResultSizeDataAccessException e) {
          return -3;
      }
      return resu; 
    }
  @Override
      public int actualizarChofer(int nroc, Chofer chofer){      
      int resu = 0;
      try {                   
          resu = jdbcTemplate.update("UPDATE choferes SET idEmpresa=?,empresa=?,nombre=?,domicilio=?,localidad=?,cuit=?,"+
                                    "nrodoc=?,idEmptpte=?,emptpte=?"+" WHERE idChofer=?",
                   new Object[] {  chofer.getIdEmpresa(),chofer.getEmpresa(),chofer.getNombre(),
                                   chofer.getDomicilio(),chofer.getLocalidad(),chofer.getCuit(),
                                   chofer.getNrodoc(),chofer.getTelefono(),chofer.getNotas(),chofer.getIdChofer()
                                });
        } catch (IncorrectResultSizeDataAccessException e) {
          return -3;
      }
      return resu; 
    }
    @Override
    public int deleteChofer(int nrochofer){
      int resu = 0;
      try {
        resu = jdbcTemplate.update("DELETE FROM choferes WHERE idChofer="+nrochofer);
      } catch (DataAccessException dae){
        resu = -5;   
      }
      return resu;
    }   

    // *** CAMIONES *** //
      @Override
      public List<Camion> AllCamiones() {   
        String selec = "SELECT * FROM camiones ORDER BY tipo ASC,marca ASC,modelo ASC,anio DES";
        return jdbcTemplate.query(selec, BeanPropertyRowMapper.newInstance(Camion.class));
      }
      @Override
      public int getMaxCamiones(){
        String consulta = "SELECT MAX(idCamion) FROM camiones";
     
        Object obj = jdbcTemplate.queryForObject(consulta,Integer.class);    
        if (obj==null){
          return 0;
        } else {
          return ((int)obj);
        }         
      }   
      @Override
      public Camion findCamionById(int id) {
        String q = "SELECT * FROM camiones WHERE idCamion=?";
        try {
          Camion camion = jdbcTemplate.queryForObject(q,
              BeanPropertyRowMapper.newInstance(Camion.class), id);          
          return camion;
        } catch (IncorrectResultSizeDataAccessException e) {
          return null;
        }
      }  
    
      @Override
      public int actualizarCamion(int nroc, Camion camion){      
      int resu = 0;
      try {                   
          resu = jdbcTemplate.update("UPDATE camiones SET domChasis=?,domAcoplado=?,marca=?,modelo=?,"+
                                    "anio=?,idEmptpte=?,emptpte=?"+" WHERE idCamion=?",
                    new Object[] { camion.getDomChasis(), camion.getDomAcoplado(), camion.getMarca(),
                                   camion.getModelo(),camion.getAnio(),camion.getEmptpte(),camion.getEmptpte(),
                                   camion.getIdCamion()
                                });
        } catch (IncorrectResultSizeDataAccessException e) {
          return -3;
      }
      return resu; 
    }
    @Override
      public int saveCamion(Camion camion){     
      // Graba nuevo Camion 
      int resu = 0;
      try {                   
          resu = jdbcTemplate.update("INSERT camiones(idCamion,domChasis,domAcoplado,marca,modelo,"+
                                    "anio,idEmptpte,emptpte) VALUES(?,?,?,?,?,?,?,?) ",
                    new Object[] { camion.getIdCamion(),camion.getDomChasis(), camion.getDomAcoplado(), camion.getMarca(),
                                   camion.getModelo(),camion.getAnio(),camion.getEmptpte(),camion.getEmptpte()
                                });
        } catch (IncorrectResultSizeDataAccessException e) {
          return -3;
      }
      return resu; 
    }
     @Override
    public int deleteCamion(int nrocamion){
      int resu = 0;
      try {
        resu = jdbcTemplate.update("DELETE FROM camiones WHERE idCamion="+nrocamion);
      } catch (DataAccessException dae){
        resu = -5;   
      }
      return resu;
    }   
    // EMPRESAS DE TRANSPORTE //

      @Override
      public List<EmpTpte> AllEmpresas() {   
        String selec = "SELECT * FROM empstpte ORDER BY nombre";
        return jdbcTemplate.query(selec, BeanPropertyRowMapper.newInstance(EmpTpte.class));
      }
      @Override
      public int getMaxEmpresas(){
        String consulta = "SELECT MAX(idEmpresa) FROM empstpte";
     
        Object obj = jdbcTemplate.queryForObject(consulta,Integer.class);    
        if (obj==null){
          return 0;
        } else {
          return ((int)obj);
        }         
      }   
      @Override
      public EmpTpte findEmpresaById(int id) {
        String q = "SELECT * FROM empstpte WHERE idEmpresa=?";
        try {
          EmpTpte emptpte = jdbcTemplate.queryForObject(q,
              BeanPropertyRowMapper.newInstance(EmpTpte.class), id);          
          return emptpte;
        } catch (IncorrectResultSizeDataAccessException e) {
          return null;
        }
      }  
    
      @Override
      public int actualizarEmpresa(int nroc, EmpTpte emptpte){      
      int resu = 0;
      try {                   
          resu = jdbcTemplate.update("UPDATE empstpte SET nombre=?,domicilio=?,localidad=?,email=?,"+
                                    "cuit=?,telefono=?,contacto=?,notas=?,saldoini=?"+" WHERE idEmpresa=?",
                    new Object[] { emptpte.getNombre(),emptpte.getDomicilio(),emptpte.getLocalidad(),
                                  emptpte.getEmail(),emptpte.getCuit(),emptpte.getTelefono(),emptpte.getContacto(),
                                  emptpte.getNotas(),emptpte.getSaldoini(),emptpte.getIdEmpresa() 
                                });
        } catch (IncorrectResultSizeDataAccessException e) {
          return -3;
      }
      return resu; 
    }
    @Override
      public int saveEmpresa(EmpTpte emptpte){     
      // Graba nueva Empresa de Transporte 
      int resu = 0;
      try {                   
          resu = jdbcTemplate.update("INSERT empstpte(idEmpresa,nombre,domicilio,localidad,email,"+
                                    "cuit,telefono,contacto,notas,saldoini) VALUES(?,?,?,?,?,?,?,?,?,?) ",
                    new Object[] {emptpte.getIdEmpresa(),emptpte.getNombre(),emptpte.getDomicilio(),emptpte.getLocalidad(),
                                  emptpte.getEmail(),emptpte.getCuit(),emptpte.getTelefono(),emptpte.getContacto(),
                                  emptpte.getNotas(),emptpte.getSaldoini() 
                                });
        } catch (IncorrectResultSizeDataAccessException e) {
          return -3;
      }
      return resu; 
    }
    @Override
    public int deleteEmpresa(int nroempresa){
      int resu = 0;
      try {
        resu = jdbcTemplate.update("DELETE FROM empstpte WHERE idEmpresa="+nroempresa);
      } catch (DataAccessException dae){
        resu = -5;   
      }
      return resu;
    }   

    // CLIENTES //

       @Override
      public List<Cliente> AllClientes() {   
        String selec = "SELECT * FROM clientes ORDER BY nombre";
        return jdbcTemplate.query(selec, BeanPropertyRowMapper.newInstance(Cliente.class));
      }
      @Override
      public int getMaxClientes(){
        String consulta = "SELECT MAX(idCliente) FROM clientes";
     
        Object obj = jdbcTemplate.queryForObject(consulta,Integer.class);    
        if (obj==null){
          return 0;
        } else {
          return ((int)obj);
        }         
      }   
      @Override
      public Cliente findClienteById(int id) {
        String q = "SELECT * FROM clientes WHERE idCliente=?";
        try {
          Cliente cliente = jdbcTemplate.queryForObject(q,
              BeanPropertyRowMapper.newInstance(Cliente.class), id);          
          return cliente;
        } catch (IncorrectResultSizeDataAccessException e) {
          return null;
        }
      }  
 
      @Override
      public int actualizarCliente(int nroc, Cliente cliente){      
      int resu = 0;
      try {                   
          resu = jdbcTemplate.update("UPDATE clientes SET nombre=?,domicilio=?,localidad=?,telefono=?,"+
                                    "email=?,contacto=?,cuit=?,notas=?,saldoini=?"+" WHERE idCliente=?",
                    new Object[] { cliente.getNombre(),cliente.getDomicilio(),cliente.getLocalidad(),cliente.getTelefono(),
                                   cliente.getEmail(),cliente.getContacto(),cliente.getCuit(),cliente.getNotas(),
                                   cliente.getSaldoini(),cliente.getIdCliente()                                     
                                });
        } catch (IncorrectResultSizeDataAccessException e) {
          return -3;
      }
      return resu; 
    }
    @Override
      public int saveCliente(Cliente cliente){     
      // Graba nuevo Cliente 
      int resu = 0;
      try {                   
          resu = jdbcTemplate.update("INSERT clientes(idCliente,nombre,domicilio,localidad,telefono,"+
                                    "email,contacto,cuit,notas,saldoini) VALUES(?,?,?,?,?,?,?,?,?,?) ",
                    new Object[] { cliente.getIdCliente(),cliente.getNombre(),cliente.getDomicilio(),
                                   cliente.getLocalidad(),cliente.getTelefono(),
                                   cliente.getEmail(),cliente.getContacto(),cliente.getCuit(),cliente.getNotas(),
                                   cliente.getSaldoini()
                                });
        } catch (IncorrectResultSizeDataAccessException e) {
          return -3;
      }
      return resu; 
    }
    @Override
    public int deleteCliente(int nrocliente){
      int resu = 0;
      try {
        resu = jdbcTemplate.update("DELETE FROM clientes WHERE idCliente="+nrocliente);
      } catch (DataAccessException dae){
        resu = -5;   
      }
      return resu;
    }   

    // VIAJES //

       @Override
      public List<Viaje> AllViajes() {   
        String selec = "SELECT * FROM viajes ORDER BY fecha DES";
        return jdbcTemplate.query(selec, BeanPropertyRowMapper.newInstance(Viaje.class));
      }
      @Override
      public int getMaxViajes(){
        String consulta = "SELECT MAX(idViaje) FROM viajes";
     
        Object obj = jdbcTemplate.queryForObject(consulta,Integer.class);    
        if (obj==null){
          return 0;
        } else {
          return ((int)obj);
        }         
      }   
      @Override
      public Viaje findViajeById(int id) {
        String q = "SELECT * FROM viajes WHERE idViaje=?";
        try {
          Viaje viaje = jdbcTemplate.queryForObject(q,
              BeanPropertyRowMapper.newInstance(Viaje.class), id);          
          return viaje;
        } catch (IncorrectResultSizeDataAccessException e) {
          return null;
        }
      }  

      @Override
      public int actualizarViaje(int nrov, Viaje viaje){      
      int resu = 0;
      try {                   
          resu = jdbcTemplate.update("UPDATE viajes SET fecha=?,idEmpTpte=?,nometpte=?,idChofer=?,nomchofer=?,"+
                                    "idCliente=?,nomcliente=?,cuitchofer=?,idCamion=?,domChasis=?,domAcop=?,"+
                                    "origen=?,destino=?,ctg=?,titctg=?,cantkm=?,cargaton=?,"+
                                    "tarifap=?,ltsgasoil=?,impviaje=? WHERE idViaje=?",
                    new Object[] {viaje.getFecha(),viaje.getIdEmpTpte(),viaje.getNometpte(),viaje.getIdChofer(),
                                  viaje.getNomchofer(),viaje.getIdCliente(),viaje.getNomcliente(),viaje.getCuitchofer(),
                                  viaje.getIdCamion(),viaje.getDomChasis(),viaje.getDomAcop(),viaje.getOrigen(),
                                  viaje.getDestino(),viaje.getCtg(),viaje.getTitctg(),viaje.getCantkm(),viaje.getCargaton(),
                                  viaje.getTarifap(),viaje.getLtsgasoil(),viaje.getImpviaje(),viaje.getIdViaje()
                                });
        } catch (IncorrectResultSizeDataAccessException e) {
          return -3;
      }
      return resu; 
    }
    @Override
      public int saveViaje(Viaje viaje){     
      // Graba nuevo Viaje 
      int resu = 0;
      try {                   
          resu = jdbcTemplate.update("INSERT viajes(idViaje,fecha,idEmpTpte,nometpte,idChofer,"+
                                    "nomchofer,idCliente,nomcliente,cuitchofer,idCamion,domChasis,"+
                                    "domAcop,origen,destino,ctg,titctg,cantkm,cargaton,"+
                                    "tarifap,ltsgasoil,impviaje) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ",
                    new Object[] {viaje.getIdViaje(),viaje.getFecha(),viaje.getIdEmpTpte(),viaje.getNometpte(),viaje.getIdChofer(),
                                  viaje.getNomchofer(),viaje.getIdCliente(),viaje.getNomcliente(),viaje.getCuitchofer(),
                                  viaje.getIdCamion(),viaje.getDomChasis(),viaje.getDomAcop(),viaje.getOrigen(),
                                  viaje.getDestino(),viaje.getCtg(),viaje.getTitctg(),viaje.getCantkm(),viaje.getCargaton(),
                                  viaje.getTarifap(),viaje.getLtsgasoil(),viaje.getImpviaje()
                                });
        } catch (IncorrectResultSizeDataAccessException e) {
          return -3;
      }
      return resu; 
    }
    @Override
    public int deleteViaje(int nroviaje){
      int resu = 0;
      try {
        resu = jdbcTemplate.update("DELETE FROM viajes WHERE idViaje="+nroviaje);
      } catch (DataAccessException dae){
        resu = -5;   
      }
      return resu;
    }   

    // FACTURA DEL TRANSPORTE //

       @Override
      public List<FactTpte> AllFacstp() {   
        String selec = "SELECT * FROM facstp ORDER BY fecha DES";
        return jdbcTemplate.query(selec, BeanPropertyRowMapper.newInstance(FactTpte.class));
      }
      @Override
      public int getMaxFacstp(){
        String consulta = "SELECT MAX(idFactura) FROM facstp";
     
        Object obj = jdbcTemplate.queryForObject(consulta,Integer.class);    
        if (obj==null){
          return 0;
        } else {
          return ((int)obj);
        }         
      }   
      @Override
      public FactTpte findFactpById(int idfac) {
        String q = "SELECT * FROM facstp WHERE idFactura=?";
        try {
          FactTpte fac = jdbcTemplate.queryForObject(q,
              BeanPropertyRowMapper.newInstance(FactTpte.class), idfac);          
          return fac;
        } catch (IncorrectResultSizeDataAccessException e) {
          return null;
        }
      }  

      @Override
      public int actualizarFactp(int nrof, FactTpte fac){      
      int resu = 0;
      try {                   
          resu = jdbcTemplate.update("UPDATE facstp SET nrofactura=?,facndc=?,fecha=?,"+
                                    "idEmptpte=?,nomemptpte=?,cantit=?,impneto=?,tasaiva=?,"+
                                    "impiva=?,totalfac=? WHERE idFactura=?",
                    new Object[] {fac.getNrofactura(),fac.getFacndc(),fac.getFecha(),
                                  fac.getIdEmptpte(),fac.getNomempresa(),fac.getCantit(),fac.getImpneto(),
                                  fac.getTasaiva(),fac.getImpiva(),fac.getTotalfac(),fac.getIdFactura()
                                });
        } catch (IncorrectResultSizeDataAccessException e) {
          return -3;
      }
      return resu; 
    }
 
    @Override
      public int saveFactp(FactTpte fac){     
      // Graba nueva Factura del Transporte 
      int resu = 0;
      try {                   
          resu = jdbcTemplate.update("INSERT facstp(idFactura,nrofactura,facndc,fecha,"+
                                    "idEmptpte,nomemptpte,cantit,impneto,tasaiva,"+
                                    "impiva,totalfac VALUES(?,?,?,?,?,?,?,?,?,?,?) ",
                    new Object[] {fac.getIdFactura(),fac.getNrofactura(),fac.getFacndc(),fac.getFecha(),
                                  fac.getIdEmptpte(),fac.getNomempresa(),fac.getCantit(),
                                  fac.getImpneto(),fac.getTasaiva(),fac.getImpiva(),fac.getTotalfac()
                                });
        } catch (IncorrectResultSizeDataAccessException e) {
          return -3;
      }
      return resu; 
    }
    @Override
    public int deleteFactp(int nrofac){
      int resu = 0;
      try {
        resu = jdbcTemplate.update("DELETE FROM facstp WHERE idFactura="+nrofac);
      } catch (DataAccessException dae){
        resu = -5;   
      }
      return resu;
    }   
    @Override
    public List<ItfactT> getDetalleFactp(int nrofac){
       String selec = "SELECT * FROM dfacstp WHERE idFactura=? ORDER BY nroitem";         
       return jdbcTemplate.query(selec, BeanPropertyRowMapper.newInstance(ItfactT.class),nrofac);      
    }
    @Override
    public int saveItemFactp(ItfactT itfac){
    // Graba nuevo Item de Factura del Transporte 
      int resu = 0;
      try {                   
          resu = jdbcTemplate.update("INSERT dfacstp(idFactura,nroitem,idViaje,idChofer,"+
                                    "nomchofer,idEmptpte,nomemptpte,ctg,tarifa,cargaton,impneto,tasaiva,"+
                                    "impiva,totalitem VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?) ",
                    new Object[] {itfac.getIdFactura(),itfac.getNroitem(),itfac.getIdViaje(),itfac.getIdChofer(),
                                  itfac.getNomChofer(),itfac.getIdEmptpte(),itfac.getNomemptpte(),itfac.getCtg(),
                                  itfac.getTarifa(),itfac.getCargaton(),itfac.getImpneto(),itfac.getTasaiva(),
                                  itfac.getImpiva(),itfac.getTotalitem()
                                });
        } catch (IncorrectResultSizeDataAccessException e) {
          return -3;
      }
      return resu; 
    }
    @Override
    public int actualizarItemFactp(ItfactT itfac){
      int resu = 0;
      try {                   
          resu = jdbcTemplate.update("UPDATE dfacstp SET idViaje=?,idChofer=?,"+
                                    "nomchofer=?,idEmptpte=?,nomemptpte=?,ctg=?,tarifa=?,cargaton=?,"+
                                    "impneto=?,tasaiva=?,impiva=?,totalitem=? "+
                                    "WHERE idFactura=? AND nroitem=?",
                    new Object[] {itfac.getIdViaje(),itfac.getIdChofer(),itfac.getNomChofer(),
                                  itfac.getIdEmptpte(),itfac.getNomemptpte(),itfac.getCtg(),itfac.getTarifa(),
                                  itfac.getCargaton(),itfac.getImpneto(),itfac.getTasaiva(),itfac.getImpiva(),
                                  itfac.getTotalitem(),itfac.getIdFactura(),itfac.getNroitem()
                                });
        } catch (IncorrectResultSizeDataAccessException e) {
          return -3;
      }
      return resu; 
    }  

    @Override
    public int deleteItemFactp(int nrofac, int nroit){
      int resu = 0;
     try {
       resu = jdbcTemplate.update("DELETE FROM dfacstp WHERE idFactura="+nrofac+" AND nroitem="+nroit);
     } catch (DataAccessException dae){
       resu = -5;   
     }
     return resu;
    }

    // FACTURA EMITIDA AL CLIENTE //
     
      @Override
      public List<FactCli> AllFacscl() {   
        String selec = "SELECT * FROM facscl ORDER BY fecha DES";
        return jdbcTemplate.query(selec, BeanPropertyRowMapper.newInstance(FactCli.class));
      }
      @Override
      public int getMaxFacscl(){
        String consulta = "SELECT MAX(idFactura) FROM facscl";
     
        Object obj = jdbcTemplate.queryForObject(consulta,Integer.class);    
        if (obj==null){
          return 0;
        } else {
          return ((int)obj);
        }         
      }   
      @Override
      public FactCli findFacclById(int idfac) {
        String q = "SELECT * FROM facscl WHERE idFactura=?";
        try {
          FactCli fac = jdbcTemplate.queryForObject(q,
              BeanPropertyRowMapper.newInstance(FactCli.class), idfac);          
          return fac;
        } catch (IncorrectResultSizeDataAccessException e) {
          return null;
        }
      }  

      @Override
      public int actualizarFaccl(int nrof, FactCli fac){      
      int resu = 0;
      try {                   
          resu = jdbcTemplate.update("UPDATE facscl SET nrofactura=?,facndc=?,fecha=?,cantit=?,"+
                                    "idCliente=?,nomcliente=?,impneto=?,tasaiva=?,"+
                                    "impiva=?,totalfac=? WHERE idFactura=?",
                    new Object[] {fac.getNrofactura(),fac.getFacndc(),fac.getFecha(),fac.getCantit(),
                                  fac.getIdCliente(),fac.getNomcliente(),fac.getImpneto(),
                                  fac.getTasaiva(),fac.getImpiva(),fac.getTotalfac(),fac.getIdFactura()
                                });
        } catch (IncorrectResultSizeDataAccessException e) {
          return -3;
      }
      return resu; 
    }
 
    @Override
      public int saveFaccl(FactCli fac){     
      // Graba nueva Factura al Cliente 
      int resu = 0;
      try {                   
          resu = jdbcTemplate.update("INSERT facscl(idfactura,nrofactura,facndc,fecha,cantit,"+
                                     "idCliente,nomcliente,impneto,tasaiva,"+
                                     "impiva=?,totalfac VALUES(?,?,?,?,?,?,?,?,?,?,?) ",
                    new Object[] {fac.getIdFactura(),fac.getNrofactura(),fac.getFacndc(),fac.getFecha(),
                                  fac.getCantit(),fac.getIdCliente(),fac.getNomcliente(),
                                  fac.getImpneto(),fac.getTasaiva(),fac.getImpiva(),fac.getTotalfac()
                                });
        } catch (IncorrectResultSizeDataAccessException e) {
          return -3;
      }
      return resu; 
    }
    @Override
    public int deleteFaccl(int nrofac){
      int resu = 0;
      try {
        resu = jdbcTemplate.update("DELETE FROM facscl WHERE idFactura="+nrofac);
      } catch (DataAccessException dae){
        resu = -5;   
      }
      return resu;
    }   

    // DETALLE DE FACTURA AL CLIENTE //

    @Override
    public List<ItfactC> getDetalleFaccl(int nrofac){
       String selec = "SELECT * FROM dfacscl WHERE idFactura=? ORDER BY nroitem";         
       return jdbcTemplate.query(selec, BeanPropertyRowMapper.newInstance(ItfactC.class),nrofac);      
    }
    @Override
    public int saveItemFaccl(ItfactC itfac){
    // Graba nuevo Item de Factura al Cliente 
      int resu = 0;
    
      try {                   
          resu = jdbcTemplate.update("INSERT dfacstp(idFactura,nroitem,idViaje,idChofer,"+
                                    "nomchofer,idEmptpte,nomemptpte,ctg,tarifap,cargaton,impneto,tasaiva,"+
                                    "impiva,totalitem VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?) ",
                    new Object[] {itfac.getIdFactura(),itfac.getNroitem(),itfac.getIdViaje(),itfac.getIdChofer(),
                                  itfac.getNomChofer(),itfac.getIdEmptpte(),itfac.getNomemptpte(),itfac.getCtg(),
                                  itfac.getTarifap(),itfac.getCargaton(),itfac.getImpneto(),itfac.getTasaiva(),
                                  itfac.getImpiva(),itfac.getTotalitem()
                                });
        } catch (IncorrectResultSizeDataAccessException e) {
          return -3;
      }
      return resu; 
    }
    @Override
    public int actualizarItemFaccl(ItfactC itfac){
      int resu = 0;
      try {                   
          resu = jdbcTemplate.update("UPDATE dfacscl SET idViaje=?,idChofer=?,"+
                                    "nomchofer=?,idEmptpte=?,nomemptpte=?,ctg=?,tarifap=?,cargaton=?,"+
                                    "impneto=?,tasaiva=?,impiva=?,totalitem=? "+
                                    "WHERE idFactura=? AND nroitem=?",
                    new Object[] {itfac.getIdViaje(),itfac.getIdChofer(),itfac.getNomChofer(),
                                  itfac.getIdEmptpte(),itfac.getNomemptpte(),itfac.getCtg(),itfac.getTarifap(),
                                  itfac.getCargaton(),itfac.getImpneto(),itfac.getTasaiva(),itfac.getImpiva(),
                                  itfac.getTotalitem(),itfac.getIdFactura(),itfac.getNroitem()
                                });
        } catch (IncorrectResultSizeDataAccessException e) {
          return -3;
      }
      return resu; 
    }  

    @Override
    public int deleteItemFaccl(int nrofac, int nroit){
      int resu = 0;
     try {
       resu = jdbcTemplate.update("DELETE FROM dfacscl WHERE idFactura="+nrofac+" AND nroitem="+nroit);
     } catch (DataAccessException dae){
       resu = -5;   
     }
     return resu;
    }

    // COBROS A CLIENTES //

      @Override
      public List<Cobro> AllCobros() {   
        String selec = "SELECT * FROM cobros ORDER BY fecha";
        return jdbcTemplate.query(selec, BeanPropertyRowMapper.newInstance(Cobro.class));
      }
      @Override
      public int getMaxCobros(){
        String consulta = "SELECT MAX(idCobro) FROM cobros";
     
        Object obj = jdbcTemplate.queryForObject(consulta,Integer.class);    
        if (obj==null){
          return 0;
        } else {
          return ((int)obj);
        }         
      }   
      @Override
      public Cobro findCobroById(int id) {
        String q = "SELECT * FROM cobros WHERE idCobro=?";
        try {
          Cobro cobro = jdbcTemplate.queryForObject(q,
              BeanPropertyRowMapper.newInstance(Cobro.class), id);          
          return cobro;
        } catch (IncorrectResultSizeDataAccessException e) {
          return null;
        }
      }  
 
      @Override
      public int actualizarCobro(int nroc, Cobro cobro){      
      int resu = 0;
      try {                   
          resu = jdbcTemplate.update("UPDATE cobros SET fecha=?,idCliente=?,nomcliente=?,nrofactura=?,"+
                                    "idmpago1=?,mediopago1=?,nrompago1=?,banco1=?,importe1=?,"+
                                    "idmpago2=?,mediopago2=?,nrompago2=?,banco2=?,importe2=?,"+
                                    "idmpago3=?,mediopago3=?,nrompago3=?,banco3=?,importe3=?,"+
                                    "imptotal=?,observaciones=? WHERE idCobro=?",
                    new Object[] { cobro.getFecha(),cobro.getIdCliente(),cobro.getNomcliente(),cobro.getNrofactura(),
                                   cobro.getIdmpago1(),cobro.getMediopago1(),cobro.getNrompago1(),cobro.getBanco1(),cobro.getImporte1(),
                                   cobro.getIdmpago2(),cobro.getMediopago2(),cobro.getNrompago2(),cobro.getBanco2(),cobro.getImporte2(),
                                   cobro.getIdmpago3(),cobro.getMediopago3(),cobro.getNrompago3(),cobro.getBanco3(),cobro.getImporte3(),
                                   cobro.getImptotal(),cobro.getObservaciones(),cobro.getIdCobro()
                                });
        } catch (IncorrectResultSizeDataAccessException e) {
          return -3;
      }
      return resu; 
    }
    @Override
      public int saveCobro(Cobro cobro){     
      // Graba nuevo Cobro 
      int resu = 0;
      try {                   
          resu = jdbcTemplate.update("INSERT cobros(idCobro,fecha,idCliente,nomcliente,nrofactura,"+
                                    "idmpago1,mediopago1,nrompago1,banco1,importe1,"+
                                    "idmpago2,mediopago2,nrompago2,banco2,importe2,"+
                                    "idmpago3,mediopago3,nrompago3,banco3,importe3,"+
                                    "imptotal,observaciones) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ",
                    new Object[] { cobro.getIdCobro(),cobro.getFecha(),cobro.getIdCliente(),cobro.getNomcliente(),cobro.getNrofactura(),
                                   cobro.getIdmpago1(),cobro.getMediopago1(),cobro.getNrompago1(),cobro.getBanco1(),cobro.getImporte1(),
                                   cobro.getIdmpago2(),cobro.getMediopago2(),cobro.getNrompago2(),cobro.getBanco2(),cobro.getImporte2(),
                                   cobro.getIdmpago3(),cobro.getMediopago3(),cobro.getNrompago3(),cobro.getBanco3(),cobro.getImporte3(),
                                   cobro.getImptotal(),cobro.getObservaciones()
                                });
        } catch (IncorrectResultSizeDataAccessException e) {
          return -3;
      }
      return resu; 
    }
    @Override
    public int deleteCobro(int nrocobro){
      int resu = 0;
      try {
        resu = jdbcTemplate.update("DELETE FROM cobros WHERE idCobro="+nrocobro);
      } catch (DataAccessException dae){
        resu = -5;   
      }
      return resu;
    }   
     // PAGOS A EMP. DE TPTE //

      @Override
      public List<Pago> AllPagos() {   
        String selec = "SELECT * FROM pagos ORDER BY fecha";
        return jdbcTemplate.query(selec, BeanPropertyRowMapper.newInstance(Pago.class));
      }
      @Override
      public int getMaxPagos(){
        String consulta = "SELECT MAX(idPago) FROM pagos";
     
        Object obj = jdbcTemplate.queryForObject(consulta,Integer.class);    
        if (obj==null){
          return 0;
        } else {
          return ((int)obj);
        }         
      }   
      @Override
      public Pago findPagoById(int id) {
        String q = "SELECT * FROM pagos WHERE idPago=?";
        try {
          Pago pago = jdbcTemplate.queryForObject(q,
              BeanPropertyRowMapper.newInstance(Pago.class), id);          
          return pago;
        } catch (IncorrectResultSizeDataAccessException e) {
          return null;
        }
      }  

      @Override
      public int actualizarPago(int nrop, Pago pago){      
      int resu = 0;
      try {                   
          resu = jdbcTemplate.update("UPDATE pagos SET fecha=?,idChofer=?,nomchofer=?,idmpago1=?,"+
                                    "mediopago1=?,nrompago1=?,banco1=?,importe1=?,"+
                                    "idmpago2=?,mediopago2=?,nrompago2=?,banco2=?,importe2=?,"+
                                    "idmpago3=?,mediopago3=?,nrompago3=?,banco3=?,importe3=?,"+
                                    "imptotal=?,observaciones=? WHERE idPago=?",
                    new Object[] { pago.getFecha(),pago.getIdChofer(),pago.getNomchofer(),
                                   pago.getIdmpago1(),pago.getMediopago1(),pago.getNrompago1(),pago.getBanco1(),pago.getImporte1(),
                                   pago.getIdmpago2(),pago.getMediopago2(),pago.getNrompago2(),pago.getBanco2(),pago.getImporte2(),
                                   pago.getIdmpago3(),pago.getMediopago3(),pago.getNrompago3(),pago.getBanco3(),pago.getImporte3(),
                                   pago.getImptotal(),pago.getObservaciones(),pago.getIdPago()
                                });
        } catch (IncorrectResultSizeDataAccessException e) {
          return -3;
      }
      return resu; 
    }
    @Override
      public int savePago(Pago pago){     
      // Graba nuevo Pago 
      int resu = 0;
      try {                   
          resu = jdbcTemplate.update("INSERT pagos(idPago,fecha,idChofer,nomchofer,idmpago1,"+
                                    "mediopago1,nrompago1,banco1,importe1,"+
                                    "idmpago2,mediopago2,nrompago2,banco2,importe2,"+
                                    "idmpago3,mediopago3,nrompago3,banco3,importe3,"+
                                    "imptotal,observaciones) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ",
                    new Object[] { pago.getIdPago(),pago.getFecha(),pago.getIdChofer(),pago.getNomchofer(),
                                   pago.getIdmpago1(),pago.getMediopago1(),pago.getNrompago1(),pago.getBanco1(),pago.getImporte1(),
                                   pago.getIdmpago2(),pago.getMediopago2(),pago.getNrompago2(),pago.getBanco2(),pago.getImporte2(),
                                   pago.getIdmpago3(),pago.getMediopago3(),pago.getNrompago3(),pago.getBanco3(),pago.getImporte3(),
                                   pago.getImptotal(),pago.getObservaciones()
                                });
        } catch (IncorrectResultSizeDataAccessException e) {
          return -3;
      }
      return resu; 
    }
    @Override
    public int deletePago(int nropago){
      int resu = 0;
      try {
        resu = jdbcTemplate.update("DELETE FROM pagos WHERE idPago="+nropago);
      } catch (DataAccessException dae){
        resu = -5;   
      }
      return resu;
    }   

    // GASTOS DE VIAJES Y GENERALES //

      @Override
      public List<Gasto> AllGastos() {   
        String selec = "SELECT * FROM gastos ORDER BY fecha";
        return jdbcTemplate.query(selec, BeanPropertyRowMapper.newInstance(Gasto.class));
      }
      @Override
      public int getMaxGastos(){
        String consulta = "SELECT MAX(idGasto) FROM gastos";
     
        Object obj = jdbcTemplate.queryForObject(consulta,Integer.class);    
        if (obj==null){
          return 0;
        } else {
          return ((int)obj);
        }         
      }   
      @Override
      public Gasto findGastoById(int id) {
        String q = "SELECT * FROM gastos WHERE idGasto=?";
        try {
          Gasto gasto = jdbcTemplate.queryForObject(q,
              BeanPropertyRowMapper.newInstance(Gasto.class), id);          
          return gasto;
        } catch (IncorrectResultSizeDataAccessException e) {
          return null;
        }
      }  

      @Override
      public int actualizarGasto(int nrog, Gasto gasto){      
      int resu = 0;
      try {                   
          resu = jdbcTemplate.update("UPDATE gastos SET fecha=?,idViaje=?,compGasto=?,provGasto=?,"+
                                    "cantGasto=?,unidGasto=?,preGasto=?,descGasto=?,impgasto=? "+
                                    "WHERE idGasto=?",
                    new Object[] { gasto.getFecha(),gasto.getIdViaje(),gasto.getCompGasto(),gasto.getProvGasto(),
                                   gasto.getCantgasto(),gasto.getUnidGasto(),gasto.getPreGasto(),
                                   gasto.getDescGasto(),gasto.getImpgasto(),gasto.getIdGasto()                                                                      
                                });
        } catch (IncorrectResultSizeDataAccessException e) {
          return -3;
      }
      return resu; 
    }
    @Override
      public int saveGasto(Gasto gasto){     
      // Graba nuevo Gasto 
      int resu = 0;
      try {                   
          resu = jdbcTemplate.update("INSERT gastos(idGasto,fecha,idViaje,compGasto,provGasto,"+               
                                     "cantGasto,unidGasto,preGasto,descGasto,impgasto) " + 
                                     "VALUES(?,?,?,?,?,?,?,?,?,?)",
                    new Object[] { gasto.getIdGasto(),gasto.getFecha(),gasto.getIdViaje(),gasto.getCompGasto(),gasto.getProvGasto(),
                                   gasto.getCantgasto(),gasto.getUnidGasto(),gasto.getPreGasto(),
                                   gasto.getDescGasto(),gasto.getImpgasto()
                                });
        } catch (IncorrectResultSizeDataAccessException e) {
          return -3;
      }
      return resu; 
    }
    @Override
    public int deleteGasto(int nrogasto){
      int resu = 0;
      try {
        resu = jdbcTemplate.update("DELETE FROM gastos WHERE idGasto="+nrogasto);
      } catch (DataAccessException dae){
        resu = -5;   
      }
      return resu;
    }   
}
