import { useState } from "react";
import svgPaths from "./svg-2iy52myn9q";

function Logo() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0" data-name="logo">
      <p className="font-['Playfair_Display:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[#2a120a] text-[60px] text-nowrap whitespace-pre">Alankara AI</p>
    </div>
  );
}

function SearchIcon() {
  return (
    <div className="relative shrink-0 size-[64px]" data-name="Search Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64 64">
        <g id="Search Icon">
          <path d={svgPaths.p1b92c370} id="Icon" stroke="var(--stroke-0, #7C563D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" />
        </g>
      </svg>
    </div>
  );
}

function SearchContainer() {
  return (
    <div className="content-stretch flex gap-[48px] items-center relative shrink-0" data-name="Search Container">
      <SearchIcon />
    </div>
  );
}

function LogOut01() {
  return (
    <div className="relative shrink-0 size-[64px]" data-name="log-out-01">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64 64">
        <g id="log-out-01">
          <path d={svgPaths.p9897f40} id="Icon" stroke="var(--stroke-0, #7C563D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5.33333" />
        </g>
      </svg>
    </div>
  );
}

function VideoTutorialIcon({ onClick }: { onClick: () => void }) {
  return (
    <div 
      className="relative shrink-0 size-[64px] cursor-pointer hover:opacity-80 transition-opacity" 
      data-name="video-tutorial"
      onClick={onClick}
      title="How to use Virtual Try-On"
    >
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64 64">
        <g id="video-tutorial">
          <circle cx="32" cy="32" r="28" stroke="#7C563D" strokeWidth="5" />
          <path d="M26 22L42 32L26 42V22Z" fill="#7C563D" />
        </g>
      </svg>
    </div>
  );
}

interface VideoTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function VideoTutorialModal({ isOpen, onClose }: VideoTutorialModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[#fcf5f1] rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#f6e1d2] px-8 py-6 flex justify-between items-center border-b-4 border-[#eaecf0] rounded-t-2xl">
          <div>
            <h2 className="font-['Playfair_Display'] text-[#2a120a] text-3xl font-semibold">
              How to Use Virtual Try-On
            </h2>
            <p className="font-['Montserrat'] text-[#7c563d] text-sm mt-1">
              Watch this quick tutorial to get started
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-full bg-[#7c563d] hover:bg-[#6a4a33] transition-colors"
            aria-label="Close tutorial"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Video Section */}
        <div className="p-8">
          <div className="aspect-video bg-black rounded-xl overflow-hidden mb-6">
            <video 
              className="w-full h-full"
              controls
              autoPlay
              poster="/video-thumbnail.jpg"
            >
              <source src="/tutorial-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Instructions */}
          <div className="space-y-6">
            <div>
              <h3 className="font-['Playfair_Display'] text-[#2a120a] text-2xl font-semibold mb-4">
                Quick Start Guide
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#7c563d] text-white rounded-full flex items-center justify-center font-semibold">
                    1
                  </div>
                  <div>
                    <h4 className="font-['Montserrat'] font-semibold text-[#2a120a] mb-1">
                      Allow Camera Access
                    </h4>
                    <p className="font-['Montserrat'] text-[#7c563d] text-sm">
                      Click "Allow" when prompted to give the kiosk access to your camera
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#7c563d] text-white rounded-full flex items-center justify-center font-semibold">
                    2
                  </div>
                  <div>
                    <h4 className="font-['Montserrat'] font-semibold text-[#2a120a] mb-1">
                      Position Yourself
                    </h4>
                    <p className="font-['Montserrat'] text-[#7c563d] text-sm">
                      Stand approximately 2-3 feet from the screen. Make sure your face and neck are clearly visible
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#7c563d] text-white rounded-full flex items-center justify-center font-semibold">
                    3
                  </div>
                  <div>
                    <h4 className="font-['Montserrat'] font-semibold text-[#2a120a] mb-1">
                      Try On Jewelry
                    </h4>
                    <p className="font-['Montserrat'] text-[#7c563d] text-sm">
                      Select any jewelry piece to see how it looks on you in real-time
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#7c563d] text-white rounded-full flex items-center justify-center font-semibold">
                    4
                  </div>
                  <div>
                    <h4 className="font-['Montserrat'] font-semibold text-[#2a120a] mb-1">
                      Explore & Enjoy
                    </h4>
                    <p className="font-['Montserrat'] text-[#7c563d] text-sm">
                      Turn your head, move around, and see the jewelry from different angles
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips Section */}
            <div className="bg-[#f6e1d2] rounded-xl p-6 border-2 border-[#ecbd9f]">
              <h4 className="font-['Playfair_Display'] text-[#2a120a] text-xl font-semibold mb-3">
                💡 Pro Tips
              </h4>
              <ul className="space-y-2 font-['Montserrat'] text-[#7c563d] text-sm">
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Ensure good lighting for the best experience</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Remove glasses or hats for better face detection</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Keep your hair away from your face for earrings</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Try multiple angles to see how the jewelry looks</span>
                </li>
              </ul>
            </div>

            {/* Close Button */}
            <div className="flex justify-center pt-4">
              <button
                onClick={onClose}
                className="px-8 py-3 bg-[#7c563d] hover:bg-[#6a4a33] text-white rounded-xl font-['Montserrat'] font-semibold transition-colors shadow-lg"
              >
                Got it! Let's Start
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame217({ onVideoTutorialClick }: { onVideoTutorialClick: () => void }) {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0">
      <SearchContainer />
      <VideoTutorialIcon onClick={onVideoTutorialClick} />
      <LogOut01 />
    </div>
  );
}

export default function Header() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <>
      <div className="bg-[#f6e1d2] relative size-full" data-name="Header">
        <div aria-hidden="true" className="absolute border-[#eaecf0] border-[0px_0px_4px] border-solid inset-0 pointer-events-none" />
        <div className="flex flex-row items-center size-full">
          <div className="box-border content-stretch flex items-center justify-between px-[96px] py-[48px] relative size-full">
            <Logo />
            <Frame217 onVideoTutorialClick={() => setIsVideoModalOpen(true)} />
          </div>
        </div>
      </div>

      <VideoTutorialModal 
        isOpen={isVideoModalOpen} 
        onClose={() => setIsVideoModalOpen(false)} 
      />
    </>
  );
}