import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section className="mx-auto max-w-xl rounded-xl border border-cyan-500/30 bg-panel/80 p-8 text-center">
      <h2 className="font-heading text-5xl text-white">404</h2>
      <p className="mt-3 text-slate-300">Route not found in the print command grid.</p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-md border border-cyan-400 bg-cyan-400/15 px-4 py-2 text-sm text-cyan-100"
      >
        Return Home
      </Link>
    </section>
  );
}

export default NotFoundPage;
