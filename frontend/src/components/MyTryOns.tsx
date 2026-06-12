import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { supabase } from '../client';

interface TryOnItem {
  product_id: number;
  product_name: string;
  product_type: string;
  product_image: string;
  try_count: number;
  last_tried: string;
}

interface MyTryOnsProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onTryOn?: (product: any) => void;
}

export function MyTryOns({ isOpen, onClose, userId, onTryOn }: MyTryOnsProps) {
  const [tryOns, setTryOns] = useState<TryOnItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen && userId) {
      fetchTryOns();
    }
  }, [isOpen, userId]);

  const fetchTryOns = async () => {
    setIsLoading(true);
    try {
      // Fetch all try-on events for this user
      const { data, error } = await supabase
        .from('try_on_events')
        .select('product_id, product_name, product_type, metadata, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group by product_id and count tries
      const productMap = new Map<number, TryOnItem>();
      
      data?.forEach((event) => {
        const productImage = event.metadata?.product_image || '';
        
        if (productMap.has(event.product_id)) {
          const existing = productMap.get(event.product_id)!;
          existing.try_count += 1;
          // Keep most recent date
          if (new Date(event.created_at) > new Date(existing.last_tried)) {
            existing.last_tried = event.created_at;
          }
        } else {
          productMap.set(event.product_id, {
            product_id: event.product_id,
            product_name: event.product_name,
            product_type: event.product_type,
            product_image: productImage,
            try_count: 1,
            last_tried: event.created_at,
          });
        }
      });

      // Convert to array and sort by most recent
      const uniqueProducts = Array.from(productMap.values())
        .sort((a, b) => new Date(b.last_tried).getTime() - new Date(a.last_tried).getTime());

      setTryOns(uniqueProducts);
    } catch (error) {
      console.error('Error fetching try-ons:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-7xl mt-20 mb-20 mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#f6e1d2] rounded-t-2xl shadow-2xl p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-['Playfair_Display'] text-[#2a120a] text-3xl">
              My Try-Ons
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#7c563d]/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-[#7C563D]" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-b-2xl shadow-2xl p-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-[#7c563d] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-[#7C563D] text-xl">Loading your try-ons...</p>
              </div>
            </div>
          ) : tryOns.length > 0 ? (
            <>
              <p className="font-['Montserrat'] text-[#7c563d] text-lg mb-6">
                You've tried {tryOns.length} unique {tryOns.length === 1 ? 'item' : 'items'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tryOns.map((item) => (
                  <div key={item.product_id} className="relative">
                    {/* Try Count Badge */}
                    <div className="absolute top-4 right-4 z-10 bg-[#7c563d] text-white px-3 py-1 rounded-full text-sm font-['Montserrat:Medium']">
                      Tried {item.try_count}x
                    </div>
                    
                    {/* Product Card */}
                    <div className="bg-[#fcf8f6] relative rounded-[26.133px] w-full">
                      <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[inherit] size-full">
                        <div className="aspect-[450/450] relative shrink-0 w-full">
                          <img 
                            alt={item.product_name} 
                            className="block max-w-none size-full object-contain" 
                            src={item.product_image} 
                          />
                        </div>
                        <div className="relative shrink-0 w-full">
                          <div className="size-full">
                            <div className="box-border content-stretch flex flex-col gap-[12px] items-start pb-[24px] pt-[16px] px-[24px] relative w-full">
                              <div className="flex flex-col items-center gap-[26.133px] w-full">
                                <div className="flex flex-col items-center w-full">
                                  <p className="font-['Montserrat:Regular'] font-normal leading-[normal] text-center w-full overflow-ellipsis overflow-hidden text-[#7c563d] text-[24px]">
                                    {item.product_name}
                                  </p>
                                  <p className="font-['Montserrat:Regular'] text-[#7c563d]/70 text-sm mt-1">
                                    {item.product_type}
                                  </p>
                                </div>
                                
                                {/* Try Again Button */}
                                {onTryOn && (
                                  <button
                                    onClick={() => onTryOn({
                                      id: item.product_id,
                                      name: item.product_name,
                                      type: item.product_type,
                                      image: item.product_image,
                                    })}
                                    className="bg-[#7c563d] box-border content-stretch flex gap-[12px] items-center justify-center pl-[20px] pr-[24px] py-[12px] relative rounded-[12px] shrink-0 hover:bg-[#6a4a33] transition-colors w-full max-w-[220px]"
                                  >
                                    <p className="font-['Montserrat:Medium'] font-medium leading-[normal] text-[#fcf5f1] text-[20px]">
                                      Try Again
                                    </p>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        aria-hidden="true"
                        className="absolute border border-[#ecbd9f] border-solid inset-[-1px] pointer-events-none rounded-[27.133px]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-[#7C563D] text-2xl mb-4">No try-ons yet</p>
              <p className="text-[#7C563D]/70 text-lg">
                Start trying on jewelry to see your history here!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}