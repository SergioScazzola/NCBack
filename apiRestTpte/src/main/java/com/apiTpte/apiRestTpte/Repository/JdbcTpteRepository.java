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
import com.apiTpte.apiRestTpte.Entidades.EmpTpte;
import com.apiTpte.apiRestTpte.Entidades.FactTpte;
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
          resu = jdbcTemplate.update("UPDATE facstp SET nrofactura=?,fecha=?,idViaje=?,idChofer=?,nomchofer=?,"+
                                    "idEmptpte=?,nomemptpte=?,tarifap=?,cargaton=?,impneto=?,tasaiva=?,"+
                                    "impiva=?,totalfac=? WHERE idFactura=?",
                    new Object[] {fac.getNrofactura(),fac.getFecha(),fac.getIdViaje(),fac.getIdChofer(),fac.getNomChofer(),
                                  fac.getIdEmptpte(),fac.getNomemptpte(),fac.getTarifap(),fac.getCargaton(),fac.getImpneto(),
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
          resu = jdbcTemplate.update("INSERT facstp(idFactura,nrofactura,fecha,idViaje,idChofer,"+
                                    "nomchofer,idEmptpte,nomemptpte,tarifap,cargaton,impneto,tasaiva,"+
                                    "impiva,totalfac VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?) ",
                    new Object[] {fac.getIdFactura(),fac.getNrofactura(),fac.getFecha(),fac.getIdViaje(),fac.getIdChofer(),
                                  fac.getNomChofer(),fac.getIdEmptpte(),fac.getNomemptpte(),fac.getTarifap(),fac.getCargaton(),
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

}
