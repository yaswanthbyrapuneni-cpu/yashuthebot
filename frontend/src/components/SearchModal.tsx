import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { ProductCard } from "./ProductCard";

interface Product {
  id: string;
  name: string;
  image: string;
  category: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: {
    trending: Product[];
    gold: Product[];
    platinum: Product[];
  };
  onTryOn: (product: Product) => void;
  onProductClick: (product: Product) => void;
}

export function SearchModal({ isOpen, onClose, products, onTryOn, onProductClick }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Inside SearchModal.tsx

  const allProducts = [
    ...(products?.trending?.map(p => ({ ...p, category: 'Trending' })) || []),
    ...(products?.gold?.map(p => ({ ...p, category: 'Gold' })) || []),
    ...(products?.platinum?.map(p => ({ ...p, category: 'Platinum' })) || []),
    ...(products?.silver?.map(p => ({ ...p, category: 'Silver' })) || []) // Also add checks for any other categories like silver
  ];

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        (product.type && product.type.toLowerCase().includes(query)) ||
        (product.material && product.material.toLowerCase().includes(query))
    );
    setFilteredProducts(filtered);
  }, [searchQuery]);

  useEffect(() => {
    // Reset search when modal closes
    if (!isOpen) {
      setSearchQuery("");
      setFilteredProducts([]);
    }
  }, [isOpen]);

  useEffect(() => {
    // Handle escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-4xl mt-20 mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
          <div className="flex items-center gap-4">
            <Search className="w-6 h-6 text-[#7C563D]" />
            <input
              type="text"
              placeholder="Search for jewelry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none text-[#2a120a] text-xl placeholder:text-[#7C563D]/50"
              autoFocus
            />
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#fcf5f1] rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-[#7C563D]" />
            </button>
          </div>
        </div>

        {/* Search Results */}
        {searchQuery.trim() !== "" && (
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-h-[600px] overflow-y-auto">
            {filteredProducts.length > 0 ? (
              <>
                <h3 className="font-['Playfair_Display'] text-[#2a120a] text-2xl mb-6">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'Result' : 'Results'} Found
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <div key={product.id}>
                      <ProductCard
                        {...product}
                        onTryOn={() => {
                          onTryOn(product);
                          onClose();
                        }}
                        onClick={() => {
                          onProductClick(product);
                          onClose();
                        }}
                      />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-[#7C563D] text-xl">
                  No products found for "{searchQuery}"
                </p>
                <p className="text-[#7C563D]/70 mt-2">
                  Try searching with different keywords
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
