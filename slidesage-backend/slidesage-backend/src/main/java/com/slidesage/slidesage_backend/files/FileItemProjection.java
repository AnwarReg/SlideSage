package com.slidesage.slidesage_backend.files;

import java.util.UUID;
import java.time.Instant;

public interface FileItemProjection {
    UUID getId();            // maps to FileEntity.id
    String getFilename();    // maps to FileEntity.filename
    Instant getCreatedAt();  // maps to FileEntity.createdAt
    long getSize();      // maps to FileEntity.file_data length (manual or query)
    String getContentType(); // maps to FileEntity.contentType
}
