package com.smartpetcare.backend.repository;

import com.smartpetcare.backend.entity.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {
    List<PaymentTransaction> findAllByOrderByCreatedAtDesc();
    PaymentTransaction findByRazorpayPaymentId(String razorpayPaymentId);
}