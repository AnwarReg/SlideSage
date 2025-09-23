package com.slidesage.slidesage_backend.files;

import com.slidesage.slidesage_backend.files.dto.ExtractTextResponse;
import com.slidesage.slidesage_backend.files.exception.BadRequestException;
import com.slidesage.slidesage_backend.files.exception.ExtractionFailedException;
import com.slidesage.slidesage_backend.files.exception.FileNotFoundException;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class FileService {

    private final FileRepository repository;

    public FileService(FileRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public ExtractTextResponse extractText(UUID id) {
        FileEntity file = repository.findById(id)
                .orElseThrow(() -> new FileNotFoundException(id));

        String ct = Optional.ofNullable(file.getContentType()).orElse("");
        if (!"application/pdf".equalsIgnoreCase(ct)) {
            throw new BadRequestException("Text extraction is only supported for PDFs.");
        }
        if (file.getData() == null || file.getData().length == 0) {
            throw new BadRequestException("File has no data.");
        }

        String text;
        try (PDDocument doc = Loader.loadPDF(file.getData())) {
            PDFTextStripper stripper = new PDFTextStripper();
            text = stripper.getText(doc);
        } catch (Exception e) {
            file.setTextStatus(TextStatus.ERROR);
            file.setUpdatedAt(Instant.now());
            repository.save(file);
            throw new ExtractionFailedException("Failed to extract text from PDF.", e);
        }

        String normalized = normalize(text);
        file.setExtractedText(normalized);
        file.setTextStatus(normalized.isBlank() ? TextStatus.EMPTY : TextStatus.READY);
        file.setUpdatedAt(Instant.now());
        repository.save(file);

        String preview = normalized.length() <= 600 ? normalized : normalized.substring(0, 600) + "…";
        return new ExtractTextResponse(
                file.getId(),
                file.getTextStatus(),
                normalized.length(),
                preview,
                file.getUpdatedAt()
        );
    }

    private static String normalize(String s) {
        if (s == null) return "";
        String unified = s.replace("\r\n", "\n");
        unified = unified.replaceAll("\n{3,}", "\n\n");  // collapse 3+ newlines to 2
        unified = unified.replaceAll("[ \\t]{2,}", " "); // collapse long runs of spaces/tabs
        return unified.trim();
    }
}
