package com.smartpetcare.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class FileService {

    // Define where to save the files. 
    // using "user.dir" saves it in your project folder root
    private final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/";

    public String saveFile(MultipartFile file) throws IOException {
        // 1. Create the folder if it doesn't exist
        File directory = new File(UPLOAD_DIR);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        // 2. Generate a unique filename to avoid conflicts
        // e.g., "vet_certificate.pdf" -> "1709882_vet_certificate.pdf"
        String uniqueFileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

        // 3. Save the file
        Path filePath = Paths.get(UPLOAD_DIR + uniqueFileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // 4. Return the file path (to save in the database)
        return uniqueFileName;
    }
}