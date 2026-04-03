import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

const CART_STORAGE_KEY = "forge_layer_cart";

const safeGetStorageItem = (key) => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeSetStorageItem = (key, value) => {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage failures so the storefront still renders.
  }
};

const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const persisted = safeParse(safeGetStorageItem(CART_STORAGE_KEY));
    return Array.isArray(persisted) ? persisted : [];
  });

  useEffect(() => {
    safeSetStorageItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addPredefinedItem = (product) => {
    setItems((prev) => {
      const existing = prev.find(
        (item) => item.type === "predefined" && item.productId === product.id
      );

      if (existing) {
        return prev.map((item) =>
          item.type === "predefined" && item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...prev,
        {
          id: `cart-${Date.now()}-${product.id}`,
          type: "predefined",
          productId: product.id,
          name: product.name,
          material: product.material,
          price: product.price,
          quantity: 1,
          image: product.image
        }
      ];
    });
  };

  const addCustomItem = (customOrder) => {
    setItems((prev) => [
      ...prev,
      {
        id: `custom-${customOrder.id}`,
        type: "custom",
        orderId: customOrder.id,
        name: customOrder.file?.originalName || "Custom 3D Model",
        material: customOrder.customConfig?.material,
        price: customOrder.estimatedPrice || 0,
        quantity: customOrder.customConfig?.quantity || 1,
        status: customOrder.status,
        filePath: customOrder.file?.path
      }
    ]);
  };

  const updateQuantity = (id, quantity) => {
    const next = Math.max(1, Number(quantity) || 1);
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: next } : item))
    );
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearPredefinedItems = () => {
    setItems((prev) => prev.filter((item) => item.type !== "predefined"));
  };

  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 0),
      0
    );

    return {
      count: items.reduce((acc, item) => acc + Number(item.quantity || 0), 0),
      subtotal: Number(subtotal.toFixed(2))
    };
  }, [items]);

  const value = {
    items,
    totals,
    addPredefinedItem,
    addCustomItem,
    updateQuantity,
    removeItem,
    clearPredefinedItems
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
