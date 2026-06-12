import { useEffect } from 'react';
import { X } from "lucide-react";

declare global {
  interface Window {
    SnapKitInit: any;
    snapKitCamera: {
      startWithLens: (config: {
        lensID: string;
        containerId: string;
        accessToken: string;
        clientId: string;
        onClose: () => void;
        onError: (error: any) => void;
      }) => void;
      close: () => void;
    };
  }
}

const CAMERA_KIT_API_TOKEN = "eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzYxMDM1NTg3LCJzdWIiOiJhOWJiYWI0My05YjEwLTQwMDktYjRjMy00MjJmYjIyMzRiOWZ-U1RBR0lOR342NDQyZDRhZi05YmNjLTQ0ZWMtYWQ3Ni1iOTBjYWFmMjVhNGUifQ._vBBcrt_LEOxPvS1u_INf4AeYTqTsgoeZSloyLRXNmU";
const CLIENT_ID = "2bd2dc45-cea6-4f0d-ab91-8edbdc751629";

interface SnapCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  lensId: string;
  productName: string;
}

export function SnapCameraModal({ isOpen, onClose, lensId, productName }: SnapCameraModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Load Snap Camera Kit SDK
      const script = document.createElement('script');
      script.src = 'https://camera-kit.snapchat.com/sdk/js/v1.0.0.js';
      script.async = true;
      script.onload = () => {
        window.SnapKitInit = {
          init: function() {
            try {
              window.snapKitCamera.startWithLens({
                lensID: lensId,
                containerId: 'snapkit-camera-modal',
                clientId: CLIENT_ID,
                accessToken: CAMERA_KIT_API_TOKEN,
                onClose: () => {
                  console.log('Camera closed');
                  onClose();
                },
                onError: (err: any) => {
                  console.error('Snap Camera Error:', err);
                  // Show error UI to user
                  const container = document.getElementById('snapkit-camera-modal');
                  if (container) {
                    container.innerHTML = `
                      <div class="flex flex-col items-center justify-center h-full text-[#7c563d]">
                        <p class="font-['Montserrat'] text-lg">Failed to load camera experience</p>
                        <button 
                          class="mt-4 px-6 py-2 bg-[#7c563d] text-white rounded-lg font-['Montserrat']"
                          onclick="window.location.reload()"
                        >
                          Retry
                        </button>
                      </div>
                    `;
                  }
                }
              });
            } catch (error) {
              console.error('Failed to initialize camera:', error);
            }
          }
        };
      };
      document.body.appendChild(script);

      return () => {
        // Remove the script
        const existingScript = document.querySelector('script[src*="camera-kit.snapchat.com"]');
        if (existingScript && existingScript.parentNode) {
          existingScript.parentNode.removeChild(existingScript);
        }
        // Cleanup Snap Camera
        if (window.snapKitCamera) {
          window.snapKitCamera.close();
        }
      };
    }
  }, [isOpen, lensId, onClose]);

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

        {/* Snap Camera Container */}
        <div 
          id="snapkit-camera-modal"
          className="w-full h-full"
        />

        {/* Loading State */}
        <div className="absolute inset-0 flex items-center justify-center bg-[#fcf5f1]">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#7c563d] border-t-transparent" />
            <p className="font-['Montserrat'] text-[#7c563d]">Loading Camera...</p>
          </div>
        </div>
      </div>
    </div>
  );
}