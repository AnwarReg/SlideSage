package com.slidesage.slidesage_backend.files;

import java.time.Instant;
import java.util.UUID;

public interface FileDetailProjection {
    UUID getId();
    TextStatus getStatus();       // maps to textStatus in frontend
    String getExtractedText();    // used to calculate preview + extractedChars
    Instant getUpdatedAt();
    String getContentType();
    long getSize();
}
