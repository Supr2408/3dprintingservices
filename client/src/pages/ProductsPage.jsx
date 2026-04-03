import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorBanner from "../components/ErrorBanner";
import { getProducts } from "../api/services";
import { useCart } from "../context/CartContext";

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Price, low to high", value: "price-asc" },
  { label: "Price, high to low", value: "price-desc" },
  { label: "Name, A-Z", value: "name-asc" }
];

function ProductsPage() {
  const { addPredefinedItem } = useCart();
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState("featured");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getProducts();
        if (active) {
          setProducts(data);
        }
      } catch (err) {
        if (active) {
          setError(err.response?.data?.message || "Failed to load products.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      active = false;
    };
  }, []);

  const displayedProducts = useMemo(() => {
    const items = [...products];

    if (sortBy === "price-asc") {
      items.sort((left, right) => Number(left.price || 0) - Number(right.price || 0));
    } else if (sortBy === "price-desc") {
      items.sort((left, right) => Number(right.price || 0) - Number(left.price || 0));
    } else if (sortBy === "name-asc") {
      items.sort((left, right) => String(left.name || "").localeCompare(String(right.name || "")));
    }

    return items;
  }, [products, sortBy]);

  return (
    <section className="space-y-6 bg-white py-4 sm:py-6">
      <div className="space-y-4">
        <div className="pt-2">
          <p className="text-[12px] uppercase tracking-[0.28em] text-[#6b7280]">Products</p>
        </div>

        <div className="flex flex-col gap-3 border-b border-black/5 pb-4">
          <div className="flex flex-wrap items-center gap-3 text-sm text-[#4b5563]">
            <span className="inline-flex items-center gap-1.5">Availability <span aria-hidden="true">▾</span></span>
            <span className="inline-flex items-center gap-1.5">Price <span aria-hidden="true">▾</span></span>
          </div>

          <div className="flex items-center justify-between gap-4 text-sm text-[#6b7280]">
            <span>{displayedProducts.length} items</span>
            <div className="flex items-center gap-4">
              <label className="inline-flex items-center gap-2">
                Sort
                <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="bg-transparent text-[#111827] outline-none">
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <span className="text-[#111827]" aria-label="Column grid">⊞</span>
            </div>
          </div>
        </div>
      </div>

      <ErrorBanner message={error} />
      {loading ? (
        <div className="rounded-2xl border border-black/5 bg-[#fafafa] p-6">
          <LoadingSpinner label="Loading products" />
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={addPredefinedItem} />
          ))}
        </div>
      )}
    </section>
  );
}

export default ProductsPage;
