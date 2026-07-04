import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth';
import { getCartItems, addToCartDB, updateCartQuantityDB, removeFromCartDB, clearCartDB } from '../services/cartService';
import { toast } from 'sonner';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);



    // Load cart from DB when user logs in, or from local storage for guests
    useEffect(() => {
        const loadCart = async () => {
            if (user) {
                setIsLoading(true);
                // Merge any leftover guest cart
                const localCartJson = localStorage.getItem('cart');
                if (localCartJson) {
                    try {
                        const localCart = JSON.parse(localCartJson) || [];
                        if (localCart.length > 0) {
                            for (const item of localCart) {
                                await addToCartDB(user.id, item.id, item.variant_id, item.size, item.quantity, item.custom_measurements, item.notes);
                            }
                        }
                    } catch (e) {
                        console.error('Error merging local cart:', e);
                    }
                    localStorage.removeItem('cart');
                }

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
                try {
                    const localCart = JSON.parse(localStorage.getItem('cart')) || [];
                    setCart(localCart);
                } catch (e) {
                    setCart([]);
                }
                setIsLoading(false);
            }
        };

        loadCart();
    }, [user?.id]);

    const addToCart = React.useCallback(async (product, size, variantId, openDrawer = true, customMeasurements = null, notes = null) => {
        const finalNotes = notes || customMeasurements?.notes || null;

        if (user) {
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
            }
        } else {
            // Guest user: Add to local storage
            const cartItemId = 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            const variant = product.product_variants?.find(v => v.id === variantId) || product.variants?.find(v => v.id === variantId);
            
            const newItem = {
                ...product,
                cartItemId,
                variant_id: variantId,
                variant,
                size,
                quantity: 1,
                custom_measurements: customMeasurements,
                notes: finalNotes
            };

            setCart(prev => {
                // Check if identical item already exists (same product, variant, size, measurements)
                const existingItemIndex = prev.findIndex(item => 
                    item.id === product.id && 
                    item.variant_id === variantId && 
                    item.size === size &&
                    JSON.stringify(item.custom_measurements) === JSON.stringify(customMeasurements)
                );

                let newCart;
                if (existingItemIndex >= 0) {
                    newCart = [...prev];
                    newCart[existingItemIndex].quantity += 1;
                } else {
                    newCart = [...prev, newItem];
                }
                
                localStorage.setItem('cart', JSON.stringify(newCart));
                return newCart;
            });
            
            toast.success(`${product.name} added to bag`);
        }
    }, [user, navigate, location]);

    const removeFromCart = React.useCallback(async (uniqueId) => {
        if (user) {
            const itemToRemove = cart.find(item => item.cartItemId === uniqueId);
            if (itemToRemove?.cartItemId) {
                const success = await removeFromCartDB(itemToRemove.cartItemId);
                if (success) {
                    setCart((prev) => prev.filter((item) => item.cartItemId !== uniqueId));
                    toast.success('Item removed from bag');
                }
            }
        } else {
            setCart(prev => {
                const newCart = prev.filter(item => item.cartItemId !== uniqueId);
                localStorage.setItem('cart', JSON.stringify(newCart));
                return newCart;
            });
            toast.success('Item removed from bag');
        }
    }, [user, cart]);

    const updateQuantity = React.useCallback(async (uniqueId, delta) => {
        const itemToUpdate = cart.find((item) => item.cartItemId === uniqueId);
        if (!itemToUpdate) return;

        const newQuantity = itemToUpdate.quantity + delta;

        if (newQuantity <= 0) {
            await removeFromCart(uniqueId);
            return;
        }

        if (user) {
            const updated = await updateCartQuantityDB(itemToUpdate.cartItemId, newQuantity);
            if (updated) {
                setCart((prev) =>
                    prev.map((item) =>
                        item.cartItemId === uniqueId ? { ...item, quantity: newQuantity } : item
                    )
                );
            }
        } else {
            setCart(prev => {
                const newCart = prev.map((item) =>
                    item.cartItemId === uniqueId ? { ...item, quantity: newQuantity } : item
                );
                localStorage.setItem('cart', JSON.stringify(newCart));
                return newCart;
            });
        }
    }, [user, cart, removeFromCart]);

    const clearCart = React.useCallback(async () => {
        if (user) {
            await clearCartDB(user.id);
        } else {
            localStorage.removeItem('cart');
        }
        setCart([]);
    }, [user]);

    const cartTotal = React.useMemo(() =>
        cart.reduce((total, item) => total + item.price * item.quantity, 0),
        [cart]);

    const value = React.useMemo(() => ({
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        isLoading,
    }), [cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, isCartOpen, isLoading]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
