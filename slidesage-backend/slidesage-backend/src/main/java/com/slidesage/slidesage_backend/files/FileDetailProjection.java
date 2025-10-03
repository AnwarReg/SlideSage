package com.slidesage.slidesage_backend.files;

import java.time.Instant;
import java.util.UUID;

public interface FileDetailProjection {
    UUID getId();
    TextStatus getStatus();
    String getExtractedText();
    Instant getUpdatedAt();
    String getSummary();
    String getContentType();
    long getSize();
}
