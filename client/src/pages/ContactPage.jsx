import { useState } from "react";

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // In a real app, send to backend API
      console.log("Form submitted:", formData);
      
      setSubmitStatus({
        type: "success",
        message: "Thank you for reaching out! We'll respond to your message soon."
      });
      
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Failed to send message. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 bg-white py-10 sm:py-16">
      {/* Contact Section */}
      <section className="space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.28em] text-[#6b7280]">Get in Touch</p>
          <h1 className="mt-3 font-heading text-4xl leading-tight tracking-[-0.04em] text-[#111827] sm:text-5xl">
            Contact Us
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[#6b7280]">
            Have a question or want to learn more about our 3D printing services? We'd love to hear from you.
          </p>
        </div>

        <div className="mx-auto max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="rounded-lg border border-black/10 px-4 py-3 text-sm placeholder-[#9ca3af] focus:border-black/20 focus:outline-none"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="rounded-lg border border-black/10 px-4 py-3 text-sm placeholder-[#9ca3af] focus:border-black/20 focus:outline-none"
              />
            </div>

            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-black/10 px-4 py-3 text-sm placeholder-[#9ca3af] focus:border-black/20 focus:outline-none"
            />

            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleInputChange}
              required
              className="w-full rounded-lg border border-black/10 px-4 py-3 text-sm placeholder-[#9ca3af] focus:border-black/20 focus:outline-none"
            />

            <textarea
              name="message"
              placeholder="Message"
              value={formData.message}
              onChange={handleInputChange}
              required
              rows="6"
              className="w-full rounded-lg border border-black/10 px-4 py-3 text-sm placeholder-[#9ca3af] focus:border-black/20 focus:outline-none"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-[#8b5e3c] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#74492d] disabled:opacity-60"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>

          {submitStatus && (
            <div
              className={`mt-4 rounded-lg px-4 py-3 text-sm ${
                submitStatus.type === "success"
                  ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {submitStatus.message}
            </div>
          )}
        </div>

        {/* Contact Info Cards */}
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-black/5 bg-[#fafafa] p-6 text-center">
              <div className="text-2xl">📍</div>
              <h3 className="mt-3 font-heading text-lg text-[#111827]">Location</h3>
              <p className="mt-2 text-sm text-[#6b7280]">
                Based in India
                <br />
                Serving globally
              </p>
            </div>

            <div className="rounded-lg border border-black/5 bg-[#fafafa] p-6 text-center">
              <div className="text-2xl">💬</div>
              <h3 className="mt-3 font-heading text-lg text-[#111827]">Chat with Us</h3>
              <p className="mt-2 text-sm text-[#6b7280]">
                WhatsApp: Available
                <br />
                Quick responses
              </p>
            </div>

            <div className="rounded-lg border border-black/5 bg-[#fafafa] p-6 text-center">
              <div className="text-2xl">⏱️</div>
              <h3 className="mt-3 font-heading text-lg text-[#111827]">Response Time</h3>
              <p className="mt-2 text-sm text-[#6b7280]">
                Usually within
                <br />
                24 hours
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="space-y-8 border-t border-black/5 px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.28em] text-[#6b7280]">Who We Are</p>
          <h2 className="mt-3 font-heading text-4xl leading-tight tracking-[-0.04em] text-[#111827] sm:text-5xl">
            About Shree Sindhvai Tech
          </h2>
        </div>

        <div className="mx-auto max-w-3xl space-y-6">
          <p className="text-lg leading-8 text-[#4b5563]">
            Welcome to Shree Sindhvai Tech, your go-to destination for premium 3D printed products and custom designs. 
            We specialize in creating high-quality, precision-engineered 3D printed items for homes, offices, gifts, and small businesses.
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="font-heading text-2xl text-[#111827]">Our Mission</h3>
              <p className="mt-2 text-[#6b7280]">
                To make 3D printing accessible and affordable for everyone by offering a curated collection of ready-to-order products 
                combined with custom design services. We believe that creativity should know no bounds, and 3D printing is the technology 
                that makes that possible.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-2xl text-[#111827]">What We Offer</h3>
              <ul className="mt-3 space-y-2 text-[#6b7280]">
                <li className="flex gap-3">
                  <span className="flex-shrink-0">✓</span>
                  <span><strong>Catalog Products:</strong> Ready-to-order items like fidget toys, keychains, organizers, and desk accessories</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0">✓</span>
                  <span><strong>Custom Orders:</strong> Bring your own designs to life with our professional printing and finishing services</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0">✓</span>
                  <span><strong>Multiple Materials:</strong> Choose from PLA, ABS, PETG, and Resin for your perfect project</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0">✓</span>
                  <span><strong>Fast Turnaround:</strong> Quick quotes and reliable delivery with tracking</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-heading text-2xl text-[#111827]">Why Choose Us?</h3>
              <ul className="mt-3 space-y-2 text-[#6b7280]">
                <li className="flex gap-3">
                  <span className="flex-shrink-0">⭐</span>
                  <span>High-quality prints with meticulous attention to detail</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0">⭐</span>
                  <span>Experienced team with years of 3D printing expertise</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0">⭐</span>
                  <span>Competitive pricing with transparent quotes</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0">⭐</span>
                  <span>Responsive customer support via WhatsApp and email</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 rounded-lg bg-[#f7f4ef] p-8 text-center">
            <p className="text-lg font-medium text-[#111827]">
              Ready to bring your ideas to life?
            </p>
            <p className="mt-2 text-[#6b7280]">
              Browse our catalog, upload your design, or reach out for a custom quote.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <a
                href="/products"
                className="rounded-full bg-[#8b5e3c] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#74492d]"
              >
                Shop Products
              </a>
              <a
                href="/custom-order"
                className="rounded-full border border-[#8b5e3c] px-6 py-3 text-sm font-medium text-[#8b5e3c] transition hover:bg-[#f2d5b0]"
              >
                Upload Custom Design
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactPage;
