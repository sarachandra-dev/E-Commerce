package com.shopsphere.controller;

import com.shopsphere.dto.Dtos.*;
import com.shopsphere.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(@AuthenticationPrincipal UserDetails user,
                                                     @RequestBody OrderRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.placeOrder(user.getUsername(), request));
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getMyOrders(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(orderService.getUserOrders(user.getUsername()));
    }
}
