package com.apiTpte.apiRestTpte.Repository;

import java.util.List;



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

    // FACTURA DEL TRANSPORTE

    List<FactTpte> AllFacstp();
    int getMaxFacstp();
    FactTpte findFactpById(int idfac);
    int saveFactp(FactTpte fac);
    int actualizarFactp(int idfac, FactTpte factp);    
    int deleteFactp(int idfac);

    List<ItfactT> getDetalleFactp(int nrofac);
    int saveItemFactp(ItfactT itfac);
    int actualizarItemFactp(ItfactT itfac);   
    int deleteItemFactp(int nrofac, int nroit);

    // FACTURA AL CLIENTE
          
    List<FactCli> AllFacscl();
    int getMaxFacscl();
    FactCli findFacclById(int idfac);
    int saveFaccl(FactCli fac);
    int actualizarFaccl(int idfac, FactCli faccl);    
    int deleteFaccl(int idfac);

    List<ItfactC> getDetalleFaccl(int nrofac);
    int saveItemFaccl(ItfactC itfac);
    int actualizarItemFaccl(ItfactC itfac);   
    int deleteItemFaccl(int nrofac, int nroit);

    // PAGOS A LA EMPRESA DE TPTE. //

    List<Pago> AllPagos();
    int getMaxPagos();
    Pago findPagoById(int idpago);
    int savePago(Pago pago);
    int actualizarPago(int idpago, Pago pago);    
    int deletePago(int idpago);     

    // COBROS AL CLIENTE //

    List<Cobro> AllCobros();
    int getMaxCobros();
    Cobro findCobroById(int idcobro);
    int saveCobro(Cobro cobro);
    int actualizarCobro(int idcobro, Cobro cobro);    
    int deleteCobro(int idcobro); 

    // GASTOS DE VIAJES Y GASTOS GENERALES

    List<Gasto> AllGastos();
    int getMaxGastos();
    Gasto findGastoById(int idgasto);
    int saveGasto(Gasto gasto);
    int actualizarGasto(int idgasto, Gasto gasto);    
    int deleteGasto(int idgasto); 

}
