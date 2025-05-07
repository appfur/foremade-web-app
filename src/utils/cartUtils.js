import { db } from '/src/firebase';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

export const addToCart = async (userId, productId, quantity) => {
  if (!userId || !productId || quantity <= 0) {
    throw new Error('Invalid cart item data');
  }

  // Validate product exists
  const productRef = doc(db, 'products', productId);
  const productSnap = await getDoc(productRef);
  if (!productSnap.exists()) {
    throw new Error('Product not found');
  }
  const productData = productSnap.data();
  if (productData.stock < quantity) {
    throw new Error(`Only ${productData.stock} units available`);
  }

  const cart = await getCart(userId);
  const existingItem = cart.find((item) => item.productId === productId);
  let updatedCart;

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    if (newQuantity > productData.stock) {
      throw new Error(`Cannot add more than ${productData.stock} units`);
    }
    updatedCart = cart.map((item) =>
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    );
  } else {
    updatedCart = [
      ...cart,
      {
        productId,
        quantity,
        product: {
          name: productData.name,
          price: productData.price,
          image: productData.imageUrl,
          stock: productData.stock,
        },
      },
    ];
  }

  await updateCart(userId, updatedCart);
  window.dispatchEvent(new Event('cartUpdated'));
};

export const getCart = async (userId) => {
  if (!userId) return [];
  const cartKey = `userCart_${userId}`;
  let cart = [];

  try {
    const storedCart = localStorage.getItem(cartKey);
    if (storedCart) {
      cart = JSON.parse(storedCart);
      if (!Array.isArray(cart)) {
        cart = [];
      }
    }

    // Validate and clean cart
    const validCart = [];
    for (const item of cart) {
      if (!item.productId || item.quantity <= 0) {
        console.warn('Invalid cart item:', item);
        continue;
      }
      const productRef = doc(db, 'products', item.productId);
      const productSnap = await getDoc(productRef);
      if (productSnap.exists()) {
        const productData = productSnap.data();
        validCart.push({
          ...item,
          product: {
            name: productData.name,
            price: productData.price,
            image: productData.imageUrl,
            stock: productData.stock,
          },
        });
      } else {
        console.warn(`Product not found for ID: ${item.productId}`);
        toast.error(`Removed unavailable product (ID: ${item.productId}) from cart`);
      }
    }

    if (validCart.length < cart.length) {
      await updateCart(userId, validCart);
    }

    return validCart;
  } catch (err) {
    console.error('Error fetching cart:', err);
    return [];
  }
};

export const updateCart = async (userId, cartItems) => {
  if (!userId) return;
  const cartKey = `userCart_${userId}`;
  try {
    localStorage.setItem(cartKey, JSON.stringify(cartItems));
    window.dispatchEvent(new Event('cartUpdated'));
  } catch (err) {
    console.error('Error updating cart:', err);
    throw err;
  }
};

export const clearCart = async (userId) => {
  await updateCart(userId, []);
};

export const checkout = async (userId) => {
  if (!userId) throw new Error('User not authenticated');
  const cart = await getCart(userId);
  if (cart.length === 0) throw new Error('Cart is empty');

  try {
    for (const item of cart) {
      const productRef = doc(db, 'products', item.productId);
      const productSnap = await getDoc(productRef);
      if (!productSnap.exists()) {
        throw new Error(`Product ${item.productId} no longer available`);
      }
      const productData = productSnap.data();
      if (productData.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${productData.name}`);
      }
    }

    const orderRef = collection(db, 'orders');
    await addDoc(orderRef, {
      userId,
      items: cart,
      total: cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
      createdAt: new Date().toISOString(),
      status: 'pending',
    });

    await clearCart(userId);
  } catch (err) {
    console.error('Checkout error:', err);
    throw err;
  }
};