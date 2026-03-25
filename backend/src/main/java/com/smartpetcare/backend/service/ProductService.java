package com.smartpetcare.backend.service;

import com.smartpetcare.backend.entity.Product;
import com.smartpetcare.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    // --- PUBLIC / SHARED METHODS ---
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    // --- ADMIN METHODS ---
    public Product addProduct(Product product) {
        product.setInStock(product.getStockQuantity() != null && product.getStockQuantity() > 0);
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product updatedProduct) {
        Product existing = getProductById(id);
        
        existing.setName(updatedProduct.getName());
        existing.setBrand(updatedProduct.getBrand());
        existing.setCategory(updatedProduct.getCategory());
        existing.setPrice(updatedProduct.getPrice());
        existing.setOriginalPrice(updatedProduct.getOriginalPrice());
        existing.setStockQuantity(updatedProduct.getStockQuantity());
        existing.setInStock(updatedProduct.getStockQuantity() > 0);
        existing.setBadge(updatedProduct.getBadge());
        existing.setImage(updatedProduct.getImage());
        existing.setDescription(updatedProduct.getDescription());
        existing.setFeatures(updatedProduct.getFeatures());

        return productRepository.save(existing);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    public Product toggleStockStatus(Long id) {
        Product product = getProductById(id);
        boolean currentlyInStock = product.getInStock() != null && product.getInStock();
        
        product.setInStock(!currentlyInStock);
        if (!currentlyInStock) {
            product.setStockQuantity(50); // Give default stock when marked IN stock
        } else {
            product.setStockQuantity(0); // Set to 0 when marked OUT of stock
        }
        
        return productRepository.save(product);
    }
}