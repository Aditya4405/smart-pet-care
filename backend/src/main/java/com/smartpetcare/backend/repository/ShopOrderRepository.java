package com.smartpetcare.backend.repository;

import com.smartpetcare.backend.entity.ShopOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShopOrderRepository extends JpaRepository<ShopOrder, Long> {
    // Find all orders for a specific user
    List<ShopOrder> findByUserIdOrderByOrderDateDesc(Long userId);
    
    // Find all orders (for Admin view)
    List<ShopOrder> findAllByOrderByOrderDateDesc();
}