package com.slidesage.slidesage_backend.files.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
public class ExtractionFailedException extends RuntimeException {
    public ExtractionFailedException(String msg, Throwable cause) { super(msg, cause); }
}
