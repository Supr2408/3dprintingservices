import Navbar from "./Navbar";
import EnquiryWidget from "./EnquiryWidget";

function Layout({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-[#1f2933]">
      <Navbar />
      <main className="relative z-10 mx-auto w-full max-w-[1440px] px-4 py-4 sm:px-6 lg:px-8 page-enter">{children}</main>
      <EnquiryWidget />
    </div>
  );
}

export default Layout;
