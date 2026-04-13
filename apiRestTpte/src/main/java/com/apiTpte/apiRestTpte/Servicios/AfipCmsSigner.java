package com.apiTpte.apiRestTpte.Servicios;

import org.bouncycastle.cms.*;
import org.bouncycastle.cert.jcajce.JcaCertStore;
import org.bouncycastle.cms.jcajce.*;
import org.bouncycastle.operator.*;
import org.bouncycastle.operator.jcajce.*;
import org.springframework.stereotype.Component;


import java.io.FileInputStream;
import java.security.*;
import java.security.cert.X509Certificate;
import java.util.*;

@Component
public class AfipCmsSigner {

    public byte[] sign(String p12Path, String password, String alias, String xml) {
    try {

        KeyStore ks = KeyStore.getInstance("PKCS12");
        ks.load(new FileInputStream(p12Path), password.toCharArray());

        PrivateKey privateKey = (PrivateKey) ks.getKey(alias, password.toCharArray());
        X509Certificate cert = (X509Certificate) ks.getCertificate(alias);

        Security.addProvider(new org.bouncycastle.jce.provider.BouncyCastleProvider());

        CMSSignedDataGenerator generator = new CMSSignedDataGenerator();

        ContentSigner signer = new JcaContentSignerBuilder("SHA256withRSA")
                .setProvider("BC")
                .build(privateKey);

        generator.addSignerInfoGenerator(
                new JcaSignerInfoGeneratorBuilder(
                        new JcaDigestCalculatorProviderBuilder().setProvider("BC").build()
                ).build(signer, cert)
        );

        generator.addCertificates(new JcaCertStore(Collections.singletonList(cert)));

        CMSTypedData data = new CMSProcessableByteArray(xml.getBytes());

        CMSSignedData signedData = generator.generate(data, true);
        return signedData.getEncoded();
    } catch (Exception e) {
        throw new RuntimeException("Error firmando XML", e);
    }   
       
    }
    public String getSignerDn(String p12Path, String password, String alias) throws Exception {

       KeyStore ks = KeyStore.getInstance("PKCS12");
       ks.load(new FileInputStream(p12Path), password.toCharArray());

       X509Certificate cert = (X509Certificate) ks.getCertificate(alias);

       return cert.getSubjectX500Principal().getName();
    }
    public String toBase64(byte[] cms) {
        return Base64.getEncoder().encodeToString(cms);
    }
}
