package com.shopsphere.service;

import com.shopsphere.dto.Dtos.*;
import com.shopsphere.entity.*;
import com.shopsphere.exception.*;
import com.shopsphere.mapper.EntityMapper;
import com.shopsphere.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartService cartService;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final EntityMapper mapper;

    @Transactional
    public OrderResponse placeOrder(String email, OrderRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException("Cart is empty"));
        if (cart.getItems().isEmpty()) throw new BadRequestException("Cart is empty");

        Order order = Order.builder()
                .user(user)
                .address(request.getAddress())
                .status(Order.Status.PENDING)
                .totalAmount(BigDecimal.ZERO)
                .build();

        List<OrderItem> orderItems = cart.getItems().stream().map(cartItem ->
                OrderItem.builder()
                        .order(order)
                        .product(cartItem.getProduct())
                        .quantity(cartItem.getQuantity())
                        .price(cartItem.getProduct().getPrice())
                        .build()
        ).toList();

        BigDecimal total = orderItems.stream()
                .map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setTotalAmount(total);
        order.setItems(orderItems);
        orderRepository.save(order);
        cartService.clearCart(email);
        return mapper.toOrderResponse(order);
    }

    public List<OrderResponse> getUserOrders(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream().map(mapper::toOrderResponse).toList();
    }

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream().map(mapper::toOrderResponse).toList();
    }

    @Transactional
    public OrderResponse updateStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        order.setStatus(Order.Status.valueOf(status.toUpperCase()));
        return mapper.toOrderResponse(orderRepository.save(order));
    }
}
