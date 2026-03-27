// src/context/CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // Initialize from LocalStorage so the cart survives page refreshes!
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('petCareCart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save to LocalStorage whenever the cart changes
  useEffect(() => {
    localStorage.setItem('petCareCart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + quantity } : item);
      }
      return [...prev, { ...product, qty: quantity }];
    });
    toast.success(`${product.name} added to cart`);
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item));
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(item => item.id !== id));
  
  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.qty), 0);
  const cartItemCount = cart.reduce((total, item) => total + item.qty, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQty, removeFromCart, clearCart, cartTotal, cartItemCount }}>
      {children}
    </CartContext.Provider>
  );
};