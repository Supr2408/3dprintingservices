import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Catalog" },
  { to: "/contact", label: "Contact" }
];

function Navbar() {
  const { totals } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 backdrop-blur-md">
      <div className="border-b border-black/5 bg-[#fafafa] px-4 py-2 text-center text-xs text-[#6b7280] sm:text-sm">
        Welcome to our store
      </div>

      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-[15px] font-semibold tracking-[-0.02em] text-[#111827] sm:text-[17px]">
          Shree Sindhvai Tech
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link key={item.label} to={item.to} className="text-sm text-[#4b5563] transition hover:text-[#111827]">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 text-[#111827]">
          <button type="button" aria-label="Search" className="rounded-full p-1.5 transition hover:bg-black/5">
            <IconSearch />
          </button>
          <button type="button" aria-label="Account" className="rounded-full p-1.5 transition hover:bg-black/5">
            <IconUser />
          </button>
          <Link to="/cart" aria-label="Cart" className="relative rounded-full p-1.5 transition hover:bg-black/5">
            <IconBag />
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#111827] px-1 text-[10px] font-semibold leading-none text-white">
              {totals.count}
            </span>
          </Link>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1440px] gap-4 overflow-x-auto px-4 pb-3 text-sm md:hidden sm:px-6 lg:px-8">
        {navItems.map((item) => (
          <Link key={item.label} to={item.to} className="whitespace-nowrap text-[#4b5563] transition hover:text-[#111827]">
            {item.label}
          </Link>
        ))}
      </div>
    </header>
  );
}

function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-[1.7]">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" strokeLinecap="round" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-[1.7]">
      <circle cx="12" cy="8" r="3.25" />
      <path d="M5.5 19c1.6-3.5 4.1-5.25 6.5-5.25S16.9 15.5 18.5 19" strokeLinecap="round" />
    </svg>
  );
}

function IconBag() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-[1.7]">
      <path d="M6.5 8.5h11l-.75 9a2 2 0 0 1-2 1.75h-5.5a2 2 0 0 1-2-1.75l-.75-9Z" />
      <path d="M9 8.5a3 3 0 0 1 6 0" strokeLinecap="round" />
    </svg>
  );
}

export default Navbar;
