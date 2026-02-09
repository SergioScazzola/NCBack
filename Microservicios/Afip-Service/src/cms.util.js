import fs from 'fs';
import { execFileSync } from "child_process";
import path from 'path';
//import crypto from 'crypto';

/*export function buildCMS(loginTicketRequest, certPath, keyPath, passphrase) {
  const cert = fs.readFileSync(certPath);
  const key = fs.readFileSync(keyPath);

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(loginTicketRequest);
  signer.end();

  const signature = signer.sign({
    key,
    passphrase
  });

  // AFIP espera el CMS en base64
  return signature.toString('base64');
}*/

export function buildCMS(loginTicketRequest, certPath, keyPath) {
  const xmlPath = path.resolve('ltr.xml');
  const cmsPath = path.resolve('ltr.cms');

  fs.writeFileSync("ltr.xml", loginTicketRequest);

 /* execSync(`
openssl smime -sign ^
  -signer "${certPath}" ^
  -inkey "${keyPath}" ^
  -outform DER ^
  -nodetach ^
  -binary ^
  -md sha1 ^
   -in "${xmlPath}" ^
   -out "${cmsPath}"`,
  { stdio: 'inherit', shell: 'cmd.exe' }
  );*/
  
  execFileSync(
  'openssl',
  [
    'smime', '-sign',
    '-signer', certPath,
    '-inkey', keyPath,
    '-outform', 'DER',
    '-nodetach',
    '-binary',
    '-md', 'sha1',
    '-in', xmlPath,
    '-out', cmsPath
  ],
  { stdio: 'inherit' }
);
  // Verificar que el CMS exista
  if (!fs.existsSync(cmsPath)) {
    throw new Error(`No se creó el CMS: ${cmsPath}`);
  }

  const b64Path = path.resolve('ltr.b64');
  execFileSync(
    'certutil',
    ['-encode', cmsPath, b64Path],
    { stdio: 'inherit' }
  );
  //execFileSync(`certutil -encode "${cmsPath}" "${b64Path}"`);

  const cms = fs.readFileSync("ltr.b64", "utf8")
    .replace(/-----.*-----/g, "")
    .replace(/\s+/g, "");

  return cms;
}

