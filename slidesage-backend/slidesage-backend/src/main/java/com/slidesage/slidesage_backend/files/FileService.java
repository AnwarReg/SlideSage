package com.slidesage.slidesage_backend.files;

import com.slidesage.slidesage_backend.files.dto.ExtractTextResponse;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class FileService {

    private final FileRepository fileRepository;

    public FileService(FileRepository fileRepository) {
        this.fileRepository = fileRepository;
    }

    /**
     * MVP flow: validate -> extract text -> save one row -> return small DTO
     */
    @Transactional
    public ExtractTextResponse saveAndExtract(MultipartFile file, UUID userId) {
        // 1) Validate
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("No file uploaded.");
        }
        String contentType = file.getContentType() == null ? "" : file.getContentType();
        if (!"application/pdf".equalsIgnoreCase(contentType)) {
            throw new IllegalArgumentException("Only PDF files are supported.");
        }

        // 2) Read bytes
        byte[] bytes;
        try {
            bytes = file.getBytes();
        } catch (Exception e) {
            throw new RuntimeException("Failed to read uploaded bytes.", e);
        }

        // 3) Extract text (PDFBox)
        String extracted;
        try (PDDocument doc = Loader.loadPDF(bytes)) {
            PDFTextStripper stripper = new PDFTextStripper();
            extracted = normalize(stripper.getText(doc));
        } catch (Exception e) {
            throw new RuntimeException("Failed to extract text from PDF.", e);
        }

        // 4) Build and save one entity (single write)
        FileEntity entity = new FileEntity(file.getOriginalFilename(), bytes, userId);
        entity.setExtractedText(extracted);
        entity.setStatus(extracted.isBlank() ? TextStatus.EMPTY : TextStatus.READY);
        entity.setContentType(file.getContentType());
        entity.setSize(file.getSize()); // in bytes


        FileEntity saved = fileRepository.save(entity); // id is generated here

        // 5) Build lightweight response
        String preview = preview(extracted, 600);
        return new ExtractTextResponse(
                saved.getId(),
                saved.getStatus(),
                extracted.length(),
                preview,
                saved.getUpdatedAt()
        );
    }

    // --- helpers ---

    private static String normalize(String s) {
        if (s == null) return "";
        String unified = s.replace("\r\n", "\n");
        unified = unified.replaceAll("\n{3,}", "\n\n");  // collapse >2 newlines
        unified = unified.replaceAll("[ \\t]{2,}", " "); // collapse long spaces/tabs
        return unified.trim();
    }

    private static String preview(String s, int max) {
        if (s == null) return "";
        if (s.length() <= max) return s;
        return s.substring(0, max) + "…";
    }

    @Transactional(readOnly = true)
    public List<FileItemProjection> getUserFiles(UUID userId) {
        return fileRepository.findAllByUserIdOrderByUpdatedAtDesc(userId);
    }

}
