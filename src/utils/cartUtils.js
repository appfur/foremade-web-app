import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

// Constants
const getCartStorageKey = (userId) => `userCart_${userId}`;
const getOrderHistoryKey = (userId) => `orderHistory_${userId}`;

// Initialize cart for a user
const initializeCart = async (userId) => {
  const cartStorageKey = getCartStorageKey(userId);
  let initialCart = { userId, items: [] };

  try {
    const storedCart = localStorage.getItem(cartStorageKey);
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      if (parsedCart && Array.isArray(parsedCart.items)) {
        // Validate items with Firestore
        const validatedItems = [];
        for (const item of parsedCart.items) {
          const productRef = doc(db, 'products', item.productId);
          const productSnap = await getDoc(productRef);
          if (productSnap.exists()) {
            validatedItems.push({
              ...item,
              imageUrl: productSnap.data().imageUrl || '',
              name: productSnap.data().name,
              price: productSnap.data().price,
            });
          }
        }
        initialCart.items = validatedItems;
        localStorage.setItem(cartStorageKey, JSON.stringify(initialCart));
        return initialCart;
      }
    }

    localStorage.setItem(cartStorageKey, JSON.stringify(initialCart));
  } catch (err) {
    console.error('Error initializing cart:', err);
    localStorage.setItem(cartStorageKey, JSON.stringify(initialCart));
  }

  return initialCart;
};

// Load order history from localStorage
const getOrderHistory = (userId) => {
  try {
    const orderHistoryKey = getOrderHistoryKey(userId);
    const storedOrders = localStorage.getItem(orderHistoryKey);
    return storedOrders ? JSON.parse(storedOrders) : [];
  } catch (err) {
    console.error('Error getting order history:', err);
    return [];
  }
};

// Save order history to localStorage
const saveOrderHistory = (userId, orders) => {
  try {
    const orderHistoryKey = getOrderHistoryKey(userId);
    localStorage.setItem(orderHistoryKey, JSON.stringify(orders));
  } catch (err) {
    console.error('Error saving order history:', err);
  }
};

// Utility functions
export const getCart = async (userId) => {
  const cartState = await initializeCart(userId);
  return cartState.items;
};

export const addToCart = async (userId, productId, quantity = 1) => {
  try {
    const cartState = await initializeCart(userId);
    const productRef = doc(db, 'products', productId);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      throw new Error('Product not found');
    }

    const productData = productSnap.data();
    const existingItem = cartState.items.find((item) => item.productId === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cartState.items.push({
        productId,
        name: productData.name,
        price: productData.price,
        imageUrl: productData.imageUrl || '',
        quantity,
      });
    }

    const cartStorageKey = getCartStorageKey(userId);
    localStorage.setItem(cartStorageKey, JSON.stringify(cartState));
    window.dispatchEvent(new Event('cartUpdated'));
    return cartState.items;
  } catch (err) {
    console.error('Error adding to cart:', err);
    throw err;
  }
};

export const updateCart = async (userId, newItems) => {
  try {
    const cartState = await initializeCart(userId);
    // Validate items with Firestore
    const validatedItems = [];
    for (const item of newItems) {
      const productRef = doc(db, 'products', item.productId);
      const productSnap = await getDoc(productRef);
      if (productSnap.exists()) {
        validatedItems.push({
          ...item,
          imageUrl: productSnap.data().imageUrl || '',
          name: productSnap.data().name,
          price: productSnap.data().price,
        });
      }
    }

    cartState.items = validatedItems;
    const cartStorageKey = getCartStorageKey(userId);
    localStorage.setItem(cartStorageKey, JSON.stringify(cartState));
    window.dispatchEvent(new Event('cartUpdated'));
    return cartState.items;
  } catch (err) {
    console.error('Error updating cart:', err);
    return (await initializeCart(userId)).items;
  }
};

export const clearCart = async (userId) => {
  try {
    const cartState = await initializeCart(userId);
    cartState.items = [];
    const cartStorageKey = getCartStorageKey(userId);
    localStorage.setItem(cartStorageKey, JSON.stringify(cartState));
    window.dispatchEvent(new Event('cartUpdated'));
    return cartState.items;
  } catch (err) {
    console.error('Error clearing cart:', err);
    return (await initializeCart(userId)).items;
  }
};

export const checkout = async (userId) => {
  try {
    const cartItems = await getCart(userId);
    if (cartItems.length === 0) {
      throw new Error('Cart is empty');
    }

    const orders = getOrderHistory(userId);
    const newOrder = {
      orderId: `ORD${orders.length + 1}`.padStart(7, '0'),
      date: new Date().toISOString(),
      items: cartItems,
    };
    orders.push(newOrder);
    saveOrderHistory(userId, orders);

    await clearCart(userId);
    window.dispatchEvent(new Event('orderPlaced'));
    return newOrder;
  } catch (err) {
    console.error('Error during checkout:', err);
    throw err;
  }
};

export const getOrderCount = (userId) => {
  return getOrderHistory(userId).length;
};

export const getCartItemCount = async (userId) => {
  const cartItems = await getCart(userId);
  return cartItems.reduce((total, item) => total + item.quantity, 0);
};