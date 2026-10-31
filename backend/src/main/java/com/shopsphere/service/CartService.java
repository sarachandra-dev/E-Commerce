package com.shopsphere.service;

import com.shopsphere.dto.Dtos.*;
import com.shopsphere.entity.*;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.mapper.EntityMapper;
import com.shopsphere.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final EntityMapper mapper;

    public CartResponse getCart(String email) {
        Cart cart = getOrCreateCart(email);
        return mapper.toCartResponse(cart);
    }

    @Transactional
    public CartResponse addItem(String email, CartItemRequest request) {
        Cart cart = getOrCreateCart(email);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(request.getProductId()))
                .findFirst()
                .ifPresentOrElse(
                        i -> i.setQuantity(i.getQuantity() + request.getQuantity()),
                        () -> cart.getItems().add(CartItem.builder()
                                .cart(cart).product(product).quantity(request.getQuantity()).build())
                );
        return mapper.toCartResponse(cartRepository.save(cart));
    }

    @Transactional
    public CartResponse updateItem(String email, Long itemId, Integer quantity) {
        Cart cart = getOrCreateCart(email);
        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        if (quantity <= 0) cart.getItems().remove(item);
        else item.setQuantity(quantity);
        return mapper.toCartResponse(cartRepository.save(cart));
    }

    @Transactional
    public void removeItem(String email, Long itemId) {
        Cart cart = getOrCreateCart(email);
        cart.getItems().removeIf(i -> i.getId().equals(itemId));
        cartRepository.save(cart);
    }

    @Transactional
    public void clearCart(String email) {
        Cart cart = getOrCreateCart(email);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    private Cart getOrCreateCart(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> cartRepository.save(Cart.builder().user(user).build()));
    }
}
