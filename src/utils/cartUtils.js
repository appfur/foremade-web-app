import db from '../db.json';

// In-memory cart state, initialized with db.json data for userId: 1
let cartState = {
  userId: 1, // Hardcoding to userId: 1 for now
  items: [],
};

// Initialize cart from db.json
const initializeCart = () => {
  const userCart = db.cart.find((cart) => cart.userId === 1);
  if (userCart && Array.isArray(userCart.items)) {
    cartState.items = userCart.items;
  }
};

// Call initializeCart on module load
initializeCart();

// Utility functions to manage the cart
export const getCart = () => {
  return cartState.items;
};

export const updateCart = (newItems) => {
  cartState.items = newItems;
  // Dispatch a custom event to notify listeners of cart updates
  const event = new Event('cartUpdated');
  window.dispatchEvent(event);
  return cartState.items;
};

export const clearCart = () => {
  cartState.items = [];
  // Dispatch a custom event to notify listeners of cart updates
  const event = new Event('cartUpdated');
  window.dispatchEvent(event);
  return cartState.items;
};