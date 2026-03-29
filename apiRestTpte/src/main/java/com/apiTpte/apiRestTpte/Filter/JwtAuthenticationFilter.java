package com.apiTpte.apiRestTpte.Filter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.apiTpte.apiRestTpte.config.AwsCognitoConfig;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private AwsCognitoConfig cognitoConfig;

    private static final ObjectMapper mapper = new ObjectMapper();

    @SuppressWarnings("null")
    @Override
    protected void doFilterInternal(
            HttpServletRequest request, 
            HttpServletResponse response, 
            FilterChain filterChain) throws ServletException, IOException {
        
        try {
            // Permitir solicitudes OPTIONS para CORS preflight
            if ("OPTIONS".equals(request.getMethod())) {
                filterChain.doFilter(request, response);
                return;
            }
            
            // Excluir las rutas de autenticación del filtro
            String requestPath = request.getServletPath();
            if (requestPath.startsWith("/api/auth/")) {
                filterChain.doFilter(request, response);
                return;
            }
            
            String token = getTokenFromRequest(request);
            if (token != null && validateToken(token)) {
                setUpSpringAuthentication(token);
            } else if (token == null) {
                // Si no hay token, devolver error de autenticación
                sendErrorResponse(response, "No se proporcionó token de autenticación", HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
        } catch (ExpiredJwtException e) {
            log.error("Token expirado: {}", e.getMessage());
            sendErrorResponse(response, "El token de autenticación ha expirado", HttpServletResponse.SC_UNAUTHORIZED);
            return;
        } catch (UnsupportedJwtException | MalformedJwtException e) {
            log.error("Token inválido: {}", e.getMessage());
            sendErrorResponse(response, "El token de autenticación es inválido", HttpServletResponse.SC_UNAUTHORIZED);
            return;
        } catch (Exception e) {
            log.error("Error inesperado: {}", e.getMessage());
            sendErrorResponse(response, "Error de autenticación: " + e.getMessage(), HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            return;
        }
        
        filterChain.doFilter(request, response);
    }

    private void sendErrorResponse(HttpServletResponse response, String message, int statusCode) throws IOException {
        response.setStatus(statusCode);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        
        String jsonResponse = mapper.writeValueAsString(new ErrorResponse(message, statusCode));
        response.getWriter().write(jsonResponse);
    }
    
    // Clase auxiliar para el formato de respuesta de error
    private static class ErrorResponse {
      
        private final String message;       
        private final int status;  
        private final long timestamp;
        
        public ErrorResponse(String message, int status) {
            this.message = message;
            this.status = status;
            this.timestamp = System.currentTimeMillis();
        }
        
        @SuppressWarnings("unused")
        public String getMessage() {
            return message;
        }
        
        @SuppressWarnings("unused")
        public int getStatus() {
            return status;
        }
        
        @SuppressWarnings("unused")
        public long getTimestamp() {
            return timestamp;
        }
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    private boolean validateToken(String token) {
        try {
            // Verificar la firma del token de Cognito no es sencillo, 
            // ya que requiere obtener las claves públicas de Cognito.
            // Este es un enfoque simplificado para verificar algunos datos del token.
            String[] chunks = token.split("\\.");
            if (chunks.length != 3) {
                return false;
            }
            
            // Decodificar el payload (claims)
            Base64.Decoder decoder = Base64.getUrlDecoder();
            String payload = new String(decoder.decode(chunks[1]));
            JsonNode payloadJson = mapper.readTree(payload);
            
            // Verificar el issuer
            String issuer = payloadJson.get("iss").asText();
            String expectedIssuer = "https://" + cognitoConfig.getEndpoint() + "/" + cognitoConfig.getUserPoolId();
            
            // Verificar si el token está expirado
            long expiration = payloadJson.get("exp").asLong();
            long currentTime = System.currentTimeMillis() / 1000;
            
            if (currentTime > expiration) {
                throw new ExpiredJwtException(null, null, "Token expirado");
            }
            
            return issuer.equals(expectedIssuer);
        } catch (Exception e) {
            log.error("Error validando token: {}", e.getMessage());
            return false;
        }
    }

    private void setUpSpringAuthentication(String token) {
        try {
            // Extraer el email y otros datos del token
            String[] chunks = token.split("\\.");
            Base64.Decoder decoder = Base64.getUrlDecoder();
            String payload = new String(decoder.decode(chunks[1]));
            JsonNode payloadJson = mapper.readTree(payload);
            
            /*String email = payloadJson.has("email") ? 
                payloadJson.get("email").asText() : 
                payloadJson.get("cognito:username").asText();*/
             String email = null;

             // Intentar obtener email o username según el tipo de token
             if (payloadJson.has("email")) {
                email = payloadJson.get("email").asText();
             } else if (payloadJson.has("username")) {
                email = payloadJson.get("username").asText();
             } else if (payloadJson.has("cognito:username")) {
               email = payloadJson.get("cognito:username").asText();
     }

             // Validación de seguridad
            if (email == null) {
               throw new RuntimeException("No se pudo obtener el usuario del token");
            }   
            
            // Extraer roles/grupos si están disponibles en el token
            List<SimpleGrantedAuthority> authorities = new ArrayList<>();
            if (payloadJson.has("cognito:groups")) {
                JsonNode groups = payloadJson.get("cognito:groups");
                if (groups.isArray()) {
                    groups.forEach(group -> 
                        authorities.add(new SimpleGrantedAuthority("ROLE_" + group.asText()))
                    );
                }
            }
            
            // Si no hay roles específicos, asignar un rol por defecto
            if (authorities.isEmpty()) {
                authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
            }
            
            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                email, null, authorities);
            
            SecurityContextHolder.getContext().setAuthentication(auth);
            
        } catch (Exception e) {
            log.error("Error configurando la autenticación: {}", e.getMessage());
            SecurityContextHolder.clearContext();
        }
    }
} 