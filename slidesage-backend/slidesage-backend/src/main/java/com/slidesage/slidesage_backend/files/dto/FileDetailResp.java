package com.slidesage.slidesage_backend.files.dto;

import com.slidesage.slidesage_backend.files.TextStatus;

import java.time.Instant;
import java.util.UUID;

public class FileDetailResp {
    private UUID id;
    private TextStatus textStatus;
    private int extractedChars;
    private String preview;
    private Instant updatedAt;
    private String summary;
    private String quiz;
    private TextStatus summaryStatus;  // can reuse enum if statuses are the same
    private TextStatus quizStatus;
    private String contentType;
    private long size;

    public FileDetailResp(
            UUID id,
            TextStatus textStatus,
            int extractedChars,
            String preview,
            Instant updatedAt,
            String summary,
            String quiz,
            String contentType,
            long size
    ) {
        this.id = id;
        this.textStatus = textStatus;
        this.extractedChars = extractedChars;
        this.preview = preview;
        this.updatedAt = updatedAt;
        this.summary = summary;
        this.quiz = quiz;
        this.contentType = contentType;
        this.size = size;

        // optionally, compute these from stored values later
        this.summaryStatus = summary != null ? TextStatus.READY : TextStatus.NONE;
        this.quizStatus = quiz != null ? TextStatus.READY : TextStatus.NONE;
    }

    // --- Getters ---
    public UUID getId() { return id; }
    public TextStatus getTextStatus() { return textStatus; }
    public int getExtractedChars() { return extractedChars; }
    public String getPreview() { return preview; }
    public Instant getUpdatedAt() { return updatedAt; }
    public String getSummary() { return summary; }
    public String getQuiz() { return quiz; }
    public TextStatus getSummaryStatus() { return summaryStatus; }
    public TextStatus getQuizStatus() { return quizStatus; }
    public String getContentType() { return contentType; }
    public long getSize() { return size; }
}
