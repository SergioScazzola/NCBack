package com.Sisbul.ApiRrest.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> getUserInfo() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Información del usuario autenticado");
        response.put("user", auth.getName());
        response.put("authorities", auth.getAuthorities());
        response.put("isAuthenticated", auth.isAuthenticated());
        return ResponseEntity.ok(response);
    }
} 