import { X, ChevronLeft, ChevronRight, ShoppingCart, Heart, Share2 } from "lucide-react";
import { useState } from "react";
import { SnapWebAR } from "./SnapWebAR";

// Price Components
function SaveContainer() {
  return (
    <button className="text-[#7c563d] hover:text-[#6a4a33] transition-colors font-['Montserrat'] font-medium">
      Save
    </button>
  );
}

function DiscountTextContainer() {
  return (
    <div className="bg-[#7c563d] box-border content-stretch flex gap-[10px] items-center justify-center px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="Discount Text Container">
      <div className="capitalize flex flex-col font-['Montserrat:Medium',_sans-serif] font-medium justify-end leading-[0] relative shrink-0 text-[#fcf5f1] text-[16px] text-nowrap">
        <p className="leading-[normal] whitespace-pre">₹ 5,000 off</p>
      </div>
    </div>
  );
}

function DiscountContainer() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0" data-name="Discount Container">
      <SaveContainer />
      <DiscountTextContainer />
    </div>
  );
}

function PriceDetails() {
  return (
    <div className="capitalize content-stretch flex font-['Montserrat:Medium',_sans-serif] font-medium gap-[16px] items-end leading-[0] relative shrink-0 text-nowrap w-full" data-name="Price Details">
      <div className="flex flex-col justify-end relative shrink-0 text-[#5f422f] text-[56px]">
        <p className="leading-[normal] text-nowrap whitespace-pre">Rs. 1,73,569</p>
      </div>
      <div className="flex flex-col justify-end relative shrink-0 text-[#a06f4f] text-[24px]">
        <p className="leading-[normal] text-nowrap whitespace-pre">21% off</p>
      </div>
    </div>
  );
}

interface ProductDetailProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: number;
    name: string;
    image: string;
    images?: string[];
    rating: number;
    reviewCount: number;
    type: string;
    price?: string;
    originalPrice?: string;
    description?: string;
    material?: string;
    weight?: string;
    dimensions?: string;
    purity?: string;
    onVideoShopping?: (product: any) => void;
  } | null;
  onTryOn: () => void;
}

