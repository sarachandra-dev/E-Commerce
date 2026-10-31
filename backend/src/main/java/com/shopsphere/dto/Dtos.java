package com.shopsphere.dto;

import com.shopsphere.entity.Order;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class Dtos {

    // Auth
    @Data public static class RegisterRequest {
        @NotBlank String name;
        @Email @NotBlank String email;
        @NotBlank @Size(min = 6) String password;
    }

    @Data public static class LoginRequest {
        @Email @NotBlank String email;
        @NotBlank String password;
    }

    @Data @AllArgsConstructor
    public static class AuthResponse {
        String token;
        String name;
        String email;
        String role;
    }

    // Product
    @Data public static class ProductRequest {
        @NotBlank String name;
        String description;
        @NotNull @DecimalMin("0.0") BigDecimal price;
        @Min(0) Integer stock;
        String imageUrl;
        Long categoryId;
    }

    @Data @AllArgsConstructor @NoArgsConstructor @Builder
    public static class ProductResponse {
        Long id;
        String name;
        String description;
        BigDecimal price;
        Integer stock;
        String imageUrl;
        String categoryName;
        LocalDateTime createdAt;
    }

    // Cart
    @Data public static class CartItemRequest {
        @NotNull Long productId;
        @Min(1) Integer quantity;
    }

    @Data @AllArgsConstructor @NoArgsConstructor @Builder
    public static class CartItemResponse {
        Long id;
        Long productId;
        String productName;
        String imageUrl;
        BigDecimal price;
        Integer quantity;
    }

    @Data @AllArgsConstructor @NoArgsConstructor @Builder
    public static class CartResponse {
        Long id;
        List<CartItemResponse> items;
        BigDecimal total;
    }

    // Order
    @Data public static class OrderRequest {
        @NotBlank String address;
    }

    @Data @AllArgsConstructor @NoArgsConstructor @Builder
    public static class OrderItemResponse {
        Long productId;
        String productName;
        Integer quantity;
        BigDecimal price;
    }

    @Data @AllArgsConstructor @NoArgsConstructor @Builder
    public static class OrderResponse {
        Long id;
        BigDecimal totalAmount;
        Order.Status status;
        String address;
        LocalDateTime createdAt;
        List<OrderItemResponse> items;
    }

    // Category
    @Data public static class CategoryRequest {
        @NotBlank String name;
    }
}
