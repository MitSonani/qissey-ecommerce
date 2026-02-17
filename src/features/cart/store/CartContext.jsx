import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth';
import { getCartItems, addToCartDB, updateCartQuantityDB, removeFromCartDB, clearCartDB } from '../services/cartService';
import { toast } from 'sonner';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Load cart from DB when user logs in
    useEffect(() => {
        const loadCart = async () => {
            if (user) {
                setIsLoading(true);
                // Remove any leftover guest cart
                localStorage.removeItem('cart');

                const dbItems = await getCartItems(user.id);
                setCart(dbItems.map(item => ({
                    ...item.product,
                    cartItemId: item.id,
                    variant_id: item.variant_id,
                    variant: item.variant,
                    size: item.size,
                    quantity: item.quantity,
                    custom_measurements: item.custom_measurements,
                    notes: item.notes
                })));
                setIsLoading(false);
            } else {
                setCart([]);
                setIsLoading(false);
            }
        };

        loadCart();
    }, [user?.id]);

    const addToCart = async (product, size, variantId, openDrawer = true, customMeasurements = null, notes = null) => {
        if (!user) {
            toast.error('Please login to add items to bag');
            navigate('/auth');
            return;
        }

        const finalNotes = notes || customMeasurements?.notes || null;

        const newItem = await addToCartDB(user.id, product.id, variantId, size, 1, customMeasurements, finalNotes);
        if (newItem) {
            const dbItems = await getCartItems(user.id);
            setCart(dbItems.map(item => ({
                ...item.product,
                cartItemId: item.id,
                variant_id: item.variant_id,
                variant: item.variant,
                size: item.size,
                quantity: item.quantity,
                custom_measurements: item.custom_measurements,
                notes: item.notes
            })));
            toast.success(`${product.name} added to bag`);

            if (openDrawer) {
                setIsCartOpen(true);
            }
        }
    };

    const removeFromCart = async (uniqueId) => {
        if (!user) return;

        const itemToRemove = cart.find(item => item.cartItemId === uniqueId);
        if (itemToRemove?.cartItemId) {
            const success = await removeFromCartDB(itemToRemove.cartItemId);
            if (success) {
                setCart((prev) => prev.filter((item) => item.cartItemId !== uniqueId));
                toast.success('Item removed from bag');
            }
        }
    };

    const updateQuantity = async (uniqueId, delta) => {
        if (!user) return;

        const itemToUpdate = cart.find((item) => item.cartItemId === uniqueId);
        if (!itemToUpdate) return;

        const newQuantity = itemToUpdate.quantity + delta;

        if (newQuantity <= 0) {
            await removeFromCart(uniqueId);
            return;
        }

        const updated = await updateCartQuantityDB(itemToUpdate.cartItemId, newQuantity);
        if (updated) {
            setCart((prev) =>
                prev.map((item) =>
                    item.cartItemId === uniqueId ? { ...item, quantity: newQuantity } : item
                )
            );
        }
    };

    const clearCart = async () => {
        if (user) {
            await clearCartDB(user.id);
            setCart([]);
        }
    };

    const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartTotal,
                isCartOpen,
                setIsCartOpen,
                isLoading,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
