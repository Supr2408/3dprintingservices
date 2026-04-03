import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitPredefinedOrder } from "../api/services";
import { useCart } from "../context/CartContext";
import ErrorBanner from "../components/ErrorBanner";
import LoadingSpinner from "../components/LoadingSpinner";

const AUTH_STORAGE_KEY = "forge_layer_auth_user";

const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const getSavedUser = () => {
  try {
    return safeParse(window.localStorage.getItem(AUTH_STORAGE_KEY));
  } catch {
    return null;
  }
};

const saveUser = (user) => {
  try {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } catch {
    // Ignore storage failures so checkout still works in-memory.
  }
};

function CartCheckoutPage() {
  const navigate = useNavigate();
  const {
    items,
    totals,
    updateQuantity,
    removeItem,
    clearPredefinedItems
  } = useCart();

  const predefinedItems = useMemo(
    () => items.filter((item) => item.type === "predefined"),
    [items]
  );
  const customItems = useMemo(
    () => items.filter((item) => item.type === "custom"),
    [items]
  );

  const [authMode, setAuthMode] = useState("login");
  const [user, setUser] = useState(() => getSavedUser());
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });

  const [checkout, setCheckout] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    landmark: "",
    deliveryNotes: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setCheckout((prev) => ({ ...prev, [name]: value }));
  };

  const handleAuthFieldChange = (event) => {
    const { name, value } = event.target;
    setAuthForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAuthSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!authForm.email || !authForm.password) {
      setError("Enter email and password to continue.");
      return;
    }

    if (authMode === "register") {
      if (!authForm.name || !authForm.phone) {
        setError("Complete name and phone for registration.");
        return;
      }

      const account = {
        name: authForm.name,
        email: authForm.email,
        phone: authForm.phone,
        password: authForm.password
      };
      setUser(account);
      saveUser(account);
      setCheckout((prev) => ({
        ...prev,
        name: account.name,
        email: account.email,
        phone: account.phone
      }));
      return;
    }

    const saved = getSavedUser();
    if (!saved || saved.email !== authForm.email || saved.password !== authForm.password) {
      setError("Invalid credentials. Please register first or try again.");
      return;
    }

    setUser(saved);
    setCheckout((prev) => ({
      ...prev,
      name: saved.name,
      email: saved.email,
      phone: saved.phone
    }));
  };

  const handleLogout = () => {
    setUser(null);
    setAuthForm({ name: "", email: "", phone: "", password: "" });
    setCheckout((prev) => ({
      ...prev,
      name: "",
      email: "",
      phone: ""
    }));
  };

  const handleCheckout = async (event) => {
    event.preventDefault();
    setError("");

    if (!user) {
      setError("Please login before placing the order.");
      return;
    }

    if (!checkout.name || !checkout.email || !checkout.phone || !checkout.addressLine1 || !checkout.city || !checkout.state || !checkout.postalCode) {
      setError("Complete all required contact and address fields.");
      return;
    }

    const shippingAddress = [
      checkout.addressLine1,
      checkout.addressLine2,
      checkout.landmark ? `Landmark: ${checkout.landmark}` : "",
      checkout.deliveryNotes ? `Notes: ${checkout.deliveryNotes}` : "",
      `${checkout.city}, ${checkout.state} ${checkout.postalCode}`
    ]
      .filter(Boolean)
      .join(", ");

    try {
      setLoading(true);

      let predefinedOrderId = null;
      if (predefinedItems.length > 0) {
        const response = await submitPredefinedOrder({
          customer: {
            name: checkout.name,
            email: checkout.email,
            phone: checkout.phone,
            shippingAddress
          },
          items: predefinedItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity
          }))
        });
        predefinedOrderId = response.order.id;
        clearPredefinedItems();
      }

      navigate("/order-confirmation", {
        state: {
          predefinedOrderId,
          customOrderIds: customItems.map((item) => item.orderId),
          estimatedDelivery: "3-7 business days"
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || "Checkout failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-6 rounded-[30px] border border-black/6 bg-white p-6 shadow-[0_18px_50px_rgba(31,41,51,0.06)]">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0d7377]">Cart & Checkout</p>
        <h2 className="mt-2 font-heading text-4xl text-[#1f2933]">Cart & Checkout</h2>
        <p className="mt-2 text-sm text-[#66727e]">Manage quantities, remove items, and place your production order.</p>
      </div>

      <ErrorBanner message={error} />

      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.9fr]">
        <div className="space-y-3">
          {items.length === 0 ? (
            <div className="rounded-xl border border-black/6 bg-[#fafaf8] p-5 text-sm text-[#66727e]">
              Your cart is empty.
            </div>
          ) : (
            items.map((item) => (
              <article
                key={item.id}
                className="rounded-xl border border-black/6 bg-[#fafaf8] p-4"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:gap-4">
                  {/* Product Image */}
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-white">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#e3eceb] text-xs text-[#66727e]">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-heading text-lg text-[#1f2933]">{item.name}</p>
                        <p className="text-xs text-[#66727e]">
                          Type: {item.type} • Material: {item.material}
                        </p>
                      </div>
                      {item.type === "custom" && Number(item.price) === 0 ? (
                        <p className="font-heading text-lg text-[#0d7377]">Quote request</p>
                      ) : (
                        <p className="font-heading text-xl text-[#0d7377]">
                          ₹{Math.round(item.price * item.quantity)}
                        </p>
                      )}
                    </div>

                    {/* Quantity Controls & Remove Button */}
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex items-center gap-1 rounded-full border border-black/10 bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="h-8 w-8 flex-shrink-0 rounded-full text-sm font-medium text-[#1f2933] transition hover:bg-[#f5f0eb]"
                        >
                          −
                        </button>
                        <span className="min-w-8 text-center text-sm font-medium text-[#1f2933]">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8 flex-shrink-0 rounded-full text-sm font-medium text-[#1f2933] transition hover:bg-[#f5f0eb]"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold text-[#44505d] transition hover:bg-[#f5f0eb]"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        <div className="space-y-4 rounded-xl border border-black/6 bg-[#fafaf8] p-5">
          <h3 className="font-heading text-2xl text-[#1f2933]">Order Summary</h3>
          <div className="rounded-lg border border-black/6 bg-white p-3 text-sm">
            <p className="flex justify-between text-[#66727e]">
              <span>Items</span>
              <span>{totals.count}</span>
            </p>
            <p className="mt-2 flex justify-between font-heading text-2xl text-[#0d7377]">
              <span>Total</span>
              <span>₹{Math.round(totals.subtotal)}</span>
            </p>
          </div>

          {!user ? (
            <div className="rounded-lg border border-[#1a3636]/15 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#1a3636]">Login Required</p>
                <div className="flex items-center gap-2 rounded-full border border-black/10 bg-[#f4f6f6] p-1">
                  <button
                    type="button"
                    onClick={() => setAuthMode("login")}
                    className={`rounded-full px-3 py-1 text-xs font-bold transition ${authMode === "login" ? "bg-white text-[#1a3636] shadow-sm" : "text-[#66727e]"}`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode("register")}
                    className={`rounded-full px-3 py-1 text-xs font-bold transition ${authMode === "register" ? "bg-white text-[#1a3636] shadow-sm" : "text-[#66727e]"}`}
                  >
                    Register
                  </button>
                </div>
              </div>

              <form onSubmit={handleAuthSubmit} className="mt-3 space-y-3">
                {authMode === "register" ? (
                  <>
                    <input
                      name="name"
                      placeholder="Full Name"
                      value={authForm.name}
                      onChange={handleAuthFieldChange}
                      className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-[#1f2933]"
                      required
                    />
                    <input
                      name="phone"
                      placeholder="Phone Number"
                      value={authForm.phone}
                      onChange={handleAuthFieldChange}
                      className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-[#1f2933]"
                      required
                    />
                  </>
                ) : null}

                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={authForm.email}
                  onChange={handleAuthFieldChange}
                  className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-[#1f2933]"
                  required
                />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={authForm.password}
                  onChange={handleAuthFieldChange}
                  className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-[#1f2933]"
                  required
                />

                <button
                  type="submit"
                  className="w-full rounded-full bg-[#1a3636] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#142a2a]"
                >
                  {authMode === "login" ? "Login to Continue" : "Create Account"}
                </button>
              </form>
            </div>
          ) : (
            <div className="rounded-lg border border-[#1a3636]/15 bg-white p-4 text-sm text-[#44505d]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-[#1f2933]">Logged in as {user.name}</p>
                  <p>{user.email} • {user.phone}</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold text-[#44505d]"
                >
                  Logout
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleCheckout} className="space-y-3">
            <input
              name="name"
              placeholder="Full Name"
              value={checkout.name}
              onChange={handleFieldChange}
              className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-[#1f2933]"
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={checkout.email}
              onChange={handleFieldChange}
              className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-[#1f2933]"
              required
            />
            <input
              name="phone"
              placeholder="Phone Number"
              value={checkout.phone}
              onChange={handleFieldChange}
              className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-[#1f2933]"
              required
            />
            <input
              name="addressLine1"
              placeholder="Address Line 1"
              value={checkout.addressLine1}
              onChange={handleFieldChange}
              className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-[#1f2933]"
              required
            />
            <input
              name="addressLine2"
              placeholder="Address Line 2 (Optional)"
              value={checkout.addressLine2}
              onChange={handleFieldChange}
              className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-[#1f2933]"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                name="city"
                placeholder="City"
                value={checkout.city}
                onChange={handleFieldChange}
                className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-[#1f2933]"
                required
              />
              <input
                name="state"
                placeholder="State"
                value={checkout.state}
                onChange={handleFieldChange}
                className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-[#1f2933]"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                name="postalCode"
                placeholder="PIN / Postal Code"
                value={checkout.postalCode}
                onChange={handleFieldChange}
                className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-[#1f2933]"
                required
              />
              <input
                name="landmark"
                placeholder="Landmark (Optional)"
                value={checkout.landmark}
                onChange={handleFieldChange}
                className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-[#1f2933]"
              />
            </div>
            <textarea
              name="deliveryNotes"
              placeholder="Delivery notes (Optional)"
              rows={3}
              value={checkout.deliveryNotes}
              onChange={handleFieldChange}
              className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-[#1f2933]"
            />

            <button
              type="submit"
              disabled={loading || items.length === 0 || !user}
              className="w-full rounded-full bg-[#0d7377] px-4 py-3 font-semibold text-white transition hover:bg-[#0a5c60] disabled:cursor-not-allowed disabled:opacity-65"
            >
              {loading ? "Submitting..." : "Submit Order"}
            </button>
            {loading ? <LoadingSpinner label="Placing order" /> : null}
          </form>
          {predefinedItems.length === 0 ? (
            <p className="text-xs text-[#8a94a0]">
              Predefined product checkout triggers backend order creation. Custom orders are already submitted when uploaded.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default CartCheckoutPage;
