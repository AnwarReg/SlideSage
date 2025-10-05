package com.slidesage.slidesage_backend.files;

import com.slidesage.slidesage_backend.files.dto.FileDetailResp;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.slidesage.slidesage_backend.files.dto.ExtractTextResponse;

import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
@RestController
@RequestMapping("/api/files")
public class FilesController {

    private final FileService fileService;

    public FilesController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file) {

        // Delegate to service
        ExtractTextResponse response = fileService.saveAndExtract(file);

        // Return the DTO (status + id + preview, etc.)
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public List<FileItemProjection> getUserFiles() {
        UUID hardcodedUserId = UUID.fromString("123e4567-e89b-12d3-a456-426614174000");
        return fileService.getUserFiles(hardcodedUserId);
    }

    @GetMapping("/{fileId}")
    public FileDetailResp getFileDetails(@PathVariable UUID fileId) {
        UUID hardcodedUserId = UUID.fromString("123e4567-e89b-12d3-a456-426614174000");
        return fileService.getFileDetails(fileId, hardcodedUserId);
    }

    @PostMapping("/{id}/summary")
    public ResponseEntity<FileDetailResp> generateSummary(@PathVariable UUID id) {
        UUID userId = UUID.fromString("123e4567-e89b-12d3-a456-426614174000");// temporary, hardcoded for now
        FileDetailResp response = fileService.generateSummary(id, userId);
        return ResponseEntity.ok(response);
    }


}
