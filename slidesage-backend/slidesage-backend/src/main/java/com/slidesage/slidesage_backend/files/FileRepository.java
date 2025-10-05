package com.slidesage.slidesage_backend.files;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FileRepository extends JpaRepository<FileEntity, UUID> {

    Optional<FileDetailProjection> findByIdAndUserId(UUID id, UUID userId);
    Optional<FileEntity> findEntityByIdAndUserId(UUID id, UUID userId);

    // Return only the projection, not the whole entity
    List<FileItemProjection> findAllByUserIdOrderByUpdatedAtDesc(UUID userId);
}
