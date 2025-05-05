import db from '../db.json';

// Constants
const CART_STORAGE_KEY = 'userCart_1'; // Key for localStorage, specific to userId: 1
const ORDER_HISTORY_KEY = 'orderHistory_1'; // Key for order history

// Load cart from localStorage or initialize from db.json
const initializeCart = () => {
  let initialCart = { userId: 1, items: [] };

  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      if (parsedCart && Array.isArray(parsedCart.items)) {
        initialCart.items = parsedCart.items;
        return initialCart;
      }
    }

    const userCart = db.cart.find((cart) => cart.userId === 1);
    if (userCart && Array.isArray(userCart.items)) {
      initialCart.items = userCart.items;
    }

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(initialCart));
  } catch (err) {
    console.error('Error initializing cart:', err);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(initialCart));
  }

  return initialCart;
};

// Initialize cart state
let cartState = initializeCart();

// Load order history from localStorage
const getOrderHistory = () => {
  try {
    const storedOrders = localStorage.getItem(ORDER_HISTORY_KEY);
    return storedOrders ? JSON.parse(storedOrders) : [];
  } catch (err) {
    console.error('Error getting order history:', err);
    return [];
  }
};

// Save order history to localStorage
const saveOrderHistory = (orders) => {
  try {
    localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(orders));
  } catch (err) {
    console.error('Error saving order history:', err);
  }
};

// Utility functions
export const getCart = () => {
  return cartState.items;
};

export const updateCart = (newItems) => {
  try {
    cartState.items = newItems;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartState));
    window.dispatchEvent(new Event('cartUpdated'));
    return cartState.items;
  } catch (err) {
    console.error('Error updating cart:', err);
    return cartState.items;
  }
};

export const clearCart = () => {
  try {
    cartState.items = [];
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartState));
    window.dispatchEvent(new Event('cartUpdated'));
    return cartState.items;
  } catch (err) {
    console.error('Error clearing cart:', err);
    return cartState.items;
  }
};

export const checkout = () => {
  try {
    const cartItems = getCart();
    if (cartItems.length === 0) {
      throw new Error('Cart is empty');
    }

    const orders = getOrderHistory();
    const newOrder = {
      orderId: `ORD${orders.length + 1}`.padStart(7, '0'),
      date: new Date().toISOString(),
      items: cartItems,
    };
    orders.push(newOrder);
    saveOrderHistory(orders);

    clearCart();
    window.dispatchEvent(new Event('orderPlaced'));
    return newOrder;
  } catch (err) {
    console.error('Error during checkout:', err);
    throw err;
  }
};

export const getOrderCount = () => {
  return getOrderHistory().length;
};