package com.shopsphere.controller;

import com.shopsphere.dto.Dtos.*;
import com.shopsphere.entity.Category;
import com.shopsphere.exception.BadRequestException;
import com.shopsphere.repository.CategoryRepository;
import com.shopsphere.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ProductService productService;
    private final OrderService orderService;
    private final CategoryRepository categoryRepository;

    // Products
    @PostMapping("/products")
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.create(request));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<ProductResponse> updateProduct(@PathVariable Long id,
                                                          @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(productService.update(id, request));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // Orders
    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(@PathVariable Long id,
                                                            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(orderService.updateStatus(id, body.get("status")));
    }

    // Categories
    @PostMapping("/categories")
    public ResponseEntity<Category> createCategory(@Valid @RequestBody CategoryRequest request) {
        if (categoryRepository.existsByName(request.getName()))
            throw new BadRequestException("Category already exists");
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(categoryRepository.save(Category.builder().name(request.getName()).build()));
    }
}
