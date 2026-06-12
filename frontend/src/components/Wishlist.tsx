import { useEffect, useState } from "react";
import { X, Heart, Trash2 } from "lucide-react";
import { supabase } from '../client';

interface WishlistItem {
  id: string;
  product_id: number;
  product_name: string;
  product_type: string;
  product_image: string;
  created_at: string;
}

interface WishlistProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onTryOn?: (product: any) => void;
}

export function Wishlist({ isOpen, onClose, userId, onTryOn }: WishlistProps) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen && userId) {
      fetchWishlist();
    }
  }, [isOpen, userId]);

  const fetchWishlist = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('wishlist')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWishlistItems(data || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      
      setWishlistItems(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error removing wishlist item:', error);
    }
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
        className="w-full max-w-7xl mt-20 mb-20 mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#f6e1d2] rounded-t-2xl shadow-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-[#7C563D] fill-[#7C563D]" />
              <h2 className="font-['Playfair_Display'] text-[#2a120a] text-3xl">
                My Wishlist
              </h2>
            </div>
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
                <p className="text-[#7C563D] text-xl">Loading your wishlist...</p>
              </div>
            </div>
          ) : wishlistItems.length > 0 ? (
            <>
              <p className="font-['Montserrat'] text-[#7c563d] text-lg mb-6">
                You have {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} in your wishlist
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistItems.map((item) => (
                  <div key={item.id} className="relative">
                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-red-50 p-2 rounded-full transition-colors group"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-5 h-5 text-[#7c563d] group-hover:text-red-500" />
                    </button>
                    
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
                                
                                {/* Try On Button */}
                                {onTryOn && (
                                  <button
                                    onClick={() => {
                                      onTryOn({
                                        id: item.product_id,
                                        name: item.product_name,
                                        type: item.product_type,
                                        image: item.product_image,
                                      });
                                      onClose();
                                    }}
                                    className="bg-[#7c563d] box-border content-stretch flex gap-[12px] items-center justify-center pl-[20px] pr-[24px] py-[12px] relative rounded-[12px] shrink-0 hover:bg-[#6a4a33] transition-colors w-full max-w-[220px]"
                                  >
                                    <p className="font-['Montserrat:Medium'] font-medium leading-[normal] text-[#fcf5f1] text-[20px]">
                                      Try On
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
              <Heart className="w-24 h-24 text-[#7C563D]/20 mx-auto mb-4" />
              <p className="text-[#7C563D] text-2xl mb-4">Your wishlist is empty</p>
              <p className="text-[#7C563D]/70 text-lg">
                Start adding jewelry items you love to your wishlist!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}