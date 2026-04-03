import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { submitCustomOrder } from "../api/services";

const materialOptions = ["PLA", "ABS", "PETG", "Resin"];
const infillOptions = [10, 15, 20, 25, 30, 40];

const materialBaseRates = {
  PLA: 5.5,
  ABS: 6.5,
  PETG: 7.2,
  Resin: 9.5
};

const sanitizePhoneNumber = (value) => String(value || "").replace(/\D/g, "");

const featuredProducts = [
  {
    id: 1,
    name: "Baby Chick Clicker Toy – Cute 3D Printed Fidget Chick Kids & Stress Relief",
    description: "Playful desk toy with a charming printed finish.",
    material: "PLA",
    category: "Miniatures",
    price: 349,
    compareAtPrice: 499,
    image: "https://cdn.shopify.com/s/files/1/0773/3284/0597/files/WhatsAppImage2026-03-07at22.31.43.jpg?v=1773152752"
  },
  {
    id: 2,
    name: "Cute Flexi Axolotl Keychain – 3D Printed Flexible Axolotl Key Ring for Keys, Bags & Backpack Charm",
    description: "Flexible keychain styled for everyday carry.",
    material: "PLA",
    category: "Miniatures",
    price: 149,
    compareAtPrice: 199,
    image: "https://cdn.shopify.com/s/files/1/0773/3284/0597/files/WhatsAppImage2026-02-06at2.32.10PM.jpg?v=1773150929"
  },
  {
    id: 3,
    name: "Doctor Coat Pen Holder 3d printed",
    description: "Desk organizer with a clean, character-led silhouette.",
    material: "PETG",
    category: "Mechanical Parts",
    price: 499,
    compareAtPrice: 999,
    image: "https://cdn.shopify.com/s/files/1/0773/3284/0597/files/WhatsAppImage2026-03-31at11.17.44.jpg?v=1774974738"
  },
  {
    id: 4,
    name: "Pipp & Tot Fun Table Decks – Perfect for Office Desk & Kids Study Table",
    description: "A bright desk accessory for shelves and work tables.",
    material: "PLA",
    category: "Decor",
    price: 299,
    compareAtPrice: 399,
    image: "https://cdn.shopify.com/s/files/1/0773/3284/0597/files/WhatsAppImage2026-02-10at11.03.50AM_2.jpg?v=1773321652"
  }
];

