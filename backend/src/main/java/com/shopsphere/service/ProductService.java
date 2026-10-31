package com.shopsphere.service;

import com.shopsphere.dto.Dtos.*;
import com.shopsphere.entity.*;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.mapper.EntityMapper;
import com.shopsphere.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final EntityMapper mapper;

    public List<ProductResponse> getAll() {
        return productRepository.findAll().stream().map(mapper::toProductResponse).toList();
    }

    public ProductResponse getById(Long id) {
        return mapper.toProductResponse(findProduct(id));
    }

    public List<ProductResponse> getByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId).stream().map(mapper::toProductResponse).toList();
    }

    public List<ProductResponse> search(String keyword) {
        return productRepository.searchByName(keyword).stream().map(mapper::toProductResponse).toList();
    }

    public ProductResponse create(ProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .stock(request.getStock())
                .imageUrl(request.getImageUrl())
                .category(category)
                .build();
        return mapper.toProductResponse(productRepository.save(product));
    }

    public ProductResponse update(Long id, ProductRequest request) {
        Product product = findProduct(id);
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setImageUrl(request.getImageUrl());
        product.setCategory(category);
        return mapper.toProductResponse(productRepository.save(product));
    }

    public void delete(Long id) {
        productRepository.delete(findProduct(id));
    }

    private Product findProduct(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }
}
