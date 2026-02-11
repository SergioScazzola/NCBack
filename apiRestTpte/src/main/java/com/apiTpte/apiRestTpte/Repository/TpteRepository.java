package com.apiTpte.apiRestTpte.Repository;

import java.util.List;



import com.apiTpte.apiRestTpte.Entidades.Camion;
import com.apiTpte.apiRestTpte.Entidades.Chofer;
import com.apiTpte.apiRestTpte.Entidades.Cliente;
import com.apiTpte.apiRestTpte.Entidades.EmpTpte;
import com.apiTpte.apiRestTpte.Entidades.FactTpte;
import com.apiTpte.apiRestTpte.Entidades.Viaje;

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

    List<EmpTpte> AllEmpresas();
    int getMaxEmpresas();
    EmpTpte findEmpresaById(int idempresa);
    int saveEmpresa(EmpTpte emptpte);
    int actualizarEmpresa(int idempresa, EmpTpte emptpte);    
    int deleteEmpresa(int idempresa);

    List<Cliente> AllClientes();
    int getMaxClientes();
    Cliente findClienteById(int idcliente);
    int saveCliente(Cliente cliente);
    int actualizarCliente(int idcliente, Cliente cliente);    
    int deleteCliente(int idcliente);

    List<Viaje> AllViajes();
    int getMaxViajes();
    Viaje findViajeById(int idviaje);
    int saveViaje(Viaje viaje);
    int actualizarViaje(int idviaje, Viaje viaje);    
    int deleteViaje(int idviaje);

    List<FactTpte> AllFacstp();
    int getMaxFacstp();
    FactTpte findFactpById(int idfac);
    int saveFactp(FactTpte fac);
    int actualizarFactp(int idfac, FactTpte factp);    
    int deleteFactp(int idfac);


}
