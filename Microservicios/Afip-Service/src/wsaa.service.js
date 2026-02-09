import axios from 'axios';
//import { parseStringPromise } from 'xml2js';
import xml2js from 'xml2js';
import { buildCMS } from './cms.util.js';
import { config } from './config.js';



function afipDate(offsetMs) {
  const d = new Date(Date.now() + offsetMs);

  const pad = n => n.toString().padStart(2, "0");

  return (
    d.getFullYear() + "-" +
    pad(d.getMonth() + 1) + "-" +
    pad(d.getDate()) + "T" +
    pad(d.getHours()) + ":" +
    pad(d.getMinutes()) + ":" +
    pad(d.getSeconds()) +
    "-03:00"
  );
}

export function buildLoginTicketRequest(service,expt) {
  const uniqueId = Math.floor(Date.now() / 1000);
  const offsetMseg = expt;
  return `
    <loginTicketRequest version="1.0">
    <header>
      <uniqueId>${uniqueId}</uniqueId>
      <generationTime>${afipDate(-60000)}</generationTime>
      <expirationTime>${afipDate(offsetMseg)}</expirationTime>
    </header>
    <service>${service}</service>
    </loginTicketRequest>
   `.trim();
}

export async function getTokenAndSign() {
  console.log('Config AFIP WSAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA:', config.afip);
  const {
    service,
    certPath,
    keyPath,
    passphrase,
    wsaaUrl, 
    expireTime,  
  } = config.afip;

  //console.log("Serv:"+service+" certP:"+certPath+" keyP: "+keyPath+" pass:"+passphrase+" wsaa:"+wsaaUrl);
  //console.log("Config.Afip : "+config.afip);
  const expt = Number(expireTime);
  const ltr = buildLoginTicketRequest(service,expt);

  //console.log("Ltr : "+ltr);

  const cms = buildCMS(
    ltr,
    certPath,
    keyPath,
    passphrase
  );

  const soapEnvelope = `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
    <soapenv:Body>
      <loginCms>
        <in0>${cms}</in0>
      </loginCms>
    </soapenv:Body>
  </soapenv:Envelope>
  `.trim();

  const response = await axios.post(wsaaUrl, soapEnvelope, {
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      // SOAPAction: 'loginCms'      
      'SOAPAction': ''
    },
    timeout: 15000
  });
  console.log('WSAA raw response:', response);
  console.log('WSAA response.data:', response?.data);

 
const soapResult = await xml2js.parseStringPromise(response.data, {
  explicitArray: false,trim: true });

 const loginCmsReturn =
    soapResult['soapenv:Envelope']
        ['soapenv:Body']
        .loginCmsResponse
        ['ns1:loginCmsReturn'];

  // 2️⃣ Obtener XML interno (string)
  const innerXml =
    typeof loginCmsReturn === 'string'
      ? loginCmsReturn
      : loginCmsReturn._;

  // 3️⃣ Des-escapar entidades HTML
  const decodedXml = innerXml
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .trim();

  // 4️⃣ Parse LoginTicketResponse
  const ticket = await xml2js.parseStringPromise(decodedXml, {
    explicitArray: false,
    trim: true
  });

  // 5️⃣ Extraer token y sign (FORMA SEGURA)
  const credentials = ticket?.loginTicketResponse?.credentials;

  if (!credentials) {
    throw new Error('WSAA: No se encontraron credentials');
  }

  const token =
    typeof credentials.token === 'string'
      ? credentials.token
      : credentials.token?._;

  const sign =
    typeof credentials.sign === 'string'
      ? credentials.sign
      : credentials.sign?._;

  if (!token || !sign) {
    throw new Error('WSAA: token o sign vacío');
  }
  console.log("TOKEN : "+token);
  console.log("SIGN  : "+sign);
  return { token, sign };
}



