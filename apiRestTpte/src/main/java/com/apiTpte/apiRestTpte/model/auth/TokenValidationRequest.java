package com.apiTpte.apiRestTpte.model.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TokenValidationRequest {
    
    @NotBlank(message = "El token es obligatorio")
    private String token;
} 