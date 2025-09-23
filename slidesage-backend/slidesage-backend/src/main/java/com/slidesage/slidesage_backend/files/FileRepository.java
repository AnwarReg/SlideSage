package com.slidesage.slidesage_backend.files;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface FileRepository extends JpaRepository<FileEntity, UUID> {}
