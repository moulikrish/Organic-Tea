import React, { useEffect, useState, useRef } from "react";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CollectionPage from "../components/CollectionPage";

// Tailwind Home (two-column hero with real <img>, auto-scrolling)
const Home = () => {
  const navigate = useNavigate();
  const [bannerImg, setBannerImg] = useState();
  const [heroIndex, setHeroIndex] = useState(0);
  const heroTimerRef = useRef(null);

  // IMPORTANT: local uploaded path included (tooling will transform to URL when served)
  const heroImages = [
    "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0",
    "https://images.unsplash.com/photo-1521012012373-6a85bade18da?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0",
    "https://images.unsplash.com/photo-1762328853659-97aa5460be0f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0",
  ];

  useEffect(() => {
    fetchBanner();
  }, []);

  useEffect(() => {
    // auto-rotate hero images
    heroTimerRef.current = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroImages.length);
    }, 4000);
    return () => {
      clearInterval(heroTimerRef.current);
    };
  }, []);

  // If API returns a banner, use it; otherwise rotate heroImages
  const currentHeroSrc = bannerImg ? bannerImg : heroImages[heroIndex];

  const fetchBanner = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/banners");
      // response.data expected to be a url string or path
      setBannerImg(response.data);
    } catch (err) {
      // keep rotating local/unsplash images; log error
      console.error(
        "Failed to fetch banner:",
        err.response?.data?.message || err.message
      );
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#f0fdf4] via-white to-[#dcfce7] text-gray-800 font-serif mt-20">
      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto mt-6 overflow-hidden rounded-3xl shadow-xl border border-green-200">
        <div className="grid grid-cols-1 md:grid-cols-2 items-stretch">
          {/* LEFT CONTENT */}
          <div className="bg-white/80 backdrop-blur-xl p-10 md:p-16 flex flex-col justify-center">
            <span className="text-xs tracking-widest text-green-700 font-semibold">
              ORGANIC SPECIALS
            </span>
            <h1 className="text-5xl md:text-6xl font-semibold text-green-800 leading-tight mt-3">
              Fresh Tea Arrivals
            </h1>
            <p className="mt-4 text-sm text-gray-600 max-w-md">
              Explore premium handpicked tea collections from organic farms —
              rich aroma & natural healing.
            </p>

            <div className="mt-7 flex items-center gap-6">
              <Link
                to="/product"
                className="px-6 py-3 rounded-full border border-green-800 text-green-900 font-semibold hover:bg-green-800 hover:text-white transition-all"
              >
                SHOP NOW
              </Link>

              {/* indicators */}
              <div className="flex items-center gap-2">
                {heroImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setHeroIndex(idx)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      heroIndex === idx
                        ? "scale-125 bg-green-800"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="w-full h-80 md:h-auto flex items-center justify-center bg-green-50">
            <img
              src={currentHeroSrc}
              alt="Hero"
              className="w-full h-80 md:h-full object-cover transition-all duration-500"
              onMouseEnter={() => clearInterval(heroTimerRef.current)}
              onMouseLeave={() => {
                heroTimerRef.current = setInterval(() => {
                  setHeroIndex((i) => (i + 1) % heroImages.length);
                }, 4000);
              }}
            />
          </div>
        </div>
      </section>

      {/* COLLECTION SECTION */}
      <section className="max-w-7xl mx-auto px-4 mt-16">
        <h2 className="text-3xl md:text-4xl font-bold text-green-800 tracking-wide text-center">
          Latest Collections
        </h2>
        <div className="mt-10">
          <CollectionPage category={"all"} />
        </div>
      </section>
    </div>
  );
};

export default Home;
