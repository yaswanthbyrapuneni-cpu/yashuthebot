// src/components/VideoInstructionsModal.tsx
import React from "react";
import { X } from "lucide-react";

interface VideoInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc?: string;
}

export const VideoInstructionsModal: React.FC<VideoInstructionsModalProps> = ({
  isOpen,
  onClose,
  videoSrc = "/assets/instructions.mp4", // default path
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <div 
        className="relative w-[90vw] max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          aria-label="Close video"
        >
          <X className="w-8 h-8 text-white" />
        </button>

        {/* Video Player */}
        <video
          className="w-full rounded-lg shadow-2xl"
          controls
          autoPlay
          src={videoSrc}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};