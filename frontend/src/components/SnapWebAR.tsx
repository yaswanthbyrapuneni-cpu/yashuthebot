import { X } from "lucide-react";
import { useEffect, useRef } from "react";

interface SnapWebARProps {
  isOpen: boolean;
  onClose: () => void;
  lensId: string;
  productName: string;
}

export function SnapWebAR({ isOpen, onClose, lensId, productName }: SnapWebARProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Handle iframe initialization or cleanup if needed
    if (isOpen && iframeRef.current) {
      // You can add any initialization code here
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-11/12 aspect-[3/4] bg-[#fcf5f1] rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-8 py-6 bg-gradient-to-b from-black/50 to-transparent">
          <div>
            <h2 className="font-['Playfair_Display'] text-white text-3xl">3D Try-On</h2>
            <p className="font-['Montserrat'] text-white/80 text-sm mt-1">{productName}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* WebAR Content */}
        <iframe
          ref={iframeRef}
          src={`https://lens.snapchat.com/experience/${lensId}`}
          className="w-full h-full border-0"
          allow="camera; microphone; accelerometer; gyroscope; magnetometer"
          allowFullScreen
        />

        {/* Optional: Loading State */}
        <div className="absolute inset-0 flex items-center justify-center bg-[#fcf5f1] pointer-events-none transition-opacity duration-500" 
             style={{ opacity: 0 }}>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#7c563d] border-t-transparent" />
        </div>
      </div>
    </div>
  );
}