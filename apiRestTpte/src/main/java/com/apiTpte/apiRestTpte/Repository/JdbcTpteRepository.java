package com.apiTpte.apiRestTpte.Repository;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.apiTpte.apiRestTpte.Entidades.Camion;
import com.apiTpte.apiRestTpte.Entidades.Chofer;

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
}
