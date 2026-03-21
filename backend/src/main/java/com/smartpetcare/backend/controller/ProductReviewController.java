package com.smartpetcare.backend.controller;

import com.smartpetcare.backend.entity.Product;
import com.smartpetcare.backend.entity.ProductReview;
import com.smartpetcare.backend.repository.ProductRepository;
import com.smartpetcare.backend.repository.ProductReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*") // Changed to * to prevent any CORS issues during dev
public class ProductReviewController {

    @Autowired
    private ProductReviewRepository reviewRepository;

    // ✅ ADDED: Inject ProductRepository to update the main product table
    @Autowired
    private ProductRepository productRepository;

    // 1. Get all reviews for a specific product (Public)
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductReview>> getProductReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewRepository.findByProductIdOrderByCreatedAtDesc(productId));
    }

    // 2. Add a new review (Logged-in users)
    @PostMapping
    public ResponseEntity<ProductReview> addReview(@RequestBody ProductReview review) {
        // Save the review
        ProductReview savedReview = reviewRepository.save(review);
        
        // ✅ Trigger sync: Recalculate and update the Product table
        updateProductRatingAndCount(savedReview.getProductId());
        
        return ResponseEntity.ok(savedReview);
    }

    // 3. Delete a review (Admin Only Moderation)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'ROLE_ADMIN')")
    public ResponseEntity<?> deleteReview(@PathVariable Long id) {
        // Find the review first to get the Product ID before deleting
        Optional<ProductReview> reviewOpt = reviewRepository.findById(id);
        
        if (reviewOpt.isPresent()) {
            Long productId = reviewOpt.get().getProductId();
            
            // Delete the review
            reviewRepository.deleteById(id);
            
            // ✅ Trigger sync: Recalculate without the deleted review
            updateProductRatingAndCount(productId);
        }
        
        return ResponseEntity.ok().build();
    }

    // ==========================================
    // HELPER: Sync Data to Product Table
    // ==========================================
    private void updateProductRatingAndCount(Long productId) {
        // 1. Fetch all current reviews for this product
        List<ProductReview> allReviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
        
        int totalReviews = allReviews.size();
        double averageRating = 5.0; // Default fallback

        // 2. Calculate the new average rating
        if (totalReviews > 0) {
            double sum = 0;
            for (ProductReview r : allReviews) {
                sum += r.getRating();
            }
            // Calculate and round to 1 decimal place (e.g., 4.5)
            averageRating = Math.round((sum / totalReviews) * 10.0) / 10.0;
        }

        // 3. Save the new stats directly to the Product table
        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            product.setReviews(totalReviews);
            product.setRating(averageRating);
            productRepository.save(product);
        }
    }
}