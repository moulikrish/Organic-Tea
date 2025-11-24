import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-linear-to-br from-[#e8f5e9] via-[#f1f8e9] to-white text-gray-700 pt-14 pb-10 mt-20 border-t border-gray-200 shadow-inner">
      {/* Top Accent Line */}
      <div className="h-1 w-full bg-linear-to-r from-[#16a34a] to-[#65a30d]" />

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 py-12">

          {/* Brand */}
          <div>
            <h2 className="text-3xl font-extrabold text-[#14532d] tracking-wide">
              Organic Tea
            </h2>
            <p className="mt-4 text-sm text-gray-600 leading-relaxed">
              Pure organic teas crafted with love for a refreshing lifestyle.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-[#14532d] mb-5">Quick Links</h3>
            <ul className="space-y-2 text-sm font-medium">
              <li><Link className="hover:text-[#15803d] transition">Home</Link></li>
              <li><Link className="hover:text-[#15803d] transition">Products</Link></li>
              <li><Link className="hover:text-[#15803d] transition">Categories</Link></li>
              <li><Link className="hover:text-[#15803d] transition">Cart</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-[#14532d] mb-5">Support</h3>
            <ul className="space-y-2 text-sm font-medium">
              <li><Link className="hover:text-[#15803d] transition">Help Center</Link></li>
              <li><Link className="hover:text-[#15803d] transition">Contact Us</Link></li>
              <li><Link className="hover:text-[#15803d] transition">FAQs</Link></li>
              <li><Link className="hover:text-[#15803d] transition">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-semibold text-[#14532d] mb-5">Follow Us</h3>
            <div className="flex gap-4 items-center">
              {["733547", "733558", "733579", "733590"].map((id) => (
                <a key={id} href="#" className="hover:scale-110 transition transform">
                  <img
                    src={`https://cdn-icons-png.flaticon.com/512/733/${id}.png`}
                    className="w-7 h-7 opacity-80 hover:opacity-100"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Copy */}
        <div className="border-t border-gray-300 mt-10 pt-6 text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Organic Tea — Built with ❤️ by {" "}
            <span className="text-[#15803d] font-semibold">Mouli</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;