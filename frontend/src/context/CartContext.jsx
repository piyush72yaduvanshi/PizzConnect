import { createContext, useContext, useState, useCallback } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null); // { products: [], totalCount, totalPrice }
  const [cartLoading, setCartLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) return;
    try {
      setCartLoading(true);
      const res = await cartAPI.getCart(user.id);
      setCart(res.data.cart);
    } catch {
      setCart(null);
    } finally { setCartLoading(false); }
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) { toast.error('Please login to add items'); return; }
    try {
      const res = await cartAPI.addToCart({ userId: user.id, productId, quantity });
      setCart(res.data.cart);
      toast.success('Added to cart! 🛒');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const updateItem = async (productId, quantity) => {
    if (!user) return;
    try {
      const res = await cartAPI.updateItem({ userId: user.id, productId, quantity });
      setCart(res.data.cart);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update item');
    }
  };

  const removeItem = async (productId) => {
    if (!user) return;
    try {
      const res = await cartAPI.removeItem({ userId: user.id, productId });
      setCart(res.data.cart);
      toast.success('Item removed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clearCart();
      setCart(null);
    } catch {}
  };

  const cartCount = cart?.totalCount || 0;
  const cartTotal = cart?.totalPrice || 0;

  return (
    <CartContext.Provider value={{
      cart, cartLoading, cartCount, cartTotal,
      fetchCart, addToCart, updateItem, removeItem, clearCart, setCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
