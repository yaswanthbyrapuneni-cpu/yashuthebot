import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Camera as CameraIcon } from "lucide-react";
import { Header } from "../components/Header";

interface VirtualTryOnPageProps {
  category: string;
  categoryLink: string;
  productName: string;
  image: string;
  relatedProducts: {
    id: number;
    name: string;
    image: string;
  }[];
}

export function VirtualTryOnPage({
  category,
  categoryLink,
  productName,
  image,
  relatedProducts,
}: VirtualTryOnPageProps) {
  const navigate = useNavigate();

  useEffect(() => {
    // Navigate immediately to the camera view when this page mounts
    navigate("camera-view");
    return () => {};
  }, [navigate]);

  return (
    <div className="bg-[#f6f6f6] min-h-screen flex flex-col items-center w-full font-['Clash_Display',sans-serif]">
      <Header />

      <div className="w-full max-w-[2000px] px-8 md:px-[64px] py-[24px] flex flex-col items-center">
        
        {/* Breadcrumbs */}
        <div className="w-full flex items-center gap-[16px] text-[24px] font-medium mb-[64px] overflow-x-auto whitespace-nowrap justify-start">
          <Link to="/home" className="text-[#b1b1b1] hover:text-black transition-colors">Home</Link>
          <span className="text-[#b1b1b1]">/</span>
          <Link to={categoryLink} className="text-[#b1b1b1] hover:text-black transition-colors">{category}</Link>
          <span className="text-[#b1b1b1]">/</span>
          <span className="text-black font-['Clash_Display:Light',sans-serif]">{productName}</span>
          <span className="text-black">/ Virtual Try On</span>
        </div>

        {/* Main Image Container */}
        <div className="w-full max-w-[2041px] flex flex-col items-center relative mb-[64px]">
          <div className="w-full aspect-[4/3] md:aspect-video lg:aspect-[2041/1638] rounded-[30px] overflow-hidden border-[10px] border-black relative bg-[#e2ded9]">
            <img src={image} alt="Try On Target" className="w-full h-full object-cover object-center scale-[1.15]" />
          </div>
        </div>

      </div>
    </div>
  );
}
