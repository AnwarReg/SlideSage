package com.slidesage.slidesage_backend.files;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.slidesage.slidesage_backend.files.dto.ExtractTextResponse;


import java.util.UUID;

@Service
public class FileService {

    public ExtractTextResponse saveAndExtract(MultipartFile file, UUID userId) {
        // TODO: implement logic later
        // Right now just return a placeholder response so it compiles
        return new ExtractTextResponse(
                UUID.randomUUID(),         // fake id
                TextStatus.PENDING,        // fake status
                0,                         // chars
                "",                        // preview
                null                       // updatedAt
        );
    }
}
