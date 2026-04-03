import { Link, useLocation } from "react-router-dom";

function OrderConfirmationPage() {
  const { state } = useLocation();

  return (
    <section className="mx-auto max-w-2xl rounded-[30px] border border-black/6 bg-white p-8 text-center shadow-[0_18px_50px_rgba(31,41,51,0.06)]">
      <h2 className="font-heading text-4xl text-[#0d7377]">Order Confirmed</h2>
      <p className="mt-3 text-[#66727e]">Thank you. Your production pipeline has started.</p>

      <div className="mt-8 space-y-3 rounded-lg border border-black/6 bg-[#fafaf8] p-4 text-left text-sm text-[#44505d]">
        <p>
          Predefined Order ID: <span className="text-[#0d7377]">{state?.predefinedOrderId || "N/A"}</span>
        </p>
        <p>
          Custom Order IDs: <span className="text-[#0d7377]">{state?.customOrderIds?.join(", ") || "N/A"}</span>
        </p>
        <p>
          Estimated Delivery: <span className="text-[#0d7377]">{state?.estimatedDelivery || "3-7 business days"}</span>
        </p>
      </div>

      <div className="mt-8 flex justify-center gap-3">
        <Link
          to="/products"
          className="rounded-full bg-[#0d7377] px-4 py-2 text-sm font-semibold text-white"
        >
          Continue Shopping
        </Link>
        <Link
          to="/admin"
          className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-[#44505d]"
        >
          View Admin
        </Link>
      </div>
    </section>
  );
}

export default OrderConfirmationPage;
