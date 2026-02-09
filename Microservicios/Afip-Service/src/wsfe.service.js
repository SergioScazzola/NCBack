import axios from 'axios';
import xml2js from 'xml2js';

//const WSFE_URL = 'https://wswhomo.afip.gov.ar/wsfev1/service.asmx';
// PROD:
const WSFE_URL = 'https://servicios1.afip.gov.ar/wsfev1/service.asmx';

export async function getUltimoComprobante(
  token,
  sign,
  cuit,
  ptoVta,
  cbteTipo
 ) {
const soap =   
`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:ar="http://ar.gov.afip.dif.FEV1/">
  <soapenv:Header/>
  <soapenv:Body>
    <ar:FECompUltimoAutorizado>
      <ar:Auth>
        <ar:Token>${token}</ar:Token>
        <ar:Sign>${sign}</ar:Sign>
        <ar:Cuit>${cuit}</ar:Cuit>
      </ar:Auth>
      <ar:PtoVta>${Number(ptoVta)}</ar:PtoVta>
      <ar:CbteTipo>${Number(cbteTipo)}</ar:CbteTipo>
    </ar:FECompUltimoAutorizado>
  </soapenv:Body>
</soapenv:Envelope>
`;
console.log('CUIT raw:', `"${cuit}"`);
console.log('CUIT length:', String(cuit).length);
console.log('PtoVta:', ptoVta, typeof ptoVta);
console.log('CbteTipo:', cbteTipo, typeof cbteTipo);
console.log(soap);

const response = await axios.post(WSFE_URL, soap, {
    
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      'SOAPAction': 'http://ar.gov.afip.dif.FEV1/FECompUltimoAutorizado'
    }  
});




const parsed = await xml2js.parseStringPromise(response.data, {
    explicitArray: false,
    trim: true
  });

const result =
    parsed['soap:Envelope']
          ['soap:Body']
          .FECompUltimoAutorizadoResponse
          .FECompUltimoAutorizadoResult;

if (result.Errors) {
    throw new Error(JSON.stringify(result.Errors));
}
return result.CbteNro;
}
