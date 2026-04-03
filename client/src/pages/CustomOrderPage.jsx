import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { submitCustomOrder } from "../api/services";
import { useCart } from "../context/CartContext";
import ErrorBanner from "../components/ErrorBanner";
import LoadingSpinner from "../components/LoadingSpinner";

const allowedExtensions = [".stl", ".obj", ".3mf", ".step", ".stp"];

function CustomOrderPage() {
  const { addCustomItem } = useCart();
  const [file, setFile] = useState(null);
  const [fileLink, setFileLink] = useState("");
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
    material: "PLA",
    color: "Matte Black",
    infill: 20,
    layerHeight: 0.2,
    quantity: 1,
    notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onDrop = (acceptedFiles, rejectedFiles) => {
    setError("");
    if (rejectedFiles.length > 0) {
      setError("Only .stl, .obj, .3mf, .step, .stp files are accepted.");
      return;
    }

    setFile(acceptedFiles[0] || null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    maxSize: 20 * 1024 * 1024,
    accept: {
      "application/sla": [".stl"],
      "model/obj": [".obj"],
      "application/octet-stream": [".3mf", ".step", ".stp"],
      "model/step": [".step", ".stp"],
      "application/step": [".step", ".stp"]
    }
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: ["quantity", "infill", "layerHeight"].includes(name)
        ? Number(value)
        : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccess("");
    setError("");

    if (!file && !fileLink.trim()) {
      setError(`Upload a valid model file (${allowedExtensions.join(", ")}) or provide an external file link.`);
      return;
    }

    try {
      setLoading(true);
      const payload = new FormData();
      if (file) {
        payload.append("modelFile", file);
      }
      payload.append("externalFileLink", fileLink.trim());
      payload.append("customerName", form.customerName);
      payload.append("customerEmail", form.customerEmail);
      payload.append("customerPhone", form.customerPhone);
      payload.append("shippingAddress", form.shippingAddress);
      payload.append("material", form.material);
      payload.append("color", form.color);
      payload.append("infill", String(form.infill));
      payload.append("layerHeight", String(form.layerHeight));
      payload.append("quantity", String(form.quantity));
      payload.append("notes", form.notes);

      const response = await submitCustomOrder(payload);
      addCustomItem(response.order);
      setSuccess(`Custom order submitted. ID: ${response.order.id}`);
      setFile(null);
      setFileLink("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit custom order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-6 rounded-[30px] border border-black/6 bg-white p-6 shadow-[0_18px_50px_rgba(31,41,51,0.06)]">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0d7377]">Custom Order</p>
        <h2 className="mt-2 font-heading text-4xl text-[#1f2933]">Custom Print Order</h2>
        <p className="mt-2 text-sm text-[#66727e]">Upload your model and configure print settings in real time.</p>
      </div>

      <ErrorBanner message={error} />
      {success ? (
        <div className="rounded-lg border border-success/40 bg-success/10 px-4 py-3 text-sm text-green-100">{success}</div>
      ) : null}

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div
          {...getRootProps()}
          className={`cursor-pointer rounded-xl border-2 border-dashed p-6 transition ${
            isDragActive
              ? "border-[#0d7377] bg-[#0d7377]/5"
              : "border-[#0d7377]/20 bg-[#fafaf8] hover:border-[#0d7377]/35"
          }`}
        >
          <input {...getInputProps()} />
          <p className="font-heading text-2xl text-[#1f2933]">Drop your 3D file here</p>
          <p className="mt-2 text-sm text-[#66727e]">or click to browse local files</p>
          <p className="mt-5 text-xs uppercase tracking-widest text-[#0d7377]">Accepted: .stl, .obj, .3mf, .step, .stp</p>
          {file ? (
            <p className="mt-5 rounded-md border border-[#0d7377]/15 bg-white px-3 py-2 text-sm text-[#0d7377]">
              Selected: {file.name}
            </p>
          ) : null}

          <div className="mt-4 border-t border-black/6 pt-4 text-left">
            <label className="block text-xs font-semibold text-[#44505d]">
              External File Link (Drive/WhatsApp/Dropbox)
              <input
                type="url"
                value={fileLink}
                onChange={(event) => setFileLink(event.target.value)}
                placeholder="https://..."
                className="mt-2 w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-[#1f2933]"
              />
            </label>
            <p className="mt-2 text-xs text-[#66727e]">Use this when you prefer sharing a link instead of uploading the file here.</p>
          </div>
        </div>

        <div className="space-y-4 rounded-xl border border-black/6 bg-[#fafaf8] p-5">
          <label className="block text-xs font-semibold text-[#44505d]">
            Full Name
            <input
              name="customerName"
              value={form.customerName}
              onChange={handleChange}
              className="mt-2 w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-[#1f2933]"
              required
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs font-semibold text-[#44505d]">
              Email
              <input
                name="customerEmail"
                type="email"
                value={form.customerEmail}
                onChange={handleChange}
                className="mt-2 w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-[#1f2933]"
                required
              />
            </label>
            <label className="text-xs font-semibold text-[#44505d]">
              Phone
              <input
                name="customerPhone"
                value={form.customerPhone}
                onChange={handleChange}
                className="mt-2 w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-[#1f2933]"
                required
              />
            </label>
          </div>

          <label className="block text-xs font-semibold text-[#44505d]">
            Billing / Shipping Address
            <textarea
              name="shippingAddress"
              value={form.shippingAddress}
              onChange={handleChange}
              rows={3}
              className="mt-2 w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-[#1f2933]"
              required
            />
          </label>

          <label className="block text-xs font-semibold text-[#44505d]">
            Material
            <select
              name="material"
              value={form.material}
              onChange={handleChange}
              className="mt-2 w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-[#1f2933]"
            >
              {Object.keys(materialRates).map((material) => (
                <option key={material} value={material}>
                  {material}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-xs font-semibold text-[#44505d]">
            Color
            <input
              name="color"
              value={form.color}
              onChange={handleChange}
              className="mt-2 w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-[#1f2933]"
              required
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs font-semibold text-[#44505d]">
              Infill %
              <input
                name="infill"
                type="number"
                min="5"
                max="100"
                value={form.infill}
                onChange={handleChange}
                className="mt-2 w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-[#1f2933]"
              />
            </label>
            <label className="text-xs font-semibold text-[#44505d]">
              Layer Height
              <input
                name="layerHeight"
                type="number"
                step="0.05"
                min="0.05"
                max="0.5"
                value={form.layerHeight}
                onChange={handleChange}
                className="mt-2 w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-[#1f2933]"
              />
            </label>
          </div>

          <label className="block text-xs font-semibold text-[#44505d]">
            Quantity
            <input
              name="quantity"
              type="number"
              min="1"
              max="100"
              value={form.quantity}
              onChange={handleChange}
              className="mt-2 w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-[#1f2933]"
            />
          </label>

          <label className="block text-xs font-semibold text-[#44505d]">
            Notes
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={4}
              className="mt-2 w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-[#1f2933]"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#0d7377] px-4 py-3 font-semibold text-white transition hover:bg-[#0a5c60] disabled:cursor-not-allowed disabled:opacity-65"
          >
            {loading ? "Submitting..." : "Submit & Email Provider"}
          </button>
          {loading ? <LoadingSpinner label="Uploading model" /> : null}
        </div>
      </form>
    </section>
  );
}

export default CustomOrderPage;
