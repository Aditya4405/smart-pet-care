package com.smartpetcare.backend.controller;

import com.smartpetcare.backend.entity.ProductReview;
import com.smartpetcare.backend.repository.ProductReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductReviewController {

    @Autowired
    private ProductReviewRepository reviewRepository;

    // 1. Get all reviews for a specific product (Public)
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductReview>> getProductReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewRepository.findByProductIdOrderByCreatedAtDesc(productId));
    }

    // 2. Add a new review (Logged-in users)
    @PostMapping
    public ResponseEntity<ProductReview> addReview(@RequestBody ProductReview review) {
        ProductReview savedReview = reviewRepository.save(review);
        return ResponseEntity.ok(savedReview);
    }

    // 3. Delete a review (Admin Only Moderation)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'ROLE_ADMIN')")
    public ResponseEntity<?> deleteReview(@PathVariable Long id) {
        reviewRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}