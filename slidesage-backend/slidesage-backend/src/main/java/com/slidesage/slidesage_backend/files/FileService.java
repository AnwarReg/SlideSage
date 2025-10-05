package com.slidesage.slidesage_backend.files;

import com.slidesage.slidesage_backend.files.dto.FileDetailResp;
import com.slidesage.slidesage_backend.files.dto.ExtractTextResponse;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.json.JSONArray;
import org.json.JSONObject;


import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class FileService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;
    private final FileRepository fileRepository;

    public FileService(FileRepository fileRepository) {
        this.fileRepository = fileRepository;
    }

    /**
     * MVP flow: validate -> extract text -> save one row -> return small DTO
     */
    @Transactional
    public ExtractTextResponse saveAndExtract(MultipartFile file) {
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

        UUID hardcodedUserId = UUID.fromString("123e4567-e89b-12d3-a456-426614174000");

        // 4) Build and save one entity (single write)
        FileEntity entity = new FileEntity(file.getOriginalFilename(), bytes, hardcodedUserId);
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


    @Transactional(readOnly = true)
    public FileDetailResp getFileDetails(UUID fileId, UUID userId) {
        return fileRepository.findByIdAndUserId(fileId, userId)
                .map(proj -> {
                    String extractedText = proj.getExtractedText();
                    int extractedChars = (extractedText == null) ? 0 : extractedText.length();
                    String preview = buildPreview(extractedText);

                    return new FileDetailResp(
                            proj.getId(),
                            proj.getStatus(),
                            extractedChars,
                            preview,
                            proj.getUpdatedAt(),
                            proj.getSummary(),
                            proj.getContentType(),
                            proj.getSize()
                    );
                })
                .orElseThrow(() -> new RuntimeException("File not found or not accessible"));
    }

    @Transactional
    public FileDetailResp generateSummary(UUID fileId, UUID userId) {
        // Step 1: Fetch file for this user
        FileEntity file = fileRepository.findEntityByIdAndUserId(fileId, userId)
                .orElseThrow(() -> new RuntimeException("File not found for this user."));

        // Step 2: Check extracted text
        String extractedText = file.getExtractedText();
        if (extractedText == null || extractedText.isBlank()) {
            throw new RuntimeException("No extracted text available for summarization.");
        }

        // Step 3: Generate the summary using Gemini
        String summary = summarizeWithGemini(extractedText);

        // Step 4: Update entity fields
        file.setSummary(summary);
        file.setUpdatedAt(Instant.now());
        fileRepository.save(file);

        // Step 5: Return DTO (manually map fields)
        return new FileDetailResp(
                file.getId(),
                file.getStatus(),                       // assuming this is your TextStatus
                file.getExtractedText() != null ? file.getExtractedText().length() : 0,
                buildPreview(file.getExtractedText()),    // helper method to shorten preview
                file.getUpdatedAt(),
                file.getSummary(),
                file.getContentType(),
                file.getSize()
        );
    }


    private String buildPreview(String text) {
        if (text == null || text.isBlank()) return "";
        int maxLength = 600;
        return text.length() <= maxLength ? text : text.substring(0, maxLength) + "…";
    }

    private String summarizeWithGemini(String text) {
        try {
            // Limit length for free API safety (optional)
            if (text.length() > 4000) {
                text = text.substring(0, 4000);
            }

            // JSON payload
            String payload = """
                {
                  "contents": [{
                    "parts": [{"text": "Summarize this text briefly:\\n%s"}]
                  }]
                }
                """.formatted(text.replace("\"", "'"));

            // HTTP Request
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(payload))
                    .build();


            // Send
            HttpClient client = HttpClient.newHttpClient();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                throw new RuntimeException("Gemini API returned " + response.statusCode() + ": " + response.body());
            }

            // Parse clean summary
            JSONObject json = new JSONObject(response.body());
            String summary = json
                    .getJSONArray("candidates")
                    .getJSONObject(0)
                    .getJSONObject("content")
                    .getJSONArray("parts")
                    .getJSONObject(0)
                    .getString("text");

            return summary.trim();

        } catch (Exception e) {
            e.printStackTrace();
            return "Summary generation failed: " + e.getMessage();
        }
    }
}
