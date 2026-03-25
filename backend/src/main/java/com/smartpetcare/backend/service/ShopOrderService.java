package com.smartpetcare.backend.service;

import com.smartpetcare.backend.entity.Product;
import com.smartpetcare.backend.entity.ShopOrder;
import com.smartpetcare.backend.entity.ShopOrderItem;
import com.smartpetcare.backend.repository.ProductRepository;
import com.smartpetcare.backend.repository.ShopOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ShopOrderService {

    @Autowired
    private ShopOrderRepository shopOrderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Transactional // Ensures if stock update fails, the whole order is cancelled
    public ShopOrder placeOrder(ShopOrder requestOrder) {
        
        // 1. Process items and update stock
        for (ShopOrderItem item : requestOrder.getItems()) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + item.getProductName()));
            
            // Check stock
            if (product.getStockQuantity() < item.getQuantity()) {
                throw new RuntimeException("Not enough stock for " + product.getName() + ". Only " + product.getStockQuantity() + " left.");
            }

            // Decrease stock
            product.setStockQuantity(product.getStockQuantity() - item.getQuantity());
            if (product.getStockQuantity() == 0) {
                product.setInStock(false);
            }
            productRepository.save(product);
        }

        // 2. Setup the order
        requestOrder.setStatus("PAID"); // Assuming paid on checkout
        
        // 3. Save order to database (Cascade will automatically save the OrderItems too)
        return shopOrderRepository.save(requestOrder);
    }

    public List<ShopOrder> getUserOrders(Long userId) {
        return shopOrderRepository.findByUserIdOrderByOrderDateDesc(userId);
    }

    public List<ShopOrder> getAllOrdersForAdmin() {
        return shopOrderRepository.findAllByOrderByOrderDateDesc();
    }

    public ShopOrder updateOrderStatus(Long orderId, String newStatus) {
        ShopOrder order = shopOrderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(newStatus);
        return shopOrderRepository.save(order);
    }
}