import db from '../db.json';

// Constants
const CART_STORAGE_KEY = 'userCart_1'; // Key for localStorage, specific to userId: 1

// Load cart from localStorage or initialize from db.json
const initializeCart = () => {
  let initialCart = { userId: 1, items: [] };

  try {
    // Check if cart exists in localStorage
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      if (parsedCart && Array.isArray(parsedCart.items)) {
        initialCart.items = parsedCart.items;
        return initialCart;
      }
    }

    // If no cart in localStorage, initialize from db.json
    const userCart = db.cart.find((cart) => cart.userId === 1);
    if (userCart && Array.isArray(userCart.items)) {
      initialCart.items = userCart.items;
    }

    // Save the initialized cart to localStorage
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(initialCart));
  } catch (err) {
    console.error('Error initializing cart:', err);
    // Fallback to empty cart if there's an error
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(initialCart));
  }

  return initialCart;
};

// Initialize cart state
let cartState = initializeCart();

// Utility functions to manage the cart
export const getCart = () => {
  // Always return the current in-memory cart state
  return cartState.items;
};

export const updateCart = (newItems) => {
  try {
    // Update in-memory cart state
    cartState.items = newItems;

    // Save to localStorage
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartState));

    // Dispatch a custom event to notify listeners of cart updates
    const event = new Event('cartUpdated');
    window.dispatchEvent(event);

    return cartState.items;
  } catch (err) {
    console.error('Error updating cart:', err);
    return cartState.items;
  }
};

export const clearCart = () => {
  try {
    // Clear in-memory cart state
    cartState.items = [];

    // Save to localStorage
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartState));

    // Dispatch a custom event to notify listeners of cart updates
    const event = new Event('cartUpdated');
    window.dispatchEvent(event);

    return cartState.items;
  } catch (err) {
    console.error('Error clearing cart:', err);
    return cartState.items;
  }
};