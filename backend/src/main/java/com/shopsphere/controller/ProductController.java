package com.shopsphere.controller;

import com.shopsphere.dto.Dtos.*;
import com.shopsphere.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAll(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search) {
        if (search != null) return ResponseEntity.ok(productService.search(search));
        if (categoryId != null) return ResponseEntity.ok(productService.getByCategory(categoryId));
        return ResponseEntity.ok(productService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getById(id));
    }
}
