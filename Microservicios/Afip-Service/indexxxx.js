
import express from 'express';
import '@afipsdk/afip.js';
import {readFileSync} from 'fs';
import path from 'path';
import Afip from '@afipsdk/afip.js';
import forge from "node-forge";
import axios from "axios";
import { parseStringPromise } from "xml2js";




//const fs = require('fs'); // Para leer archivos de certificado

// paths
//const certPath = path.resolve('c:\\CERTIF\\bulo24_7a7324e3c3d77f76.crt');
//const keyPath  = path.resolve('c:\\CERTIF\\privada');

//const   CUIT = "30716748754"; // Tu CUIT
//const   cert = 'c:\\CERTIF\\bulo24_7a7324e3c3d77f76.crt';
//const   key = 'c:\\CERTIF\\privada';
const certt = readFileSync('c:\\CERTIF\\bulo24_7a7324e3c3d77f76.crt', {encoding: 'utf8'});

// Key (Puede estar guardado en archivos, DB, etc)
const keyy = readFileSync('c:\\CERTIF\\privada', {encoding: 'utf8'});
const   ticket = "";

const app = express();
const port = 3001;
//const token = "7W1281YT74QU6MREjTndBTTWHlIZ641bnor2qz8ljOZDAVPSDFxFD0AyDIN2xC2b";// FUNCIONA
app.use(express.json()); // Middleware para parsear JSON

/*const afip = new Afip({ // FUNCIONA
    //CUIT: CUIT,
    //cert: readFileSync(certPath),
    //key:  readFileSync(keyPath),
    //service : 'wsfe'
    CUIT: 20409378472,
    access_token: token
});*/
const afip = new Afip({ // FUNCIONA
    CUIT: "30716748754",
    cert: certt,
    key:  keyy,
    service : 'wsfe'
    //CUIT: 20409378472,
    //access_token: token
});
/*const wsaa = new Wsaa({
    cert: readFileSync(certPath),
    key:  readFileSync(keyPath),
    service: 'wsfe' // Nombre del servicio de negocio (ej. Factura Electrónica)
});*/


/*async function conectar() {
    try {
        // 1. Obtener token
        ticket = await afip.WSAA.authorize("wsfe"); // Esto genera el token necesario
        return ticket
        // 2. Ejemplo: Consultar el último comprobante (WSFE)
        // const ultimoComprobante = await afip.WSFE.getUltimoComprobanteAutorizado(1, 1); // Punto de Venta, TipoComprobante
        // console.log('Último comprobante:', ultimoComprobante);

        // 3. Ejemplo: Solicitar una CAEA (si aplica)
        // const caea = await afip.CAEA.solicitarCAEA();
        // console.log('CAEA:', caea);

    } catch (error) {
        console.error('Error en la conexión AFIP:', error);
        return error
    }
}*/
/*app.get('/autorizar', async (req, res) => {
  try {
    console.log("Conectando a AFIP...");
    const ticket = await afip.WSAA.authorize("wsfe");
    //const ticket = await wsaa.authorize(); 
    res.json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});*/
/*app.get('/autorizar', async (req, res) => { // FUNCIONA
  try {
    const lastVoucher =
      await afip.ElectronicBilling.getLastVoucher(1, 1);

    res.json({
      ok: true,
      lastVoucher
    });
    console.log(lastVoucher);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      error: err.message
    });
  }
});*/
function signTRA(traXml) {
  const certPem = certt;
  const keyPem = keyy;

  const p7 = forge.pkcs7.createSignedData();
  p7.content = forge.util.createBuffer(traXml, "utf8");

  p7.addCertificate(certPem);
  p7.addSigner({
    key: keyPem,
    certificate: certPem,
    digestAlgorithm: forge.pki.oids.sha256
  });

  p7.sign();
  return forge.util.encode64(
    forge.asn1.toDer(p7.toAsn1()).getBytes()
  );
}
function createTRA(service) {
  const uniqueId = Math.floor(Date.now() / 1000);
  const generationTime = new Date(Date.now() - 600000).toISOString();
  const expirationTime = new Date(Date.now() + 600000).toISOString();

  return `
  <loginTicketRequest version="1.0">
    <header>
      <uniqueId>${uniqueId}</uniqueId>
      <generationTime>${generationTime}</generationTime>
      <expirationTime>${expirationTime}</expirationTime>
    </header>
    <service>${service}</service>
  </loginTicketRequest>`;
}

async function getTA(service) {
  const tra = createTRA(service);
  const cms = signTRA(tra);

  const soapRequest = `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
    <soapenv:Body>
      <loginCms>
        <in0>${cms}</in0>
      </loginCms>
    </soapenv:Body>
  </soapenv:Envelope>`;

  const response = await axios.post(
    "https://wsaahomo.afip.gov.ar/ws/services/LoginCms",
    soapRequest,
    { headers: { "Content-Type": "text/xml" } }
  );

  const parsed = await parseStringPromise(response.data);
  const taXml =
    parsed["soapenv:Envelope"]["soapenv:Body"][0]
      ["loginCmsResponse"][0]["loginCmsReturn"][0];

  return parseStringPromise(taXml);
}

app.get('/getToken', async (req, res) => { 
  try {
    const ta = await getTA("wsfe");
    const token = ta.loginTicketResponse.credentials[0].token[0];
    const sign = ta.loginTicketResponse.credentials[0].sign[0];

    console.log({ token, sign });

  }
  catch (err) { 
    console.error("Error : "+err+" al obtener el token");   
  }
}); 

app.get('/autorizar', async (req, res) => { 
  try {
    const lastVoucher =
      await afip.getTokenAuthorization();
    res.json({
      ok: true,
      lastVoucher
    });
    console.log(lastVoucher);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      error: err.message
    });
  }
});

/*app.get('/autorizar', async (req, res) => {
  try {
    const data = await afip.WSFE.getUltimoComprobanteAutorizado(1, 1);
    res.json({
      ok: true,
      data
    });
    console.log(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
});*/
app.listen(port, () => {
  console.log("AFIP service escuchando en puerto 3001");
});

