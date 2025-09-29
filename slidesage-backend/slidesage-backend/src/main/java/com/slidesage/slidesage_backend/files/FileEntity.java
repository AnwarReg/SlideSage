package com.slidesage.slidesage_backend.files;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "files")
public class FileEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String filename;

    @Column(nullable = false)
    private String contentType;

    @Lob
    @Column(nullable = false)
    private byte[] fileData;   // raw PDF bytes

    @Lob
    private String extractedText;  // extracted plain text

    @Lob
    private String summary;        // AI summary

    @Enumerated(EnumType.STRING)
    private TextStatus status;     // e.g. NONE, READY, ERROR

    @Column(nullable = false)
    private UUID userId;           // foreign key to users.id

    private Instant createdAt;
    private Instant updatedAt;

    // --- Constructors ---
    public FileEntity() {}

    // convenience constructor
    public FileEntity(String filename, byte[] fileData, UUID userId) {
        this.filename = filename;
        this.fileData = fileData;
        this.userId = userId;
        this.status = TextStatus.NONE;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    // --- Getters & Setters ---
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }

    public byte[] getFileData() { return fileData; }
    public void setFileData(byte[] fileData) { this.fileData = fileData; }

    public String getExtractedText() { return extractedText; }
    public void setExtractedText(String extractedText) { this.extractedText = extractedText; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public TextStatus getStatus() { return status; }
    public void setStatus(TextStatus status) { this.status = status; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    @PrePersist
    public void prePersist() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = Instant.now();
    }
}
