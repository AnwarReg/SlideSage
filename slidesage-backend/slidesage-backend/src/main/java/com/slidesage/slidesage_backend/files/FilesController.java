package com.slidesage.slidesage_backend.files;

import com.slidesage.slidesage_backend.files.dto.FileDetailResp;
import com.slidesage.slidesage_backend.files.dto.ExtractTextResponse;
import com.slidesage.slidesage_backend.auth.JwtUtil;
import com.slidesage.slidesage_backend.auth.UserRepository;
import com.slidesage.slidesage_backend.auth.User;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
@RestController
@RequestMapping("/api/files")
public class FilesController {

    private final FileService fileService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public FilesController(FileService fileService, JwtUtil jwtUtil, UserRepository userRepository) {
        this.fileService = fileService;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    private UUID extractUserIdFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7);
        String email = jwtUtil.extractUsername(token);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }

    @PostMapping
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestHeader("Authorization") String authHeader) {

        UUID userId = extractUserIdFromToken(authHeader);
        ExtractTextResponse response = fileService.saveAndExtract(file, userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public List<FileItemProjection> getUserFiles(@RequestHeader("Authorization") String authHeader) {
        UUID userId = extractUserIdFromToken(authHeader);
        return fileService.getUserFiles(userId);
    }

    @GetMapping("/{fileId}")
    public FileDetailResp getFileDetails(@PathVariable UUID fileId,
                                         @RequestHeader("Authorization") String authHeader) {
        UUID userId = extractUserIdFromToken(authHeader);
        return fileService.getFileDetails(fileId, userId);
    }

    @PostMapping("/{id}/summary")
    public ResponseEntity<FileDetailResp> generateSummary(@PathVariable UUID id,
                                                          @RequestHeader("Authorization") String authHeader) {
        UUID userId = extractUserIdFromToken(authHeader);
        FileDetailResp response = fileService.generateSummary(id, userId);
        return ResponseEntity.ok(response);
    }
}
