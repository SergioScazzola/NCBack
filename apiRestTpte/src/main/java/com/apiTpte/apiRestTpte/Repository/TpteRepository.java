package com.apiTpte.apiRestTpte.Repository;

import java.util.List;

import com.apiTpte.apiRestTpte.Entidades.AgChof;
import com.apiTpte.apiRestTpte.Entidades.Camion;
import com.apiTpte.apiRestTpte.Entidades.Chofer;
import com.apiTpte.apiRestTpte.Entidades.Cliente;
import com.apiTpte.apiRestTpte.Entidades.Pagocli;
import com.apiTpte.apiRestTpte.Entidades.EmpTpte;
import com.apiTpte.apiRestTpte.Entidades.FactCli;
import com.apiTpte.apiRestTpte.Entidades.FactTpte;
import com.apiTpte.apiRestTpte.Entidades.Gasto;
import com.apiTpte.apiRestTpte.Entidades.ItfactC;
import com.apiTpte.apiRestTpte.Entidades.ItfactT;
import com.apiTpte.apiRestTpte.Entidades.MPago;
import com.apiTpte.apiRestTpte.Entidades.Marca;
import com.apiTpte.apiRestTpte.Entidades.Pago;
import com.apiTpte.apiRestTpte.Entidades.SaldoChof;
import com.apiTpte.apiRestTpte.Entidades.SaldoCli;
import com.apiTpte.apiRestTpte.Entidades.TGasto;
import com.apiTpte.apiRestTpte.Entidades.Ticket;
import com.apiTpte.apiRestTpte.Entidades.Unid;
import com.apiTpte.apiRestTpte.Entidades.Usuario;
import com.apiTpte.apiRestTpte.Entidades.Viaje;

public interface TpteRepository {
   
    List<Usuario> getUsuario(String usuario);


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
    List<SaldoChof> getSaldosPorChofer(int nchof);
    int actSaldoInicial(SaldoChof saldoc);  // en la tabla "choferes"
    int saveSaldoChofer(SaldoChof saldoc);
    SaldoChof getSaldoDelChofer(int idchof, int nros);
    int actSaldodelChofer(SaldoChof saldoc);
    List<Gasto> GastosXChofer(int idchofer);
    List<Pago> PagosXChofer(int idchofer);
    List<FactTpte> FacTXChofer(int idchofer);
    List<FactTpte> infoFactpxFecha(String fechai, String fechaf );
 

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
    List<SaldoCli> getSaldosPorCliente(int ncli);
    int actSaldoInicial(SaldoCli saldoc);  // en la tabla "clientes"
    int saveSaldoCliente(SaldoCli saldoc);
    SaldoCli getSaldoDelCliente(int idcli, int nros);
    int actSaldodelCliente(SaldoCli saldoc);
    List<Pagocli> PagosxCliente(int idcli); 

    List<Viaje> AllViajes();
    List<Viaje> ViajesXChofer(int idchofer);
    int getMaxViajes();
    Viaje findViajeById(int idviaje);
    int saveViaje(Viaje viaje);
    int actualizarViaje(int idviaje, Viaje viaje);    
    List<Gasto> GastosXViaje(int idviaje);
    int getCantViajesXChofer(int idchofer);
    int getCantViajesXCliente(int idclte);
  
    List<Viaje> ViajesXCliente(int idclte);
    int actualizarFactC(int idviaje,int facturado);
    int actualizarFactT(int idviaje,int facturado);
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
    List<FactTpte> FacTXChoferYF(int idchofer, String fecin, String fecfin);   
    List<AgChof> FacTAgrupXChofer(String fecin, String fecfin);

    // FACTURA AL CLIENTE
          
    List<FactCli> AllFacscl();
    int getMaxFacscl();
    FactCli findFacclById(int idfac);
    int saveFaccl(FactCli fac);
    int actualizarFaccl(int idfac, FactCli faccl);    
    int deleteFaccl(int idfac);
    List<FactCli> FacCXClienteYF(int idcliente, String fecin, String fecfin);
    List<FactCli> FacCXCliente(int idcliente);

    List<ItfactC> getDetalleFaccl(int nrofac);
    int saveItemFaccl(ItfactC itfac);
    int actualizarItemFaccl(ItfactC itfac);   
    int deleteItemFaccl(int nrofac, int nroit);

    // PAGOS DEL CLIENTE //
    List<Pagocli> AllPagosCli();
    int getMaxPagosCli();
    Pagocli findPagoCliById(int idpago);
    int savePagoCli(Pagocli pago);
    int actualizarPagoCli(int idpago, Pagocli pago);
    int deletePagoCli(int idpago);

    // PAGOS A LA EMPRESA DE TPTE. //

    List<Pago> AllPagos();
    int getMaxPagos();
    Pago findPagoById(int idpago);
    int savePago(Pago pago);
    int actualizarPago(int idpago, Pago pago);    
    int deletePago(int idpago);     

  

    // GASTOS DE VIAJES Y GASTOS GENERALES

    List<Gasto> AllGastos();
    int getMaxGastos();
    Gasto findGastoById(int idgasto);
    int saveGasto(Gasto gasto);
    int actualizarGasto(int idgasto, Gasto gasto);    
    int deleteGasto(int idgasto); 

    // TABLAS Auxiliares //
    List<Marca> AllMarcas();
    List<MPago> AllMediosPagos();
    List<TGasto> AllTiposGasto();
    List<Unid> AllUnidades();

    // AFIP

    Ticket selectTicket();
    int saveTicket(Ticket ticket);

}
