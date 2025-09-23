package com.slidesage.slidesage_backend.files;

import com.slidesage.slidesage_backend.files.dto.ExtractTextResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "http://localhost:5173")
public class FilesController {
    private final FileService service;
    public FilesController(FileService service) { this.service = service; }

    @PostMapping("/{id}/extract-text")
    public ResponseEntity<ExtractTextResponse> extractText(@PathVariable UUID id) {
        return ResponseEntity.ok(service.extractText(id));
    }
}
