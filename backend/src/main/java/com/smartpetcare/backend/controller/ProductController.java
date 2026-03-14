package com.smartpetcare.backend.controller;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartpetcare.backend.entity.Product;
import com.smartpetcare.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductService productService;
    
    private final ObjectMapper objectMapper = new ObjectMapper()
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

    private static final String UPLOAD_DIR = "uploads/";

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    // --- SECURED WITH hasAnyAuthority TO FIX 403 ERROR ---

    @PostMapping(consumes = {"multipart/form-data"})
    @PreAuthorize("hasAnyAuthority('ADMIN', 'ROLE_ADMIN')") // <-- UPDATED
    public ResponseEntity<?> addProduct(
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam("product") String productJson
    ) {
        try {
            Product product = objectMapper.readValue(productJson, Product.class);
            if (file != null && !file.isEmpty()) {
                String imagePath = saveImage(file);
                product.setImage(imagePath);
            }
            return ResponseEntity.ok(productService.addProduct(product));
        } catch (Exception e) {
            e.printStackTrace(); 
            return ResponseEntity.status(500).body("Server Error: " + e.getMessage());
        }
    }

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    @PreAuthorize("hasAnyAuthority('ADMIN', 'ROLE_ADMIN')") // <-- UPDATED
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam("product") String productJson
    ) {
        try {
            Product updatedProduct = objectMapper.readValue(productJson, Product.class);
            if (file != null && !file.isEmpty()) {
                String imagePath = saveImage(file);
                updatedProduct.setImage(imagePath);
            }
            return ResponseEntity.ok(productService.updateProduct(id, updatedProduct));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Server Error: " + e.getMessage());
        }
    }

    private String saveImage(MultipartFile file) throws Exception {
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) uploadDir.mkdirs();

        String uniqueFilename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(UPLOAD_DIR, uniqueFilename);
        Files.copy(file.getInputStream(), filePath);

        return "/uploads/" + uniqueFilename;
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'ROLE_ADMIN')") // <-- UPDATED
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok("Product deleted successfully");
    }

    @PutMapping("/{id}/toggle-stock")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'ROLE_ADMIN')") // <-- UPDATED
    public ResponseEntity<Product> toggleStock(@PathVariable Long id) {
        return ResponseEntity.ok(productService.toggleStockStatus(id));
    }
}