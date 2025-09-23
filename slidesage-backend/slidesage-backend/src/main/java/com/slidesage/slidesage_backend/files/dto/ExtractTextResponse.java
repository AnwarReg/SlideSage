package com.slidesage.slidesage_backend.files.dto;

import com.slidesage.slidesage_backend.files.TextStatus;
import java.time.Instant;
import java.util.UUID;

public record ExtractTextResponse(
        UUID id,
        TextStatus textStatus,
        int extractedChars,
        String preview,
        Instant updatedAt
) {}
