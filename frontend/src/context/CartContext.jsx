import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const stored = localStorage.getItem('urbanweave_cart');
        return stored ? JSON.parse(stored) : [];
    });
    const [coupon, setCoupon] = useState(null);

    useEffect(() => {
        localStorage.setItem('urbanweave_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity = 1, size = '', color = '') => {
        setCartItems(prev => {
            const existingIndex = prev.findIndex(
                item => item._id === product._id && item.size === size && item.color === color
            );

            if (existingIndex > -1) {
                const updated = [...prev];
                updated[existingIndex].quantity += quantity;
                toast.success('Cart updated');
                return updated;
            }

            toast.success('Added to cart');
            return [...prev, {
                _id: product._id,
                name: product.name,
                price: product.price,
                originalPrice: product.originalPrice,
                image: product.images?.[0] || '',
                quantity,
                size,
                color,
                stock: product.stock
            }];
        });
    };

    const removeFromCart = (id, size, color) => {
        setCartItems(prev => prev.filter(
            item => !(item._id === id && item.size === size && item.color === color)
        ));
        toast.success('Removed from cart');
    };

    const updateQuantity = (id, size, color, quantity) => {
        if (quantity < 1) return;
        setCartItems(prev => prev.map(item => {
            if (item._id === id && item.size === size && item.color === color) {
                return { ...item, quantity: Math.min(quantity, item.stock) };
            }
            return item;
        }));
    };

    const clearCart = () => {
        setCartItems([]);
        setCoupon(null);
    };

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const discount = coupon ? coupon.discount : 0;
    const shipping = subtotal > 999 ? 0 : 99;
    const tax = Math.round((subtotal - discount) * 0.18 * 100) / 100;
    const total = subtotal + shipping + tax - discount;

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            coupon,
            setCoupon,
            subtotal,
            totalItems,
            discount,
            shipping,
            tax,
            total
        }}>
            {children}
        </CartContext.Provider>
    );
};
