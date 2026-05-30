import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsCart3, BsPersonCircle } from "react-icons/bs";
import { FcSearch } from "react-icons/fc";
import { ImCancelCircle } from "react-icons/im";
import axios from "axios";
import { GeneralContext } from "../context/GeneralContext";

const Navbar = () => {
  const navigate = useNavigate();
  const usertype = localStorage.getItem("userType");
  const username = localStorage.getItem("username");
  const { cartCount, logout } = useContext(GeneralContext);

  const [productSearch, setProductSearch] = useState("");
  const [noResult, setNoResult] = useState(false);
  const [categories, setCategories] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/products/fetch-categories"
      );
      setCategories(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = () => {
    if (!productSearch.trim()) return;
    if (categories.includes(productSearch)) {
      navigate(`/category/${productSearch}`);
      setNoResult(false);
      setMobileOpen(false);
    } else {
      setNoResult(true);
    }
  };

  return (
    <header className="w-full shadow-md bg-linear-to-r from-green-200 via-white to-green-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-19">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 hover:scale-105 transition-transform"
          >
            <div className="w-12 h-12 flex items-center justify-center">
              <img src="/logo.png" alt="logo" style={{width:"50px", height:"50px"}} />
            </div>
            <span className="text-3xl font-bold tracking-wide text-green-700 font-Outfit">
              Organic Tea
            </span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-10 text-lg font-medium">
            <Link className="hover:text-green-700 transition" to="/">
              Home
            </Link>
            <Link className="hover:text-green-700 transition" to="/product">
              Collection
            </Link>
            <Link className="hover:text-green-700 transition" to="/about">
              About
            </Link>
            <Link className="hover:text-green-700 transition" to="/contact">
              Contact
            </Link>
          </nav>

          {/* Right Icons */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center border rounded-xl overflow-hidden bg-white">
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search category..."
                className="px-4 py-2 focus:outline-none text-sm"
              />
              <button onClick={handleSearch} className="px-3">
                <FcSearch className="text-xl" />
              </button>
            </div>

            {!usertype ? (
              <button
                onClick={() => navigate("/auth")}
                className="px-5 py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700"
              >
                Login
              </button>
            ) : usertype === "customer" ? (
              <div className="flex items-center gap-6">
                <button
                  onClick={() => navigate("/profile")}
                  className="flex items-center gap-2 hover:text-green-600"
                >
                  <BsPersonCircle className="text-3xl" />
                  <span className="text-sm uppercase">{username}</span>
                </button>
                <button onClick={() => navigate("/cart")} className="relative">
                  <BsCart3 className="text-3xl text-gray-800 hover:text-green-600" />
                  <span className="absolute -top-2 -right-2 bg-green-700 text-white text-[10px] w-6 h-6 flex items-center justify-center rounded-full">
                    {cartCount || 0}
                  </span>
                </button>
              </div>
            ) : (
              <div className="flex gap-4">
                <button onClick={() => navigate("/admin")} className="text-sm">
                  Admin
                </button>
                <button onClick={logout} className="text-sm text-red-600">
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-3 border rounded-xl"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <div className="space-y-1">
              <span className="block w-6 h-0.5 bg-black"></span>
              <span className="block w-6 h-0.5 bg-black"></span>
              <span className="block w-6 h-0.5 bg-black"></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden px-6 pb-5 space-y-4 bg-white shadow-inner">
          <button onClick={() => navigate("/")} className="w-full text-left py-2">
            Home
          </button>
          <button onClick={() => navigate("/product")} className="w-full text-left py-2">
            Collection
          </button>
          <button onClick={() => navigate("/about")} className="w-full text-left py-2">
            About
          </button>
          <button onClick={() => navigate("/contact")} className="w-full text-left py-2">
            Contact
          </button>

          <div className="flex items-center border rounded-xl overflow-hidden bg-white">
            <input
              type="text"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              placeholder="Search category..."
              className="px-4 py-2 w-full"
            />
            <button onClick={handleSearch} className="px-3">
              Go
            </button>
          </div>

          {noResult && <p className="text-xs text-red-600">No results found...</p>}

          {!usertype ? (
            <button
              onClick={() => navigate("/auth")}
              className="w-full py-2 border rounded-xl"
            >
              Login
            </button>
          ) : usertype === "customer" ? (
            <div className="flex justify-between items-center py-2">
              <button onClick={() => navigate("/profile")} className="flex items-center gap-2">
                <BsPersonCircle className="text-2xl" /> {username}
              </button>
              <button onClick={() => navigate("/cart")} className="relative">
                <BsCart3 className="text-2xl" />
                <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount || 0}
                </span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <button onClick={() => navigate("/admin")}>Admin Panel</button>
              <button onClick={logout} className="text-red-600">
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
