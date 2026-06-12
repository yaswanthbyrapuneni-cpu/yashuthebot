import { useEffect, useState } from "react";
import { X, Gift, Tag, Calendar, Sparkles } from "lucide-react";
import { supabase } from '../client';

interface Offer {
  id: string;
  title: string;
  description: string;
  discount_percentage?: number;
  code?: string;
  valid_until: string;
  image_url?: string;
  category?: string;
}

interface OffersProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Offers({ isOpen, onClose }: OffersProps) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchOffers();
    }
  }, [isOpen]);

  const fetchOffers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .gte('valid_until', new Date().toISOString())
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOffers(data || []);
    } catch (error) {
      console.error('Error fetching offers:', error);
      // Set demo offers if table doesn't exist yet
      setOffers([
        {
          id: '1',
          title: 'New Year Special',
          description: 'Get 20% off on all gold jewelry! Limited time offer.',
          discount_percentage: 20,
          code: 'NY2025',
          valid_until: '2025-01-31',
          category: 'Gold'
        },
        {
          id: '2',
          title: 'Diamond Delight',
          description: 'Buy 1 Get 1 on selected diamond earrings',
          discount_percentage: 50,
          code: 'DIAMOND50',
          valid_until: '2025-02-14',
          category: 'Diamond'
        },
        {
          id: '3',
          title: 'First Purchase Bonus',
          description: 'Extra 15% off on your first purchase with us!',
          discount_percentage: 15,
          code: 'FIRST15',
          valid_until: '2025-12-31',
          category: 'All'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    // You could add a toast notification here
    alert(`Code "${code}" copied to clipboard!`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  useEffect(() => {
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
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-4xl mt-20 mb-20 mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#d4af37] to-[#f4e4c1] rounded-t-2xl shadow-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Gift className="w-8 h-8 text-[#2a120a]" />
              <h2 className="font-['Playfair_Display'] text-[#2a120a] text-3xl">
                Exclusive Offers & Deals
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#2a120a]/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-[#2a120a]" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-b-2xl shadow-2xl p-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-[#7c563d] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-[#7C563D] text-xl">Loading offers...</p>
              </div>
            </div>
          ) : offers.length > 0 ? (
            <div className="space-y-6">
              {offers.map((offer) => (
                <div 
                  key={offer.id} 
                  className="bg-gradient-to-r from-[#fcf8f6] to-[#f6e1d2] rounded-2xl p-6 border-2 border-[#ecbd9f] hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-5 h-5 text-[#d4af37]" />
                        <h3 className="font-['Playfair_Display'] text-[#2a120a] text-2xl">
                          {offer.title}
                        </h3>
                      </div>
                      
                      <p className="font-['Montserrat'] text-[#7c563d] text-base mb-4">
                        {offer.description}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4">
                        {/* Discount Badge */}
                        {offer.discount_percentage && (
                          <div className="flex items-center gap-2 bg-gradient-to-r from-[#d4af37] to-[#f4e4c1] px-4 py-2 rounded-full">
                            <Tag className="w-4 h-4 text-[#2a120a]" />
                            <span className="font-['Montserrat:Bold'] text-[#2a120a]">
                              {offer.discount_percentage}% OFF
                            </span>
                          </div>
                        )}
                        
                        {/* Promo Code */}
                        {offer.code && (
                          <button
                            onClick={() => copyCode(offer.code!)}
                            className="flex items-center gap-2 bg-[#7c563d] hover:bg-[#6a4a33] px-4 py-2 rounded-full transition-colors"
                          >
                            <span className="font-['Montserrat:Bold'] text-[#fcf5f1] text-sm">
                              CODE: {offer.code}
                            </span>
                            <span className="text-[#fcf5f1] text-xs">
                              (Click to copy)
                            </span>
                          </button>
                        )}
                        
                        {/* Valid Until */}
                        <div className="flex items-center gap-2 text-[#7c563d]">
                          <Calendar className="w-4 h-4" />
                          <span className="font-['Montserrat'] text-sm">
                            Valid until {formatDate(offer.valid_until)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Category */}
                      {offer.category && (
                        <div className="mt-3">
                          <span className="inline-block bg-[#7c563d]/10 text-[#7c563d] px-3 py-1 rounded-full text-sm font-['Montserrat']">
                            {offer.category} Collection
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Image if available */}
                    {offer.image_url && (
                      <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                        <img 
                          src={offer.image_url} 
                          alt={offer.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Gift className="w-24 h-24 text-[#7C563D]/20 mx-auto mb-4" />
              <p className="text-[#7C563D] text-2xl mb-4">No active offers right now</p>
              <p className="text-[#7C563D]/70 text-lg">
                Check back soon for exciting deals and discounts!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}