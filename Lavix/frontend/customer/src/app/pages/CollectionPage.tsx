import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ScanFace, Sparkles, Tag } from "lucide-react";
import { Header } from "../components/Header";
import { getGarments, isWomensGarment, isMensGarment } from "../services/api";

interface CollectionItem {
  id: number | string;
  name: string;
  image: string;
  category?: string;
}

interface CollectionPageProps {
  title: string;
  basePath: string;
  items: CollectionItem[];
  targetGender?: "men" | "women";
}

export function getGarmentSubtype(name: string, category: string = ""): string {
  const n = (name || "").toLowerCase();
  const c = (category || "").toLowerCase();
  if (n.includes("saree") || n.includes("sari") || n.includes("lehenga") || c.includes("saree")) return "Sarees & Lehengas";
  if (n.includes("t-shirt") || n.includes("tshirt") || n.includes("tee")) return "T-Shirts & Casual Wear";
  if (n.includes("shirt") || c.includes("shirt")) return "Shirts & Formal Wear";
  if (n.includes("kurta") || n.includes("kurti") || n.includes("anarkali") || n.includes("ethnic")) return "Kurtas & Ethnic Wear";
  if (n.includes("jean") || n.includes("denim") || n.includes("trouser") || n.includes("pant")) return "Jeans & Trousers";
  if (n.includes("jacket") || n.includes("coat") || n.includes("blazer")) return "Jackets & Outerwear";
  if (n.includes("dress") || n.includes("gown") || n.includes("frock") || n.includes("top")) return "Dresses & Tops";
  return "Featured Collections";
}

export function CollectionPage({ title, basePath, items, targetGender }: CollectionPageProps) {
  const [backendItems, setBackendItems] = useState<CollectionItem[]>([]);
  const [activeTypeTab, setActiveTypeTab] = useState<string>("All");

  useEffect(() => {
    getGarments().then((list) => {
      let filtered = list;
      if (targetGender === "women") {
        filtered = list.filter((g) => isWomensGarment(g.category, g.name));
      } else if (targetGender === "men") {
        filtered = list.filter((g) => isMensGarment(g.category, g.name));
      }

      const mapped = filtered.map((g) => ({
        id: g.id,
        name: `${g.name} (${g.color})`,
        image: g.imageUrl,
        category: g.category,
      }));
      setBackendItems(mapped);
    });
  }, [targetGender]);

  const allItems = [...backendItems, ...items];
  const seenImageUrls = new Set<string>();
  const uniqueItems = allItems.filter((item) => {
    if (!item.image || seenImageUrls.has(item.image)) return false;
    seenImageUrls.add(item.image);
    return true;
  });

  // Group unique items by Garment Type
  const groupedByType: Record<string, CollectionItem[]> = {};
  uniqueItems.forEach((item) => {
    const typeGroup = getGarmentSubtype(item.name, item.category);
    if (!groupedByType[typeGroup]) {
      groupedByType[typeGroup] = [];
    }
    groupedByType[typeGroup].push(item);
  });

  const categoryTypeList = Object.keys(groupedByType);

  return (
    <div className="bg-[#f6f6f6] min-h-screen flex flex-col items-center w-full font-['Clash_Display',sans-serif]">
      <Header />
      
      <div className="w-full max-w-[2000px] px-8 md:px-[64px] py-[48px] flex flex-col items-start">
        {/* Page Header */}
        <div className="flex items-center gap-[16px] mb-[24px]">
          <Link to="/home" className="flex items-center justify-center w-[64px] h-[64px] hover:bg-black/5 rounded-full transition-colors no-underline">
            <ChevronLeft size={48} strokeWidth={2} />
          </Link>
          <h1 className="text-4xl md:text-[64px] font-medium text-black">
            {title}
          </h1>
        </div>

        {/* Category Type Tabs Navigation */}
        <div className="flex gap-3 overflow-x-auto w-full pb-4 mb-8">
          <button 
            onClick={() => setActiveTypeTab("All")}
            className={`px-6 py-3 rounded-full text-lg font-medium transition-all whitespace-nowrap ${
              activeTypeTab === "All" ? "bg-black text-white shadow-md" : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-100"
            }`}
          >
            All Types ({uniqueItems.length})
          </button>
          {categoryTypeList.map((typeGroup) => (
            <button 
              key={typeGroup}
              onClick={() => setActiveTypeTab(typeGroup)}
              className={`px-6 py-3 rounded-full text-lg font-medium transition-all whitespace-nowrap ${
                activeTypeTab === typeGroup ? "bg-black text-white shadow-md" : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-100"
              }`}
            >
              {typeGroup} ({groupedByType[typeGroup].length})
            </button>
          ))}
        </div>

        {/* Display Grouped Sections */}
        {categoryTypeList.map((typeGroup) => {
          if (activeTypeTab !== "All" && activeTypeTab !== typeGroup) return null;
          const groupItems = groupedByType[typeGroup];

          return (
            <div key={typeGroup} className="w-full mb-[48px] flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 flex items-center gap-2">
                  <Tag className="w-6 h-6 text-indigo-600" />
                  {typeGroup}
                </h2>
                <span className="text-sm font-semibold text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
                  {groupItems.length} Products
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[32px] w-full">
                {groupItems.map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="flex flex-col gap-[16px] w-full group bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all">
                    <Link 
                      to={typeof item.id === "string" && item.id.includes("local") ? `/garment/${item.id}` : `${basePath}/${item.id}`} 
                      state={{ item: { id: item.id, name: item.name, image: item.image } }}
                      className="w-full aspect-[470/480] bg-[#e2ded9] rounded-xl overflow-hidden block relative"
                    >
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span className="absolute top-3 right-3 bg-black/70 text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {typeGroup.split(" ")[0]}
                      </span>
                    </Link>

                    <div className="flex flex-col gap-3 flex-1 justify-between">
                      <h3 className="text-xl font-semibold text-black group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {item.name}
                      </h3>

                      <Link
                        to={typeof item.id === "string" && item.id.includes("local") ? `/garment/${item.id}` : `${basePath}/${item.id}`}
                        state={{ item: { id: item.id, name: item.name, image: item.image } }}
                        className="w-full bg-black text-white py-3 rounded-xl flex items-center justify-center gap-2 font-medium text-base hover:bg-gray-800 transition-colors shadow-sm"
                      >
                        <ScanFace className="w-5 h-5 text-emerald-400" />
                        <span>Virtual Try On</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
