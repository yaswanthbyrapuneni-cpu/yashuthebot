import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Camera, ScanFace, Sparkles, RefreshCw } from "lucide-react";
import { Header } from "../components/Header";
import { OfferBanners } from "../components/OfferBanners";
import { HeroCarousel } from "../components/HeroCarousel";
import { getGarments, Garment, isWomensGarment, isMensGarment } from "../services/api";

import imgFrame236 from "../../assets/mens_banner.jpg";

export function Home() {
  const [backendGarments, setBackendGarments] = useState<Garment[]>([]);
  const [loadingGarments, setLoadingGarments] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "women" | "men">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchLiveCatalog = (force = false) => {
    // Only show the spinner when there is genuinely nothing to display. On a
    // cache hit this resolves synchronously enough that flipping loading on
    // would just flash the spinner during back-navigation.
    setBackendGarments((current) => {
      if (current.length === 0) setLoadingGarments(true);
      return current;
    });
    getGarments(force).then((list) => {
      setBackendGarments(list);
      setLoadingGarments(false);
    });
  };

  useEffect(() => {
    fetchLiveCatalog();
  }, []);

  const filteredGarments = backendGarments.filter((g) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      g.name.toLowerCase().includes(q) ||
      g.color.toLowerCase().includes(q) ||
      g.category.toLowerCase().includes(q)
    );
  });

  const womensGarments = filteredGarments.filter((g) => isWomensGarment(g.category, g.name));
  const mensGarments = filteredGarments.filter((g) => isMensGarment(g.category, g.name));

  return (
    <div className="bg-[#f6f6f6] min-h-screen flex flex-col items-center w-full font-['Clash_Display',sans-serif]">
      <Header />
      
      <div className="w-full max-w-[2000px] px-8 md:px-[64px] py-[32px] flex flex-col items-center">
        {/* Search Bar */}
        <div className="w-full max-w-[1200px] bg-[#e3e3e3] h-[56px] md:h-[68px] rounded-[24px] relative flex items-center mb-[32px] px-6 md:px-8">
          <div className="text-[#211F26] shrink-0 mr-3">
            <Search size={26} strokeWidth={2.5} />
          </div>
          <input 
            type="text" 
            placeholder='Search for "Festival Dresses", "Sarees", "Shirts"...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent font-['Clash_Display',sans-serif] text-sm md:text-lg text-[#211f26] placeholder-[#696969] focus:outline-none"
          />
        </div>

        {/* Hero Carousel */}
        <HeroCarousel />

        {/* Category Navigation Toggles */}
        <div className="flex gap-[18px] justify-center mb-[48px]">
          <button 
            onClick={() => setActiveTab("all")} 
            className={`px-[28px] py-[16px] rounded-[999px] text-[24px] font-medium transition-all ${
              activeTab === "all" ? "bg-black text-white shadow-md" : "bg-[#f2f2f2] text-black border border-[#938f96] hover:bg-gray-200"
            }`}
          >
            All Collections
          </button>
          <button 
            onClick={() => setActiveTab("women")} 
            className={`px-[28px] py-[16px] rounded-[999px] text-[24px] font-medium transition-all ${
              activeTab === "women" ? "bg-black text-white shadow-md" : "bg-[#f2f2f2] text-black border border-[#938f96] hover:bg-gray-200"
            }`}
          >
            Women's Collection
          </button>
          <button 
            onClick={() => setActiveTab("men")} 
            className={`px-[28px] py-[16px] rounded-[999px] text-[24px] font-medium transition-all ${
              activeTab === "men" ? "bg-black text-white shadow-md" : "bg-[#f2f2f2] text-black border border-[#938f96] hover:bg-gray-200"
            }`}
          >
            Men's Collection
          </button>
        </div>

        {/* WOMEN'S COLLECTION SECTION */}
        {(activeTab === "all" || activeTab === "women") && (
          <div className="w-full max-w-[1786px] mb-[64px] flex flex-col gap-8">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-3xl md:text-[48px] font-medium text-black">Women's Collection</h2>
                <span className="flex items-center gap-1.5 bg-pink-100 text-pink-800 text-sm font-semibold px-3 py-1 rounded-full">
                  <Sparkles className="w-4 h-4 text-pink-600 animate-pulse" /> Sarees & Dresses
                </span>
              </div>
              <Link to="/womens" className="text-xl font-medium text-indigo-600 hover:underline">
                View Full Women Collection →
              </Link>
            </div>

            {loadingGarments ? (
              <div className="w-full py-12 flex justify-center items-center">
                <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
              </div>
            ) : womensGarments.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center text-gray-500 text-xl">
                No garments currently listed in Women's Collection.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {womensGarments.map((garment) => (
                  <div 
                    key={`women-${garment.id}`}
                    className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-xl transition-all duration-300 relative"
                  >
                    <Link 
                      to={`/garment/${garment.id}`} 
                      state={{ item: { id: garment.id, name: garment.name, image: garment.imageUrl, color: garment.color, category: garment.category } }}
                      className="flex flex-col flex-1"
                    >
                      <div className="w-full aspect-[4/5] bg-gray-100 overflow-hidden relative">
                        <img 
                          src={garment.imageUrl} 
                          alt={garment.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <span className="absolute top-3 right-3 bg-pink-900/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                          Women
                        </span>
                      </div>

                      <div className="p-5 flex flex-col gap-2">
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                          {garment.name}
                        </h3>
                        <p className="text-sm text-gray-500 font-medium">
                          Color: {garment.color}
                        </p>
                      </div>
                    </Link>

                    <div className="px-5 pb-5 pt-1">
                      <Link
                        to={`/garment/${garment.id}`}
                        state={{ item: { id: garment.id, name: garment.name, image: garment.imageUrl, color: garment.color, category: garment.category } }}
                        className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-medium text-base hover:from-pink-600 hover:to-pink-800 transition-all shadow-md active:scale-95"
                      >
                        <ScanFace className="w-5 h-5 text-emerald-400" />
                        <span>Virtual Try On</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MEN'S COLLECTION SECTION */}
        {(activeTab === "all" || activeTab === "men") && (
          <div className="w-full max-w-[1786px] mb-[64px] flex flex-col gap-8">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-3xl md:text-[48px] font-medium text-black">Men's Collection</h2>
                <span className="flex items-center gap-1.5 bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                  <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" /> Shirts & Pants
                </span>
              </div>
              <Link to="/mens" className="text-xl font-medium text-indigo-600 hover:underline">
                View Full Men Collection →
              </Link>
            </div>

            {loadingGarments ? (
              <div className="w-full py-12 flex justify-center items-center">
                <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
              </div>
            ) : mensGarments.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center text-gray-500 text-xl">
                No garments currently listed in Men's Collection.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {mensGarments.map((garment) => (
                  <div 
                    key={`men-${garment.id}`}
                    className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-xl transition-all duration-300 relative"
                  >
                    <Link 
                      to={`/garment/${garment.id}`} 
                      state={{ item: { id: garment.id, name: garment.name, image: garment.imageUrl, color: garment.color, category: garment.category } }}
                      className="flex flex-col flex-1"
                    >
                      <div className="w-full aspect-[4/5] bg-gray-100 overflow-hidden relative">
                        <img 
                          src={garment.imageUrl} 
                          alt={garment.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <span className="absolute top-3 right-3 bg-blue-900/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                          Men
                        </span>
                      </div>

                      <div className="p-5 flex flex-col gap-2">
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                          {garment.name}
                        </h3>
                        <p className="text-sm text-gray-500 font-medium">
                          Color: {garment.color}
                        </p>
                      </div>
                    </Link>

                    <div className="px-5 pb-5 pt-1">
                      <Link
                        to={`/garment/${garment.id}`}
                        state={{ item: { id: garment.id, name: garment.name, image: garment.imageUrl, color: garment.color, category: garment.category } }}
                        className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-medium text-base hover:from-blue-600 hover:to-blue-800 transition-all shadow-md active:scale-95"
                      >
                        <ScanFace className="w-5 h-5 text-emerald-400" />
                        <span>Virtual Try On</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}



        <style>{`
          @keyframes vastra-marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-100%); }
          }
          .vastra-marquee-container {
            display: flex;
            width: 100%;
          }
          .vastra-marquee-set {
            display: flex;
            animation: vastra-marquee 25s linear infinite;
          }
        `}</style>

        {/* Offer Banners Slider */}
        <OfferBanners />

        {/* Bottom Banner Image */}
        <div className="w-full max-w-[2085px] h-[400px] md:h-[689px] relative rounded-[25px] overflow-hidden mt-[32px] mb-[64px]">
          <img src={imgFrame236} alt="Bottom Banner" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
}
