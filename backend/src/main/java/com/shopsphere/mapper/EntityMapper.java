package com.shopsphere.mapper;

import com.shopsphere.dto.Dtos.*;
import com.shopsphere.entity.*;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.util.List;

@Component
public class EntityMapper {

    public ProductResponse toProductResponse(Product p) {
        return ProductResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .description(p.getDescription())
                .price(p.getPrice())
                .stock(p.getStock())
                .imageUrl(p.getImageUrl())
                .categoryName(p.getCategory() != null ? p.getCategory().getName() : null)
                .createdAt(p.getCreatedAt())
                .build();
    }

    public CartItemResponse toCartItemResponse(CartItem item) {
        return CartItemResponse.builder()
                .id(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .imageUrl(item.getProduct().getImageUrl())
                .price(item.getProduct().getPrice())
                .quantity(item.getQuantity())
                .build();
    }

    public CartResponse toCartResponse(Cart cart) {
        List<CartItemResponse> items = cart.getItems().stream()
                .map(this::toCartItemResponse).toList();
        BigDecimal total = items.stream()
                .map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return CartResponse.builder().id(cart.getId()).items(items).total(total).build();
    }

    public OrderItemResponse toOrderItemResponse(OrderItem item) {
        return OrderItemResponse.builder()
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .quantity(item.getQuantity())
                .price(item.getPrice())
                .build();
    }

    public OrderResponse toOrderResponse(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .address(order.getAddress())
                .createdAt(order.getCreatedAt())
                .items(order.getItems().stream().map(this::toOrderItemResponse).toList())
                .build();
    }
}
