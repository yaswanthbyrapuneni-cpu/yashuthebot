import offerBanner1 from "../../assets/offer_banner.png";

export function OfferBanners() {
  return (
    <div className="w-full max-w-[1786px] px-2 mb-12 mt-8">
      <div className="text-center mb-6">
        <span className="text-xs uppercase tracking-widest text-[#938f96] font-semibold">Special Offers</span>
        <h3 className="text-2xl md:text-3xl font-medium text-black mt-1">Deals of the Day</h3>
      </div>

      <div className="relative overflow-hidden rounded-[20px] shadow-md w-full">
        <img
          src={offerBanner1}
          alt="Sarees & Shirts Special Offer - Up to 40% Off"
          className="w-full h-auto object-cover rounded-[20px]"
          style={{ aspectRatio: "1786/689" }}
        />
      </div>
    </div>
  );
}
