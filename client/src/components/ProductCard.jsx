import { useCart } from '../context/CartContext';

function ProductArt({ name }) {
  if (name.includes("Name Plate")) {
    return (
      <svg viewBox="0 0 300 200" className="h-full w-full" role="img" aria-label="Desk name plate model">
        <rect x="0" y="0" width="300" height="200" fill="transparent" />
        <rect x="44" y="72" width="212" height="72" rx="10" fill="#1f2a31" />
        <rect x="54" y="82" width="192" height="52" rx="8" fill="#2f3d48" />
        <rect x="72" y="98" width="112" height="6" rx="3" fill="#dce9e8" />
        <rect x="72" y="112" width="84" height="5" rx="2.5" fill="#c96a3a" />
      </svg>
    );
  }

  if (name.includes("Planter")) {
    return (
      <svg viewBox="0 0 300 200" className="h-full w-full" role="img" aria-label="Mini planter set model">
        <polygon points="70,120 92,76 116,120" fill="#1a3636" />
        <polygon points="122,128 146,72 174,128" fill="#245252" />
        <polygon points="182,124 206,80 228,124" fill="#1a3636" />
        <path d="M144 70 C144 50 156 40 170 36" stroke="#c96a3a" strokeWidth="4" fill="none" strokeLinecap="round" />
      </svg>
    );
  }

  if (name.includes("Phone Dock")) {
    return (
      <svg viewBox="0 0 300 200" className="h-full w-full" role="img" aria-label="Phone dock model">
        <path d="M74 138 L160 138 L210 98 L124 98 Z" fill="#1a3636" />
        <rect x="168" y="54" width="52" height="86" rx="10" fill="#273640" />
        <rect x="176" y="64" width="36" height="58" rx="6" fill="#e2eceb" />
        <circle cx="194" cy="129" r="3" fill="#c96a3a" />
      </svg>
    );
  }

  if (name.includes("Cable")) {
    return (
      <svg viewBox="0 0 300 200" className="h-full w-full" role="img" aria-label="Cable organizer model">
        <path d="M70 88 C120 58 170 58 220 88 C170 118 120 118 70 88 Z" fill="none" stroke="#1a3636" strokeWidth="8" />
        <rect x="130" y="74" width="40" height="28" rx="10" fill="#2f4d4d" />
        <rect x="146" y="74" width="8" height="28" rx="4" fill="#c96a3a" />
      </svg>
    );
  }

  if (name.includes("Key Holder")) {
    return (
      <svg viewBox="0 0 300 200" className="h-full w-full" role="img" aria-label="Key holder model">
        <rect x="62" y="52" width="176" height="18" rx="8" fill="#1a3636" />
        <rect x="94" y="68" width="6" height="24" rx="3" fill="#1a3636" />
        <rect x="146" y="68" width="6" height="24" rx="3" fill="#1a3636" />
        <rect x="198" y="68" width="6" height="24" rx="3" fill="#1a3636" />
        <circle cx="97" cy="112" r="10" fill="none" stroke="#c96a3a" strokeWidth="4" />
        <rect x="92" y="122" width="10" height="22" rx="3" fill="#2f4d4d" />
        <circle cx="149" cy="112" r="10" fill="none" stroke="#c96a3a" strokeWidth="4" />
        <rect x="144" y="122" width="10" height="22" rx="3" fill="#2f4d4d" />
        <circle cx="201" cy="112" r="10" fill="none" stroke="#c96a3a" strokeWidth="4" />
        <rect x="196" y="122" width="10" height="22" rx="3" fill="#2f4d4d" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 300 200" className="h-full w-full" role="img" aria-label="Display stand model">
      <rect x="56" y="130" width="188" height="20" rx="8" fill="#1a3636" />
      <rect x="80" y="102" width="140" height="16" rx="7" fill="#244a4a" />
      <rect x="102" y="76" width="96" height="14" rx="6" fill="#2f5b5b" />
      <circle cx="198" cy="70" r="6" fill="#c96a3a" />
    </svg>
  );
}

function ProductCard({ product, onAddToCart }) {
  const { items, addPredefinedItem, updateQuantity, removeItem } = useCart();
  
  const description =
    product.description || `A polished ${product.category.toLowerCase()} made for everyday use.`;
  const compareAtPrice = Number(product.compareAtPrice || Math.round(Number(product.price || 0) * 1.25));
  
  // Find if this product is already in cart
  const cartItem = items.find((item) => item.type === "predefined" && item.productId === product.id);
  const quantity = cartItem?.quantity || 0;

  const handleIncrement = () => {
    if (cartItem) {
      updateQuantity(cartItem.id, quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (cartItem) {
      if (quantity > 1) {
        updateQuantity(cartItem.id, quantity - 1);
      } else {
        removeItem(cartItem.id);
      }
    }
  };

  const handleAddToCart = () => {
    addPredefinedItem(product);
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden bg-white transition duration-300 hover:-translate-y-0.5">
      <div className="relative aspect-[4/5] overflow-hidden bg-white">
        <span className="absolute left-3 top-3 z-10 rounded-full bg-[#efe0c3] px-2.5 py-1 text-xs font-medium text-[#111827]">Sale</span>
        <div className="absolute inset-0 flex items-center justify-center p-3 transition duration-500 group-hover:scale-[1.03]">
          {product.image ? (
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <ProductArt name={product.name} />
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col space-y-2.5 px-1 py-3">
        <p className="line-clamp-2 min-h-[2.5rem] text-[13px] leading-5 text-[#374151]">{product.name}</p>
        <p className="text-sm font-medium text-[#111827]">Rs. {Number(product.price).toFixed(2)} <span className="ml-1 text-[#9ca3af] line-through">Rs. {compareAtPrice.toFixed(2)}</span></p>
        <p className="line-clamp-2 min-h-[2.5rem] text-xs text-[#6b7280]">{description}</p>
        
        {cartItem ? (
          <div className="mt-auto flex items-center gap-2 rounded-full border border-black/10 bg-white">
            <button
              type="button"
              onClick={handleDecrement}
              className="flex-1 px-2 py-2.5 text-sm font-medium text-[#111827] transition hover:bg-[#fafafa]"
            >
              −
            </button>
            <span className="flex-1 text-center text-sm font-bold text-[#111827]">{quantity}</span>
            <button
              type="button"
              onClick={handleIncrement}
              className="flex-1 px-2 py-2.5 text-sm font-medium text-[#111827] transition hover:bg-[#fafafa]"
            >
              +
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleAddToCart}
            className="mt-auto w-full rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm font-medium text-[#111827] transition hover:border-black/25 hover:bg-[#fafafa]"
          >
            Add to Cart
          </button>
        )}
      </div>
    </article>
  );
}

export default ProductCard;
