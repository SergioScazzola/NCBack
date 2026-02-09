export const config = {
  afip: {
    cuit: process.env.AFIP_CUIT,
    service: process.env.AFIP_SERVICE,
    certPath: process.env.AFIP_CERT,
    keyPath: process.env.AFIP_KEY,
    passphrase: process.env.AFIP_PASSPHRASE || '',
    wsaaUrl: process.env.AFIP_WSAA_URL,
    expireTime: process.env.AFIP_EXPM,
  }
};

  