export function ProductDetail({ isOpen, onClose, product, onTryOn }: ProductDetailProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [is3DTryOnOpen, set3DTryOnOpen] = useState(false);

  if (!isOpen || !product) return null;

  const allImages = product.images || [product.image];

  const renderStars = () => {
    const fullStars = Math.floor(product.rating);
    const hasHalfStar = product.rating % 1 !== 0;
    
    return (
      <div className="flex gap-2 items-center">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-[20px]">
              {i < fullStars ? (
                <span className="text-[#d4a574]">★</span>
              ) : i === fullStars && hasHalfStar ? (
                <span className="text-[#d4a574]">★</span>
              ) : (
                <span className="text-[#ecbd9f]">★</span>
              )}
            </span>
          ))}
        </div>
        <p className="font-['Montserrat'] text-[#7c563d] text-[16px]">
          {product.rating} ({product.reviewCount} reviews)
        </p>
      </div>
    );
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-7xl h-[90vh] bg-[#fcf5f1] rounded-3xl overflow-hidden shadow-2xl m-8">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-8 py-6 bg-[#fcf5f1] border-b border-[#ecbd9f]">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-[#7c563d] hover:text-[#6a4a33] transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
            <span className="font-['Montserrat'] font-medium">Back to Products</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#7c563d]/10 transition-colors"
          >
            <X className="w-6 h-6 text-[#7c563d]" />
          </button>
        </div>

        {/* Content */}
        <div className="h-full pt-24 pb-8 px-8 overflow-y-auto">
          <div className="grid grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Left: Image Gallery */}
            <div className="space-y-6">
              {/* Main Image */}
              <div className="relative aspect-square bg-white rounded-3xl overflow-hidden shadow-lg">
                <img
                  src={allImages[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-contain p-8"
                />
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg"
                    >
                      <ChevronLeft className="w-6 h-6 text-[#7c563d]" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg"
                    >
                      <ChevronRight className="w-6 h-6 text-[#7c563d]" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Images */}
              {allImages.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {allImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square bg-white rounded-2xl overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index
                          ? "border-[#7c563d] shadow-lg"
                          : "border-transparent hover:border-[#ecbd9f]"
                      }`}
                    >
                      <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-contain p-2" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Details */}
            <div className="space-y-8">
              {/* Title & Rating */}
              <div className="space-y-4">
                <h1 className="font-['Playfair_Display'] text-[#2a120a] text-[48px] leading-tight">
                  {product.name}
                </h1>
                {renderStars()}
              </div>

              {/* Price Section */}
              <div className="space-y-4">
                {/* Save and Discount Badge */}
                <div className="flex items-center gap-4">
                  <button className="text-[#7c563d] hover:text-[#6a4a33] transition-colors font-['Montserrat'] font-medium">
                    Save
                  </button>
                  <div className="bg-[#7c563d] text-[#fcf5f1] px-4 py-2 rounded-lg font-['Montserrat'] font-medium">
                    ₹5,000 off
                  </div>
                </div>

                {/* Price Display */}
                <div className="space-y-2">
                  <div className="flex items-baseline gap-4">
                    <p className="font-['Playfair_Display'] text-[#7c563d] text-[40px]">
                      {product.price || "₹45,999"}
                    </p>
                    {product.originalPrice && (
                      <>
                        <p className="font-['Montserrat'] text-[#8a7b73] text-[24px] line-through">
                          {product.originalPrice}
                        </p>
                        <p className="font-['Montserrat'] text-[#7c563d] text-[18px]">
                          21% off
                        </p>
                      </>
                    )}
                  </div>
                  <p className="font-['Montserrat'] text-[#7c563d] text-[14px]">
                    MRP Incl. of all taxes
                  </p>
                </div>
              </div>

              {/* Bank Offers */}
              <div className="space-y-4">
                <h3 className="font-['Playfair_Display'] text-[#2a120a] text-[24px]">Available Offers</h3>
                <div className="space-y-3">
                  {[
                    "5% cashback on Axis Bank Flipkart Debit Card up to ₹750",
                    "5% cashback on Flipkart SBI Credit Card up to ₹4,000 per calendar quarter",
                    "10% off up to ₹750 on SBI Credit Card Transactions of ₹4,990 and above",
                    "Special Price: Get extra ₹5000 off"
                  ].map((offer, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 flex-shrink-0 mt-1">
                        <svg viewBox="0 0 20 20" fill="none" className="w-full h-full">
                          <path
                            d="M5.833 9.167l3.334 3.166L15 6.667"
                            stroke="#7C563D"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="space-y-1">
                        <p className="font-['Montserrat'] font-medium text-[#7c563d] text-[16px]">
                          Bank Offer
                        </p>
                        <p className="font-['Montserrat'] text-[#a06f4f] text-[14px]">
                          {offer}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <p className="font-['Montserrat'] text-[#7c563d] text-[18px] leading-relaxed">
                {product.description || 
                  "Exquisite handcrafted jewelry piece made with premium materials. Perfect for special occasions or everyday elegance. Each piece is carefully designed to bring out your natural beauty."}
              </p>

              {/* Specifications */}
              <div className="bg-white rounded-2xl p-6 space-y-4">
                <h3 className="font-['Playfair_Display'] text-[#2a120a] text-[24px]">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-['Montserrat'] text-[#8a7b73] text-[14px]">Material</p>
                    <p className="font-['Montserrat'] text-[#7c563d] text-[16px] font-medium">
                      {product.material || "22K Gold"}
                    </p>
                  </div>
                  <div>
                    <p className="font-['Montserrat'] text-[#8a7b73] text-[14px]">Purity</p>
                    <p className="font-['Montserrat'] text-[#7c563d] text-[16px] font-medium">
                      {product.purity || "BIS Hallmarked"}
                    </p>
                  </div>
                  <div>
                    <p className="font-['Montserrat'] text-[#8a7b73] text-[14px]">Weight</p>
                    <p className="font-['Montserrat'] text-[#7c563d] text-[16px] font-medium">
                      {product.weight || "12.5 grams"}
                    </p>
                  </div>
                  <div>
                    <p className="font-['Montserrat'] text-[#8a7b73] text-[14px]">Dimensions</p>
                    <p className="font-['Montserrat'] text-[#7c563d] text-[16px] font-medium">
                      {product.dimensions || "2.5 x 1.5 cm"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <p className="font-['Montserrat'] text-[#7c563d] text-[16px] font-medium">Quantity:</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full bg-white border-2 border-[#7c563d] text-[#7c563d] hover:bg-[#7c563d] hover:text-white transition-colors flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="font-['Montserrat'] text-[#7c563d] text-[18px] font-medium w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full bg-white border-2 border-[#7c563d] text-[#7c563d] hover:bg-[#7c563d] hover:text-white transition-colors flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                {product.type === 'CHAINS' ? (
                  <>
                    <button
                      onClick={onTryOn}
                      className="w-full bg-[#7c563d] text-white py-4 px-6 rounded-2xl font-['Montserrat'] font-medium text-[18px] hover:bg-[#6a4a33] transition-colors shadow-lg flex items-center justify-center gap-3"
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Try On 2D
                    </button>
                    
                    <button
                      onClick={() => set3DTryOnOpen(true)}
                      className="w-full bg-gradient-to-r from-[#7c563d] to-[#a06f4f] text-white py-4 px-6 rounded-2xl font-['Montserrat'] font-medium text-[18px] hover:opacity-90 transition-opacity shadow-lg flex items-center justify-center gap-3"
                    >
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      Try On 3D
                    </button>
                  </>
                ) : (
                  <button
                    onClick={onTryOn}
                    className="w-full bg-[#7c563d] text-white py-4 px-6 rounded-2xl font-['Montserrat'] font-medium text-[18px] hover:bg-[#6a4a33] transition-colors shadow-lg flex items-center justify-center gap-3"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Try On Now
                  </button>
                )}

                <button 
                  onClick={() => {
                    // Navigate to video shopping page with product details
                    if (product && product.onVideoShopping) {
                      product.onVideoShopping(product);
                    }
                  }}
                  className="w-full bg-gradient-to-r from-[#7c563d] to-[#a06f4f] text-white py-4 px-6 rounded-2xl font-['Montserrat'] font-medium text-[18px] hover:opacity-90 transition-opacity shadow-lg flex items-center justify-center gap-3"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Video Shopping
                </button>

                <div className="flex gap-4">
                  <button className="flex-1 bg-white border-2 border-[#ecbd9f] text-[#7c563d] py-3 px-6 rounded-2xl font-['Montserrat'] font-medium hover:bg-[#7c563d]/5 transition-colors flex items-center justify-center gap-2">
                    <Heart className="w-5 h-5" />
                    Wishlist
                  </button>
                  <button className="flex-1 bg-white border-2 border-[#ecbd9f] text-[#7c563d] py-3 px-6 rounded-2xl font-['Montserrat'] font-medium hover:bg-[#7c563d]/5 transition-colors flex items-center justify-center gap-2">
                    <Share2 className="w-5 h-5" />
                    Share
                  </button>
                </div>
              </div>

              {/* Features */}
              <div className="bg-[#f6e1d2]/30 rounded-2xl p-6 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#7c563d] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-[12px]">✓</span>
                  </div>
                  <p className="font-['Montserrat'] text-[#7c563d] text-[14px]">
                    Free shipping on orders above ₹50,000
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#7c563d] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-[12px]">✓</span>
                  </div>
                  <p className="font-['Montserrat'] text-[#7c563d] text-[14px]">
                    30-day easy returns & exchange
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#7c563d] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-[12px]">✓</span>
                  </div>
                  <p className="font-['Montserrat'] text-[#7c563d] text-[14px]">
                    BIS Hallmarked & certified authentic
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Products */}
          <div className="mt-16 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="font-['Playfair_Display'] text-[#7c563d] text-[40px]">
                Similar Products
              </h2>
              <button className="font-['Montserrat'] text-[#a06f4f] text-[18px] underline decoration-1 underline-offset-4">
                View all
              </button>
            </div>
            
            <div className="grid grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-[#fcf8f6] rounded-2xl overflow-hidden border border-[#ecbd9f] group"
                >
                  <div className="aspect-square bg-white p-6">
                    <img
                      src={allImages[0]}
                      alt="Similar product"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="p-4 space-y-4">
                    <h3 className="font-['Montserrat'] text-[#7c563d] text-[16px] font-medium">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <button
                        className="p-2 rounded-lg border-2 border-[#7c563d] group-hover:bg-[#7c563d] transition-colors"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="w-5 h-5 text-[#7c563d] group-hover:text-white transition-colors"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                      <button
                        className="px-4 py-2 bg-[#7c563d] text-white rounded-lg font-['Montserrat'] font-medium text-[14px] flex items-center gap-2"
                        onClick={() => onTryOn()}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        Try On
                      </button>
                    </div>
                  </div>
                </div>
              
          
          ))}

      {/* Snapchat WebAR Modal */}
      <SnapWebAR
        isOpen={is3DTryOnOpen}
        onClose={() => set3DTryOnOpen(false)}
        lensId="e15b37c8-de14-4996-82b6-746c3f5091fe"
        productName={product?.name || ""}
      />
    </div>
  </div>
  </div>
  </div>
  </div>
  );
}
