package com.apiTpte.apiRestTpte.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.apiTpte.apiRestTpte.config.AwsCognitoConfig;
import com.apiTpte.apiRestTpte.model.auth.AuthRequest;
import com.apiTpte.apiRestTpte.model.auth.AuthResponse;
import com.apiTpte.apiRestTpte.model.auth.ChangePasswordRequest;
import com.apiTpte.apiRestTpte.model.auth.TokenValidationRequest;
import com.apiTpte.apiRestTpte.Servicios.CognitoService;
import com.amazonaws.services.cognitoidp.AWSCognitoIdentityProvider;
import com.amazonaws.services.cognitoidp.model.AdminSetUserPasswordRequest;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
@Slf4j
public class AuthController {

    @Autowired
    private CognitoService cognitoService;
    
    @Autowired
    private AWSCognitoIdentityProvider cognitoClient;
    
    @Autowired
    private AwsCognitoConfig cognitoConfig;

@PostMapping("/login")
public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest authRequest) {
    // Esto asegura que siempre se imprime en stdout de EB
    System.out.println(">> LOGIN LLEGÓ AL BACK PARA: " + authRequest.getEmail());
    
    log.info("Intento de inicio de sesión para: {}", authRequest.getEmail());

    AuthResponse response = cognitoService.login(authRequest);

    // Forzar que devuelva ambos tokens
    System.out.println(">> RESPONSE BACK: token=" + response.getToken() + ", tokenid=" + response.getTokenid());

    return ResponseEntity.ok(response);
}
   /* @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest authRequest) {
        log.info("Intento de inicio de sesión para: {}", authRequest.getEmail());
        AuthResponse response = cognitoService.login(authRequest);
        log.info("Login response completo: {}", response);
        if (response.getToken() != null) {
           log.info("TOKEN DEVUELTO: {}", response.getToken());
        }
        // Si el token es nulo pero hay un mensaje, podría ser un error o la necesidad de cambiar contraseña
        if (response.getToken() == null) {
            if (response.isNeedsPasswordChange()) {
                // Si necesita cambiar la contraseña temporal
                log.warn("Usuario con contraseña temporal detectado: {}", authRequest.getEmail());
                return ResponseEntity.status(HttpStatus.PRECONDITION_REQUIRED).body(response);
            } else if (response.getMessage() != null && !response.getMessage().contains("exitoso")) {
                // Si es un error de autenticación
                log.warn("Autenticación fallida: {}", response.getMessage());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
        }
        
        return ResponseEntity.ok(response);
    }*/
    
    @PostMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        log.info("Intento de cambio de contraseña para: {}", request.getEmail());
        Map<String, String> response = new HashMap<>();
        
        try {
            // Establecer la contraseña como permanente mediante la API de Cognito directamente
            AdminSetUserPasswordRequest setPasswordRequest = new AdminSetUserPasswordRequest()
                .withUserPoolId(cognitoConfig.getUserPoolId())
                .withUsername(request.getEmail())
                .withPassword(request.getNewPassword())
                .withPermanent(true);

            cognitoClient.adminSetUserPassword(setPasswordRequest);
            
            response.put("message", "Contraseña actualizada correctamente. Ahora puede iniciar sesión con su nueva contraseña.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error al cambiar contraseña: {}", e.getMessage());
            response.put("error", "Error al cambiar contraseña: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @PostMapping("/validate-token")
    public ResponseEntity<Map<String, String>> validateToken(@Valid @RequestBody TokenValidationRequest request) {
        log.info("Validando token...");
        Map<String, String> response = new HashMap<>();
        
        // Verificar que el token está en el formato correcto
        String token = request.getToken();
        if (token == null || token.isEmpty() || !token.contains(".")) {
            response.put("valid", "false");
            response.put("message", "Formato de token inválido");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        
        try {
            // Llamar al servicio para validar el token
            Map<String, Object> tokenInfo = cognitoService.validateToken(token);
            
            // Si la validación fue exitosa
            if (tokenInfo != null && tokenInfo.containsKey("email")) {
                response.put("email", (String) tokenInfo.get("email"));
                response.put("valid", "true");
                response.put("message", "Token válido");
                
                // Añadir username si está disponible
                if (tokenInfo.containsKey("username")) {
                    response.put("username", (String) tokenInfo.get("username"));
                }
                
                return ResponseEntity.ok(response);
            } else {
                response.put("valid", "false");
                response.put("message", "Token inválido o ha expirado");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
        } catch (Exception e) {
            log.error("Error al validar token: {}", e.getMessage());
            response.put("valid", "false");
            response.put("message", "El token ha expirado o es inválido. Por favor, inicie sesión nuevamente.");
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }
} 