package com.apiTpte.apiRestTpte.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.cognitoidp.AWSCognitoIdentityProvider;
import com.amazonaws.services.cognitoidp.AWSCognitoIdentityProviderClientBuilder;

import lombok.Getter;
import lombok.Setter;

@Configuration
@Getter
@Setter
public class AwsCognitoConfig {

    @Value("${AWS_REGION}")
    private String awsRegion;

    @Value("${COGNITO_CLIENT_ID}")
    private String clientId;

    @Value("${COGNITO_CLIENT_SECRET}")
    private String clientSecret;

    @Value("${COGNITO_USER_POOL_ID}")
    private String userPoolId;

    @Value("${COGNITO_ENDPOINT}")
    private String endpoint;

    @Value("${JWT_EXPIRATION}")
    private Long jwtExpirationMs;
    
    @Value("${AWS_ACCESS_KEY:}")
    private String accessKey;
    
    @Value("${AWS_SECRET_KEY:}")
    private String secretKey;

    @Bean
    public AWSCognitoIdentityProvider cognitoClient() {
        // Si hay credenciales de AWS configuradas, usarlas
        if (accessKey != null && !accessKey.isEmpty() && secretKey != null && !secretKey.isEmpty()) {
            BasicAWSCredentials awsCreds = new BasicAWSCredentials(accessKey, secretKey);
            return AWSCognitoIdentityProviderClientBuilder.standard()
                    .withCredentials(new AWSStaticCredentialsProvider(awsCreds))
                    .withRegion(Regions.fromName(awsRegion))
                    .build();
        } else {
            // Si no hay credenciales explícitas, confiar en la cadena de proveedores de credenciales por defecto
            // Esto buscará credenciales en variables de entorno, propiedades de sistema, perfil AWS, etc.
            return AWSCognitoIdentityProviderClientBuilder.standard()
                    .withRegion(Regions.fromName(awsRegion))
                    .build();
        }
    }
} 