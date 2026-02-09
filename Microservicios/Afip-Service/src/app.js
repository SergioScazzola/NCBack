
import './loadEnv.js';

import express from 'express';
import { config } from './config.js';
import { getTokenAndSign } from './wsaa.service.js';
import { getUltimoComprobante } from './wsfe.service.js';


const app = express();
var  tokenn = "";
var  signn  = "";
const ptovta = 8; // Punto de Venta fijo para pruebas
const cbtetipo = 1; // FAC B
const cuit =  String(process.env.AFIP_CUIT);

console.log(process.env.AFIP_CUIT);
console.log('Config :', config.afip);
console.log("Expira : "+process.env.AFIP_EXPM);


app.get('/afip/token', async (req, res) => {
  try {
    const data = await getTokenAndSign();
    res.json(data);
    tokenn = data.token;
    signn  = data.sign;
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error WSAA AFIP' });
  }
});


app.get('/afip/ultcomp', async (req, res) => {
 
    try {
       if (!tokenn || !signn) {
         const auth = await getTokenAndSign();// obtener token y firma
         tokenn = auth.token;
         signn  = auth.sign;
       };
      const ultimo = await getUltimoComprobante(tokenn, 
                                                signn,
                                                cuit,
                                                ptovta,
                                                cbtetipo);
      console.log("Ultima Factura A emitida : "+ultimo);    
      return res.json({ ultimo });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: 'Error AFIP',
      detail: error.message
    })
  };  
});
   
app.listen(3001, () => {
  console.log('Auth service AFIP running on port 3001');
});
