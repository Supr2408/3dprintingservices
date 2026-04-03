import { useMemo, useState } from "react";

const quickPrompts = [
  "I need a custom print quote.",
  "I want to upload my 3D model.",
  "Help me choose the right material.",
  "I want to check an order update."
];

const sanitizePhoneNumber = (value) => String(value || "").replace(/\D/g, "");

function EnquiryWidget() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const whatsappNumber = sanitizePhoneNumber(import.meta.env.VITE_WHATSAPP_NUMBER);

  const whatsappUrl = useMemo(() => {
    const fullMessage = [
      name ? `Hi, I am ${name}.` : "Hi,",
      message.trim() || "I have an enquiry about 3D printing."
    ].join(" ");

    const encodedMessage = encodeURIComponent(fullMessage);
    if (whatsappNumber) {
      return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    }

    return `https://api.whatsapp.com/send?text=${encodedMessage}`;
  }, [message, name, whatsappNumber]);

  const handleSubmit = (event) => {
    event.preventDefault();
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      {open ? (
        <div className="w-[min(92vw,360px)] overflow-hidden rounded-[28px] border border-black/6 bg-white shadow-[0_24px_60px_rgba(31,41,51,0.18)]">
          <div className="flex items-start justify-between gap-3 border-b border-black/6 bg-[#0d7377] px-4 py-4 text-white">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/75">Enquiry</p>
              <h2 className="mt-1 font-heading text-xl">Chat on WhatsApp</h2>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full bg-white/15 px-3 py-1 text-sm font-semibold text-white transition hover:bg-white/25"
            >
              Close
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 p-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#66727e]">Your Name</label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your name"
                className="mt-2 w-full rounded-2xl border border-black/10 bg-[#fafaf8] px-4 py-3 text-sm text-[#1f2933] outline-none focus:border-[#0d7377]/30"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#66727e]">Your Enquiry</label>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Write what you need..."
                rows={4}
                className="mt-2 w-full resize-none rounded-2xl border border-black/10 bg-[#fafaf8] px-4 py-3 text-sm text-[#1f2933] outline-none focus:border-[#0d7377]/30"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setMessage(prompt)}
                  className="rounded-full border border-[#0d7377]/15 bg-[#0d7377]/6 px-3 py-2 text-xs font-semibold text-[#0d7377] transition hover:bg-[#0d7377]/10"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-[#0d7377] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0a5c60]"
            >
              Continue on WhatsApp
            </button>

            <p className="text-xs leading-6 text-[#66727e]">
              {whatsappNumber
                ? "This opens a direct WhatsApp chat with your enquiry prefilled."
                : "Set VITE_WHATSAPP_NUMBER to open a direct business WhatsApp chat. Until then, this opens WhatsApp with your message prefilled."}
            </p>
          </form>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0d7377] text-2xl text-white shadow-[0_18px_40px_rgba(13,115,119,0.28)] transition hover:bg-[#0a5c60]"
        aria-label="Open WhatsApp enquiry box"
      >
        💬
      </button>
    </div>
  );
}

export default EnquiryWidget;