package com.hospital.controller;

import com.hospital.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "https://cloud-frontend-5kqr.onrender.com"
})
public class AuthController {

    @Autowired
    private AuthService service;

    // ✅ REGISTER API
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {

        String email = body.get("email");
        String password = body.get("password");

        String response = service.register(email, password);

        return ResponseEntity.ok(response);
    }

    // ✅ LOGIN API (FIXED)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {

        String email = body.get("email");
        String password = body.get("password");

        try {
            service.login(email, password);
            return ResponseEntity.ok("Login successful");

        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }
    }
}