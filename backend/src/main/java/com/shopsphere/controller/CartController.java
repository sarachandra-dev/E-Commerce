package com.shopsphere.controller;

import com.shopsphere.dto.Dtos.*;
import com.shopsphere.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartResponse> getCart(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(cartService.getCart(user.getUsername()));
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addItem(@AuthenticationPrincipal UserDetails user,
                                                 @RequestBody CartItemRequest request) {
        return ResponseEntity.ok(cartService.addItem(user.getUsername(), request));
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartResponse> updateItem(@AuthenticationPrincipal UserDetails user,
                                                    @PathVariable Long itemId,
                                                    @RequestParam Integer quantity) {
        return ResponseEntity.ok(cartService.updateItem(user.getUsername(), itemId, quantity));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Void> removeItem(@AuthenticationPrincipal UserDetails user,
                                            @PathVariable Long itemId) {
        cartService.removeItem(user.getUsername(), itemId);
        return ResponseEntity.noContent().build();
    }
}
