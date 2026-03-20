package com.smartpetcare.backend.repository;

import com.smartpetcare.backend.entity.ProductReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductReviewRepository extends JpaRepository<ProductReview, Long> {
    // Fetches reviews for a specific product, newest first
    List<ProductReview> findByProductIdOrderByCreatedAtDesc(Long productId);
}