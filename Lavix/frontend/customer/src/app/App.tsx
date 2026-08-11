import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Home } from "./pages/Home";
import LandingPage from "./pages/LandingPage";
import { MensCollection } from "./pages/MensCollection";
import { WomensCollection } from "./pages/WomensCollection";
import { MensProductDetails } from "./pages/MensProductDetails";
import { WomensProductDetails } from "./pages/WomensProductDetails";
import { MensVirtualTryOn } from "./pages/MensVirtualTryOn";
import { WomensVirtualTryOn } from "./pages/WomensVirtualTryOn";
import { CameraViewPage } from "./pages/CameraViewPage";
import { AdminPage } from "./pages/AdminPage";
import { GarmentDetailsPage } from "./pages/GarmentDetailsPage";
import SecurityMonitor from "./components/SecurityMonitor";
import { SecurityBlackScreen } from "./components/SecurityBlackScreen";
import { IdleDetector } from "./components/IdleDetector";

export default function App() {
  const [securityMonitoring, setSecurityMonitoring] = useState(false);
  const [isManualOverride, setIsManualOverride] = useState(false);

  const handleSecurityStateChange = (isMonitoring: boolean, isOverride: boolean) => {
    setSecurityMonitoring(isMonitoring);
    setIsManualOverride(isOverride);
  };

  return (
    <BrowserRouter basename="/tryon">
      <SecurityMonitor
        isActive={true}
        onSecurityStateChange={handleSecurityStateChange}
      />
      <IdleDetector />
      
      {securityMonitoring && (
        <SecurityBlackScreen
          isManualOverride={isManualOverride}
          onDisabled={() => setSecurityMonitoring(false)}
        />
      )}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/mens" element={<MensCollection />} />
        <Route path="/womens" element={<WomensCollection />} />
        <Route path="/mens/:id" element={<MensProductDetails />} />
        <Route path="/womens/:id" element={<WomensProductDetails />} />
        <Route path="/garment/:id" element={<GarmentDetailsPage />} />
        <Route path="/mens/:id/camera" element={<MensVirtualTryOn />} />
        <Route path="/womens/:id/camera" element={<WomensVirtualTryOn />} />
        <Route path="/garment/:id/camera" element={<WomensVirtualTryOn />} />
        <Route path="/mens/:id/camera/camera-view" element={<CameraViewPage category="Mens Collection" categoryLink="/mens" />} />
        <Route path="/womens/:id/camera/camera-view" element={<CameraViewPage category="Womens Collection" categoryLink="/womens" />} />
        <Route path="/garment/:id/camera/camera-view" element={<CameraViewPage category="Garments Collection" categoryLink="/home" />} />
      </Routes>
    </BrowserRouter>
  );
}
