package com.slidesage.slidesage_backend.files;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "files")
public class FileEntity {
    @Id @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(nullable = false) private String name;
    @Column(nullable = false) private String contentType;
    @Column(nullable = false) private long sizeBytes;
    @Column(nullable = false, updatable = false) private Instant createdAt;

    @Lob @Column(nullable = false)
    private byte[] data;

    @Enumerated(EnumType.STRING) @Column(nullable = false)
    private TextStatus textStatus = TextStatus.NONE;

    @Lob @Column(columnDefinition = "TEXT")
    private String extractedText;

    private Instant updatedAt;

    public FileEntity() {}

    // getters/setters …
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }
    public long getSizeBytes() { return sizeBytes; }
    public void setSizeBytes(long sizeBytes) { this.sizeBytes = sizeBytes; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public byte[] getData() { return data; }
    public void setData(byte[] data) { this.data = data; }
    public TextStatus getTextStatus() { return textStatus; }
    public void setTextStatus(TextStatus textStatus) { this.textStatus = textStatus; }
    public String getExtractedText() { return extractedText; }
    public void setExtractedText(String extractedText) { this.extractedText = extractedText; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
