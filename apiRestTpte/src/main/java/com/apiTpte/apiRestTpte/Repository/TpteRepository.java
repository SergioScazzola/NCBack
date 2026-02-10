package com.apiTpte.apiRestTpte.Repository;

import java.util.List;



import com.apiTpte.apiRestTpte.Entidades.Camion;
import com.apiTpte.apiRestTpte.Entidades.Chofer;

public interface TpteRepository {

   
    List<Camion> AllCamiones();
    int getMaxCamiones();
    Camion findCamionById(int idcamion);
    int saveCamion(Camion camion);
    int actualizarCamion(int idcamion, Camion camion);    
    int deleteCamion(int idcamion);

    
    List<Chofer> AllChoferes();
    int getMaxChoferes();
    Chofer findChoferById(int idchofer);
    int saveChofer(Chofer chofer);
    int actualizarChofer(int idchofer, Chofer chofer);    
    int deleteChofer(int idchofer);


}
