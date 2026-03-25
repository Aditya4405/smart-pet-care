package com.smartpetcare.backend.service;

import org.apache.poi.xwpf.usermodel.*;
import org.apache.poi.poifs.crypt.HashAlgorithm;
import org.springframework.stereotype.Service;

import java.io.FileOutputStream;
import java.io.File;

@Service
public class PrescriptionService {

    public String generateDoc(String content, Long appointmentId) {
        try {
            // ✅ Ensure uploads folder exists
            File uploadDir = new File("uploads");
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            String fileName = "prescription_" + appointmentId + ".docx";
            String path = "uploads/" + fileName;

            XWPFDocument doc = new XWPFDocument();

            // Title
            XWPFParagraph title = doc.createParagraph();
            XWPFRun run = title.createRun();
            run.setText("Smart Pet Care Prescription");
            run.setBold(true);
            run.setFontSize(16);

            // Content
            XWPFParagraph body = doc.createParagraph();
            XWPFRun run2 = body.createRun();
            // Split by newline so formatting looks good if the vet uses line breaks
            String[] lines = content.split("\n");
            for (String line : lines) {
                run2.setText(line);
                run2.addBreak();
            }

            // 🔒 LOCK THE DOCUMENT (Read-Only)
            // This prevents the pet owner from opening Word and altering the prescription.
            // Only someone with the password "SmartPetCareSecure!" could unlock it.
            doc.enforceReadonlyProtection("SmartPetCareSecure!", HashAlgorithm.sha256);

            // Save the file
            FileOutputStream out = new FileOutputStream(path);
            doc.write(out);

            out.close();
            doc.close();

            return fileName;

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to generate document");
        }
    }
}