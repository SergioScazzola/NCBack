package com.apiTpte.apiRestTpte.Servicios;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.apiTpte.apiRestTpte.config.AwsCognitoConfig;
import com.apiTpte.apiRestTpte.model.auth.AuthRequest;
import com.apiTpte.apiRestTpte.model.auth.AuthResponse;
import com.amazonaws.services.cognitoidp.AWSCognitoIdentityProvider;
import com.amazonaws.services.cognitoidp.model.AdminInitiateAuthRequest;
import com.amazonaws.services.cognitoidp.model.AdminInitiateAuthResult;
import com.amazonaws.services.cognitoidp.model.AuthFlowType;
import com.amazonaws.services.cognitoidp.model.AuthenticationResultType;
import com.amazonaws.services.cognitoidp.model.ChallengeNameType;
import com.amazonaws.services.cognitoidp.model.GetUserRequest;
import com.amazonaws.services.cognitoidp.model.GetUserResult;
import com.amazonaws.services.cognitoidp.model.InitiateAuthRequest;
import com.amazonaws.services.cognitoidp.model.InitiateAuthResult;
import com.amazonaws.services.cognitoidp.model.InvalidParameterException;
import com.amazonaws.services.cognitoidp.model.NotAuthorizedException;
import com.amazonaws.services.cognitoidp.model.UserNotFoundException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class CognitoService {

    @Autowired
    private AWSCognitoIdentityProvider cognitoClient;

    @Autowired
    private AwsCognitoConfig cognitoConfig;
    
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Método para iniciar sesión en Cognito
     * @param authRequest datos de inicio de sesión
     * @return respuesta con token y datos del usuario
     */
    public AuthResponse login(AuthRequest authRequest) {
        try {
            // Preparamos los parámetros de autenticación
            Map<String, String> authParams = new HashMap<>();
            authParams.put("USERNAME", authRequest.getEmail());
            authParams.put("PASSWORD", authRequest.getPassword());
            
            // El secret hash es necesario solo si el Cliente de App tiene un secreto configurado
            if (cognitoConfig.getClientSecret() != null && !cognitoConfig.getClientSecret().isEmpty() 
                    && !cognitoConfig.getClientSecret().equals("your_cognito_client_secret")) {
                authParams.put("SECRET_HASH", calculateSecretHash(
                    cognitoConfig.getClientId(),
                    cognitoConfig.getClientSecret(),
                    authRequest.getEmail()
                ));
            }

            log.info("Iniciando autenticación para el usuario: {}", authRequest.getEmail());
            
            // Primero intentamos autenticación normal con USER_PASSWORD_AUTH
            try {
                InitiateAuthRequest initiateAuthRequest = new InitiateAuthRequest()
                    .withAuthFlow(AuthFlowType.USER_PASSWORD_AUTH)
                    .withClientId(cognitoConfig.getClientId())
                    .withAuthParameters(authParams);
                
                InitiateAuthResult initiateAuthResult = cognitoClient.initiateAuth(initiateAuthRequest);
                
                // Si hay un desafío de nueva contraseña, significa que la contraseña es temporal
                if (initiateAuthResult.getChallengeName() != null && 
                    initiateAuthResult.getChallengeName().equals(ChallengeNameType.NEW_PASSWORD_REQUIRED.name())) {
                    log.info("El usuario {} necesita cambiar su contraseña temporal", authRequest.getEmail());
                    return AuthResponse.builder()
                        .email(authRequest.getEmail())
                        .message("Necesitas cambiar tu contraseña temporal. Por favor, establece una nueva contraseña permanente.")
                        .needsPasswordChange(true)
                        .build();
                }
                
                // Si llegamos aquí, la autenticación fue exitosa
                AuthenticationResultType authenticationResult = initiateAuthResult.getAuthenticationResult();
                
                log.info("Autenticación exitosa para el usuario: {}", authRequest.getEmail());
                
                return AuthResponse.builder()
                    //.token(authenticationResult.getIdToken())
                     .token(authenticationResult.getAccessToken()) // <--- CAMBIA IdToken por AccessToken
                    .refreshToken(authenticationResult.getRefreshToken())
                    .email(authRequest.getEmail())
                    .message("Inicio de sesión exitoso")
                    .needsPasswordChange(false)
                    .build();
                
            } catch (NotAuthorizedException e) {
                // Si falla con USER_PASSWORD_AUTH, intentamos con ADMIN_NO_SRP_AUTH
                log.info("Fallo en USER_PASSWORD_AUTH, intentando con ADMIN_NO_SRP_AUTH para: {}", authRequest.getEmail());
                
                AdminInitiateAuthRequest adminAuthRequest = new AdminInitiateAuthRequest()
                    .withAuthFlow(AuthFlowType.ADMIN_NO_SRP_AUTH)
                    .withUserPoolId(cognitoConfig.getUserPoolId())
                    .withClientId(cognitoConfig.getClientId())
                    .withAuthParameters(authParams);
                
                AdminInitiateAuthResult adminAuthResult = cognitoClient.adminInitiateAuth(adminAuthRequest);
                
                // Verificamos si hay un desafío de nueva contraseña
                if (adminAuthResult.getChallengeName() != null && 
                    adminAuthResult.getChallengeName().equals(ChallengeNameType.NEW_PASSWORD_REQUIRED.name())) {
                    log.info("El usuario {} necesita cambiar su contraseña temporal", authRequest.getEmail());
                    return AuthResponse.builder()
                        .email(authRequest.getEmail())
                        .message("Necesitas cambiar tu contraseña temporal. Por favor, establece una nueva contraseña permanente.")
                        .needsPasswordChange(true)
                        .build();
                }
                
                // Si no hay desafío, la autenticación fue exitosa
                AuthenticationResultType authenticationResult = adminAuthResult.getAuthenticationResult();
                
                log.info("Autenticación exitosa para el usuario: {}", authRequest.getEmail());
                
                return AuthResponse.builder()
                    //.token(authenticationResult.getIdToken())
                     .token(authenticationResult.getAccessToken()) // <--- CAMBIA IdToken por AccessToken
                    .refreshToken(authenticationResult.getRefreshToken())
                    .email(authRequest.getEmail())
                    .message("Inicio de sesión exitoso")
                    .needsPasswordChange(false)
                    .build();
            }
            
        } catch (NotAuthorizedException e) {
            log.error("Error de credenciales: {}", e.getMessage());
            return AuthResponse.builder()
                .message("Credenciales incorrectas. Por favor, verifica tu email y contraseña.")
                .build();
        } catch (UserNotFoundException e) {
            log.error("Usuario no encontrado: {}", e.getMessage());
            return AuthResponse.builder()
                .message("El usuario no existe en el sistema.")
                .build();
        } catch (InvalidParameterException e) {
            log.error("Parámetro inválido: {}", e.getMessage());
            return AuthResponse.builder()
                .message("Error en la solicitud: " + e.getMessage())
                .build();
        } catch (Exception e) {
            log.error("Error en el inicio de sesión: {}", e.getMessage());
            return AuthResponse.builder()
                .message("Error en el inicio de sesión: " + e.getMessage())
                .build();
        }
    }

    /**
     * Valida un token JWT y extrae la información del usuario
     * @param token Token JWT a validar
     * @return Mapa con la información del usuario, o null si el token es inválido
     */
    public Map<String, Object> validateToken(String token) {
        // Intentar decodificar el token manualmente primero
        try {
            // Los tokens JWT tienen formato: header.payload.signature
            String[] parts = token.split("\\.");
            if (parts.length == 3) {
                // Decodificar el payload (segunda parte)
                String payload = new String(Base64.getUrlDecoder().decode(parts[1]));
                JsonNode payloadJson = objectMapper.readTree(payload);
                
                Map<String, Object> userInfo = new HashMap<>();
                
                // Extraer el email y verificar la expiración
                if (payloadJson.has("email")) {
                    // Verificar si el token ha expirado
                    if (payloadJson.has("exp")) {
                        long expTime = payloadJson.get("exp").asLong();
                        long currentTime = System.currentTimeMillis() / 1000;
                        
                        if (expTime < currentTime) {
                            log.warn("El token ha expirado");
                            return null;
                        }
                    }
                    
                    userInfo.put("email", payloadJson.get("email").asText());
                    
                    // Opcionalmente, añadir más información del usuario
                    if (payloadJson.has("cognito:username")) {
                        userInfo.put("username", payloadJson.get("cognito:username").asText());
                    }
                    
                    return userInfo;
                } else if (payloadJson.has("cognito:username")) {
                    userInfo.put("email", payloadJson.get("cognito:username").asText());
                    return userInfo;
                }
            }
        } catch (Exception ex) {
            log.error("Error decodificando token manualmente: {}", ex.getMessage());
        }
        
        // Si la decodificación manual falló, intentar verificar con AWS Cognito
        try {
            // Intentar obtener la información del usuario desde Cognito usando el token como access token
            GetUserRequest getUserRequest = new GetUserRequest()
                .withAccessToken(token);
            GetUserResult getUserResult = cognitoClient.getUser(getUserRequest);
            
            // Si llegamos aquí, el token es válido
            Map<String, Object> userInfo = new HashMap<>();
            
            // Extraer el email del usuario
            getUserResult.getUserAttributes().forEach(attribute -> {
                if ("email".equals(attribute.getName())) {
                    userInfo.put("email", attribute.getValue());
                }
            });
            
            return userInfo;
        } catch (NotAuthorizedException e) {
            // Token inválido o expirado
            log.error("Token inválido o expirado: {}", e.getMessage());
            return null;
        } catch (Exception e) {
            // Error inesperado
            log.error("Error validando token con AWS Cognito: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Calcula el hash secreto requerido para la autenticación con Cognito si se usa un secreto de cliente
     */
    private String calculateSecretHash(String userPoolClientId, String userPoolClientSecret, String userName) {
        final String message = userName + userPoolClientId;
        final String signature = calculateHmacSha256(message, userPoolClientSecret);
        return signature;
    }

    /**
     * Calcula el HMAC-SHA256
     */
    private String calculateHmacSha256(String message, String key) {
        try {
            javax.crypto.Mac mac = javax.crypto.Mac.getInstance("HmacSHA256");
            javax.crypto.spec.SecretKeySpec secretKeySpec = new javax.crypto.spec.SecretKeySpec(
                key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKeySpec);
            byte[] hash = mac.doFinal(message.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            throw new RuntimeException("Error calculando el HMAC-SHA256", e);
        }
    }
} 