function HeroVisual({ onShopNow }) {
  return (
    <div className="border border-black/5 bg-white">
      <div className="grid min-h-[320px] lg:grid-cols-2">
        <div className="flex items-center justify-center px-6 py-14 sm:px-10 sm:py-16">
          <div className="max-w-md text-center">
            <p className="text-sm uppercase tracking-[0.28em] text-[#6b7280]">3D Print Collection</p>
            <h1 className="mt-6 font-heading text-4xl leading-tight tracking-[-0.04em] text-[#111827] sm:text-5xl lg:text-6xl">
              Welcome To My 3D SST Store Website
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 font-medium text-[#374151] sm:text-base">
              Welcome to SST 3D Print – where creativity meets technology.
              <br />
              Our collection features fun toys, cute keychains, and unique 3D printed designs made with precision and care.
              <br />
              Perfect for kids, collectors, and gift lovers.
            </p>
            <button
              onClick={onShopNow}
              className="mt-8 inline-flex rounded-full bg-[#8b5e3c] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#74492d]"
            >
              Shop now
            </button>
          </div>
        </div>

        <div className="relative min-h-[320px] bg-white lg:min-h-[420px]">
          <img
            src="https://shree-sindhvai-tech.myshopify.com/cdn/shop/files/WhatsApp_Image_2026-03-12_at_20.36.46.jpg?v=1773328083&width=1600"
            alt="Shree Sindhvai Tech storefront collage"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

function LiveProgressTracker({ selectedFile, requestSaved }) {
  const steps = useMemo(
    () => [
      { label: "Model uploaded", active: Boolean(selectedFile) },
      { label: "Specs selected", active: Boolean(selectedFile) },
      { label: "Engineering review", active: Boolean(selectedFile) },
      { label: "WhatsApp handoff", active: requestSaved }
    ],
    [selectedFile, requestSaved]
  );

  const completed = steps.filter((step) => step.active).length;
  const width = `${(completed / steps.length) * 100}%`;

  return (
    <div className="mt-5 rounded-2xl border border-black/10 bg-white/70 p-4 backdrop-blur-md">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#1a3636]">Live Progress</p>
        <span className="text-xs font-semibold text-[#66727e]">{completed}/{steps.length}</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e3eceb]">
        <div className="h-full rounded-full bg-[#1a3636] transition-all duration-500" style={{ width }} />
      </div>
      <ul className="mt-4 space-y-2">
        {steps.map((step) => (
          <li key={step.label} className="flex items-center gap-2 text-sm text-[#555550]">
            <span
              className={`h-2.5 w-2.5 rounded-full ${step.active ? "bg-[#1a3636]" : "bg-[#d4d8d5]"}`}
              aria-hidden="true"
            />
            {step.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

function HomePage() {
  const navigate = useNavigate();
  const { addPredefinedItem } = useCart();
  const [selectedMaterial, setSelectedMaterial] = useState("PLA");
  const [quantity, setQuantity] = useState(1);
  const [selectedInfill, setSelectedInfill] = useState(20);
  const [selectedFile, setSelectedFile] = useState(null);
  const [externalFileLink, setExternalFileLink] = useState("");
  const [quoteError, setQuoteError] = useState("");
  const [quoteInfo, setQuoteInfo] = useState("");
  const [isSubmittingHybrid, setIsSubmittingHybrid] = useState(false);
  const [mode, setMode] = useState("regular");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [requestSaved, setRequestSaved] = useState(false);

  const whatsappNumber = sanitizePhoneNumber(import.meta.env.VITE_WHATSAPP_NUMBER);

  const estimateDetails = useMemo(() => {
    if (!selectedFile) {
      return null;
    }

    const effectiveInfill = mode === "pro" ? selectedInfill : 20;
    const fileSizeMb = selectedFile.size / (1024 * 1024);

    // Base shell scales with file size; infill adds interior material weight.
    const shellWeight = Math.max(12, Math.round(fileSizeMb * 18 + 20));
    const infillWeight = Math.round(shellWeight * (effectiveInfill / 100) * 0.6);
    const estimatedWeight = shellWeight + infillWeight;

    const baseRate = materialBaseRates[selectedMaterial] || materialBaseRates.PLA;
    const perUnit = Math.round(estimatedWeight * baseRate);
    const total = perUnit * quantity;

    return {
      estimatedWeight,
      shellWeight,
      infillWeight,
      effectiveInfill,
      perUnit,
      total
    };
  }, [selectedFile, selectedMaterial, selectedInfill, quantity, mode]);

  const openWhatsappQuote = ({ orderId = "", requireFileLink = false } = {}) => {
    setQuoteError("");
    setQuoteInfo("");

    if (!selectedFile) {
      setQuoteError("Upload your model first, then continue to WhatsApp.");
      return;
    }

    if (requireFileLink && !externalFileLink.trim()) {
      setQuoteError("Add a shareable model link for WhatsApp (Drive/Dropbox/OneDrive). WhatsApp link opens cannot attach local files automatically.");
      return;
    }

    const message = [
      "Hi ForgeLayer, I need a quote for my uploaded 3D model.",
      orderId ? `Reference Order ID: ${orderId}` : "",
      `File: ${selectedFile.name}`,
      externalFileLink.trim() ? `File Link: ${externalFileLink.trim()}` : "File was shared via website upload.",
      `Material: ${selectedMaterial}`,
      `Quantity: ${quantity}`,
      mode === "pro" ? `Infill: ${selectedInfill}%` : "Mode: Regular",
      estimateDetails ? `Estimated total shown on site: INR ${estimateDetails.total}` : ""
    ]
      .filter(Boolean)
      .join("\n");

    const encoded = encodeURIComponent(message);
    const url = whatsappNumber
      ? `https://wa.me/${whatsappNumber}?text=${encoded}`
      : `https://api.whatsapp.com/send?text=${encoded}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleHybridWhatsappEmail = async () => {
    setQuoteError("");
    setQuoteInfo("");

    if (!selectedFile) {
      setQuoteError("Upload your file first. We attach this file in provider email and then open WhatsApp.");
      return;
    }

    try {
      setIsSubmittingHybrid(true);

      const payload = new FormData();
      payload.append("modelFile", selectedFile);
      payload.append("externalFileLink", externalFileLink.trim());
      payload.append("customerName", "Website Quote Request");
      payload.append("customerEmail", "");
      payload.append("customerPhone", "");
      payload.append("shippingAddress", "");
      payload.append("material", selectedMaterial);
      payload.append("color", "Default");
      payload.append("infill", String(mode === "pro" ? selectedInfill : 20));
      payload.append("layerHeight", "0.2");
      payload.append("quantity", String(quantity));
      payload.append("notes", "Regular mode request from homepage. Follow up via WhatsApp.");
      payload.append("estimatedPrice", String(estimateDetails?.total || 0));

      const response = await submitCustomOrder(payload);
      const orderId = response?.order?.id || "";
      const providerStatus = response?.providerEmailStatus;

      if (providerStatus?.sent) {
        setQuoteInfo("Details sent to provider email successfully. Opening WhatsApp now.");
      } else {
        setQuoteError(`Order created, but provider email was not sent: ${providerStatus?.reason || "Unknown reason"}. WhatsApp will still open.`);
      }

      setRequestSaved(true);
      openWhatsappQuote({ orderId, requireFileLink: false });
    } catch (error) {
      setQuoteError(error?.response?.data?.message || "Could not send request by email. Please try again.");
    } finally {
      setIsSubmittingHybrid(false);
    }
  };

  const handleShopNow = () => {
    navigate("/products");
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    if (file) {
      setIsUploadModalOpen(false);
      setRequestSaved(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragActive(false);
    const file = event.dataTransfer.files?.[0] || null;
    setSelectedFile(file);
    if (file) {
      setIsUploadModalOpen(false);
      setRequestSaved(false);
    }
  };

  return (
    <div className="space-y-10 bg-white">
      <section className="overflow-hidden border border-black/5 bg-white">
        <HeroVisual onShopNow={handleShopNow} />
      </section>

      <section id="products" className="scroll-mt-24 space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[12px] uppercase tracking-[0.28em] text-[#6b7280]">Products</p>
            <h2 className="mt-2 font-heading text-3xl text-[#111827] sm:text-4xl">Browse the catalog first</h2>
          </div>
          <p className="max-w-xl text-sm text-[#6b7280]">Popular items for gifts, desk setups, home use, and small business needs.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={addPredefinedItem} />
          ))}
        </div>
      </section>

      <section className="overflow-hidden border border-black/5 bg-white">
        <div className="grid lg:grid-cols-2">
          <div className="flex min-h-[360px] items-center justify-center bg-[#8b5e3c] px-6 py-14 text-white lg:min-h-[420px]">
            <div className="max-w-sm text-center">
              <p className="text-sm uppercase tracking-[0.22em] text-white/70">Crafted in 3D</p>
              <h2 className="mt-4 font-heading text-4xl tracking-[-0.03em]">Explore unique designs that merge artistry and technology.</h2>
              <p className="mt-4 text-sm leading-7 text-white/80">Inviting you into a world of playful innovation.</p>
              <button
                type="button"
                onClick={handleShopNow}
                className="mt-6 inline-flex rounded-full bg-[#f2d5b0] px-6 py-3 text-sm font-medium text-[#111827] transition hover:bg-[#efd0a1]"
              >
                Shop now
              </button>
            </div>
          </div>
          <div className="relative min-h-[360px] bg-[#f7f4ef] lg:min-h-[420px]">
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="w-full max-w-[340px] rounded-[26px] border border-black/5 bg-white p-4 shadow-[0_18px_40px_rgba(17,24,39,0.08)]">
                <div className="aspect-[4/3] rounded-[18px] bg-[#faf7f2] p-4 text-center text-sm text-[#111827]">
                  Every piece tells a story, inviting you to engage with the extraordinary in the mundane.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="custom-order" className="scroll-mt-24 overflow-hidden border border-black/5 bg-white">
        <div className="grid gap-6 p-6 lg:grid-cols-[1fr_0.95fr] lg:p-8">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-[#6b7280]">Custom Order</p>
            <h2 className="mt-3 font-heading text-4xl tracking-[-0.03em] text-[#111827]">Have your own design?</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#4b5563]">
              Upload your STL, OBJ, 3MF, STEP, or STP file and we&apos;ll review the request with a proper quote.
            </p>

            <div
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleDrop}
              className="mt-6 rounded-[22px] border border-dashed border-black/15 bg-[#fafafa] p-5 text-center"
            >
              <p className="text-sm font-medium text-[#111827]">Drop your model here or open the upload window</p>
              <p className="mt-1 text-xs text-[#6b7280]">Accepted file types: STL, OBJ, 3MF, STEP, STP</p>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(true)}
                className="mt-4 inline-flex rounded-full border border-black/10 px-4 py-2 text-sm text-[#111827] transition hover:bg-white"
              >
                Upload file
              </button>
              <p className="mt-3 text-sm text-[#111827]">{selectedFile ? selectedFile.name : "No file selected yet"}</p>
            </div>
          </div>

          <div className="border border-black/5 bg-[#fafafa] p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm uppercase tracking-[0.22em] text-[#6b7280]">Order Mode</p>
              <div className="flex items-center gap-2 rounded-full border border-black/10 bg-white p-1">
                <button
                  type="button"
                  onClick={() => setMode("regular")}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${mode === "regular" ? "bg-[#111827] text-white" : "text-[#4b5563]"}`}
                >
                  Regular
                </button>
                <button
                  type="button"
                  onClick={() => setMode("pro")}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${mode === "pro" ? "bg-[#111827] text-white" : "text-[#4b5563]"}`}
                >
                  Pro
                </button>
              </div>
            </div>

            <div className="text-sm uppercase tracking-[0.22em] text-[#6b7280]">Material</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {materialOptions.map((material) => (
                <button
                  key={material}
                  type="button"
                  onClick={() => setSelectedMaterial(material)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    selectedMaterial === material
                      ? "border-[#111827] bg-[#111827] text-white"
                      : "border-black/10 bg-white text-[#4b5563] hover:border-black/20"
                  }`}
                >
                  {material}
                </button>
              ))}
            </div>

            {mode === "pro" ? (
              <div className="mt-5">
                <div className="text-sm uppercase tracking-[0.22em] text-[#6b7280]">Infill</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {infillOptions.map((infill) => (
                    <button
                      key={infill}
                      type="button"
                      onClick={() => setSelectedInfill(infill)}
                      className={`rounded-full border px-3 py-1.5 text-xs transition ${
                        selectedInfill === infill
                          ? "border-[#111827] bg-[#111827] text-white"
                          : "border-black/10 bg-white text-[#4b5563] hover:border-black/20"
                      }`}
                    >
                      {infill}%
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-5 flex items-center justify-between gap-4">
              <div>
                <div className="text-sm uppercase tracking-[0.22em] text-[#6b7280]">Quantity</div>
                <p className="mt-1 text-sm text-[#4b5563]">Choose how many pieces you need.</p>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-black/10 bg-white p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  className="h-10 w-10 rounded-full bg-[#fafafa] text-lg font-medium text-[#111827]"
                >
                  −
                </button>
                <span className="min-w-8 text-center text-sm font-medium text-[#111827]">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((value) => value + 1)}
                  className="h-10 w-10 rounded-full bg-[#fafafa] text-lg font-medium text-[#111827]"
                >
                  +
                </button>
              </div>
            </div>

            {estimateDetails ? (
              <div className="mt-5 border border-black/5 bg-white p-4">
                <div className="text-sm uppercase tracking-[0.22em] text-[#6b7280]">Estimated Value</div>
                <div className="mt-3 space-y-1.5 text-sm text-[#4b5563]">
                  <div className="flex items-center justify-between">
                    <span>Model weight (approx)</span>
                    <span className="font-medium text-[#111827]">{estimateDetails.estimatedWeight} g</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Infill used</span>
                    <span className="font-medium text-[#111827]">{estimateDetails.effectiveInfill}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Per piece</span>
                    <span className="font-medium text-[#111827]">INR {estimateDetails.perUnit}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Quantity</span>
                    <span className="font-medium text-[#111827]">x{quantity}</span>
                  </div>
                </div>
                <div className="mt-3 border-t border-black/5 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#111827]">Estimated total</span>
                    <span className="font-heading text-2xl text-[#111827]">INR {estimateDetails.total}</span>
                  </div>
                  <p className="mt-1 text-xs text-[#6b7280]">Final value may vary after engineering review.</p>
                </div>
              </div>
            ) : null}

            <button
              type="button"
              onClick={handleHybridWhatsappEmail}
              disabled={!selectedFile || isSubmittingHybrid}
              className="mt-4 w-full rounded-full bg-[#111827] px-5 py-3 text-sm font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmittingHybrid ? "Sending Email + Opening WhatsApp..." : "Ask on WhatsApp + Email"}
            </button>

            <p className="mt-2 text-xs text-[#6b7280]">
              {mode === "pro"
                ? "Pro mode sends provider email with full technical details, then opens WhatsApp for faster confirmation."
                : "Regular mode sends provider email with your uploaded file, then opens WhatsApp for quick discussion."}
            </p>

            {quoteError ? <p className="mt-2 border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{quoteError}</p> : null}
            {quoteInfo ? <p className="mt-2 border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">{quoteInfo}</p> : null}

            <LiveProgressTracker selectedFile={selectedFile} requestSaved={requestSaved} />
          </div>
        </div>
      </section>

      <section id="process" className="scroll-mt-24 space-y-4">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-[#6b7280]">Process</p>
          <h2 className="mt-2 font-heading text-3xl text-[#111827] sm:text-4xl">Simple ordering in three steps</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: "🛒", title: "Choose or Upload", text: "Pick a product from the catalog or upload your own design." },
            { icon: "⚙️", title: "We Print It", text: "We make it with the material and finish that fits best." },
            { icon: "📦", title: "Delivered to You", text: "We pack it carefully and ship it to your doorstep with tracking." }
          ].map((step) => (
            <div key={step.title} className="border border-black/5 bg-[#fafafa] p-6">
              <div className="text-3xl">{step.icon}</div>
              <h3 className="mt-4 font-heading text-2xl text-[#111827]">{step.title}</h3>
              <p className="mt-2 text-sm leading-7 text-[#4b5563]">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {[
          { icon: "★", value: "Catalog", label: "First" },
          { icon: "◌", value: "Custom", label: "Uploads" },
          { icon: "⏱", value: "Quote", label: "On Request" },
          { icon: "♥", value: "Chat", label: "Support" }
        ].map((item) => (
          <div key={item.label} className="border border-black/5 bg-white p-5">
            <div className="text-xl text-[#111827]">{item.icon}</div>
            <div className="mt-3 font-heading text-3xl text-[#111827]">{item.value}</div>
            <div className="mt-1 text-sm text-[#6b7280]">{item.label}</div>
          </div>
        ))}
      </section>

      <footer id="contact" className="border-t border-black/5 bg-white px-0 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="font-heading text-2xl text-[#111827]">Shree Sindhvai Tech</div>
            <p className="mt-2 max-w-md text-sm text-[#6b7280]">Premium 3D printed products and custom creations for homes, gifts, and small businesses.</p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-[#4b5563]">
            <a href="#products">Products</a>
            <a href="#custom-order">Custom Order</a>
            <a href="#process">Process</a>
            <a href="/admin">Admin</a>
          </div>
        </div>
        <div className="mt-6 border-t border-black/5 pt-4 text-sm text-[#9ca3af]">© {new Date().getFullYear()} Shree Sindhvai Tech. All rights reserved.</div>
      </footer>

      {isUploadModalOpen ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl border border-black/10 bg-white p-5 shadow-[0_24px_70px_rgba(16,24,24,0.18)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6b7280]">Upload Studio</p>
                <h3 className="mt-1 font-heading text-3xl text-[#111827]">Analyze your model</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setIsDragActive(false);
                }}
                className="rounded-full border border-black/10 px-3 py-1 text-sm font-medium text-[#111827]"
              >
                Close
              </button>
            </div>

            <div
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragActive(true);
              }}
              onDragLeave={() => setIsDragActive(false)}
              onDrop={handleDrop}
              className={`mt-5 border-2 border-dashed p-8 text-center transition ${
                isDragActive ? "border-[#111827] bg-[#fafafa]" : "border-black/15 bg-white"
              }`}
            >
              <p className="text-lg font-medium text-[#111827]">Drop STL / OBJ / 3MF / STEP / STP here</p>
              <p className="mt-2 text-sm text-[#6b7280]">We begin analysis immediately after upload.</p>

              <label className="mt-4 inline-flex cursor-pointer items-center justify-center rounded-full bg-[#111827] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-black">
                Choose file
                <input type="file" accept=".stl,.obj,.3mf,.step,.stp" className="hidden" onChange={handleFileChange} />
              </label>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default HomePage;
