package com.slidesage.slidesage_backend.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:3000"})
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        try {
            authService.register(email, password);
            return ResponseEntity.ok(Map.of("message", "User registered successfully"));
        } catch (RuntimeException e) {
            HttpStatus status;
            if (e.getMessage().contains("already")) {
                status = HttpStatus.CONFLICT; // 409 for duplicate
            } else {
                status = HttpStatus.BAD_REQUEST;
            }

            return ResponseEntity.status(status)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        try {
            String token = authService.login(email, password);
            return ResponseEntity.ok(Map.of("token", token));
        } catch (RuntimeException e) {
            HttpStatus status;
            if (e.getMessage().contains("Invalid")) {
                status = HttpStatus.UNAUTHORIZED; // 401 for wrong password
            } else if (e.getMessage().contains("not found")) {
                status = HttpStatus.NOT_FOUND; // 404 for no user
            } else {
                status = HttpStatus.BAD_REQUEST;
            }

            return ResponseEntity.status(status)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
