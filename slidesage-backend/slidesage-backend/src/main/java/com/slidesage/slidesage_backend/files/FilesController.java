package com.slidesage.slidesage_backend.files;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/files")
public class FilesController {

    private final FileService fileService;

    public FilesController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("userId") UUID userId) {

        // Delegate to service
        ExtractTextResponse response = fileService.saveAndExtract(file, userId);

        // Return the DTO (status + id + preview, etc.)
        return ResponseEntity.ok(response);
    }
}
