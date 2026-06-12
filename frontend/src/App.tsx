// src/App.tsx
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import Lottie from "lottie-react";
import aiChatBotAnimation from "./assets/ai chat bot.json";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { Toaster } from "sonner@2.0.3";
import { CategoryCard } from "./components/CategoryCard";
import { CategoryDropdown } from "./components/CategoryDropdown";
import { IdleAd } from "./components/IdleAd";
import { ProductCard } from "./components/ProductCard";
import { ProductDetail } from "./components/ProductDetail";
import { SearchModal } from "./components/SearchModal";
import { VirtualTryOn } from "./components/VirtualTryOn";
import { CustomerSupportModal } from "./components/CustomerSupportModal";
import { VideoInstructionsModal } from "./components/VideoInstructionsModal";
import { SecurityBlackScreen } from "./components/SecurityBlackScreen";
import SecurityMonitor from "./components/SecurityMonitor";
import AlankaraAiDashboard from "./imports/AdminAiDashboard";
import { ProductPage } from "./imports/ProductPage";
import headerSvgPaths from "./imports/svg-2iy52myn9q";
import { getDetectorForJewelry } from "./utils/detector-mapper";
import { trackVisitor } from "./utils/visitor-tracking";
import { supabase } from "./client";
import Login from "./components/login";
import ProfileSetup from "./components/ProfileSetup";
import ProfileDropdown from "./components/ProfileDropdown";
import { MyTryOns } from "./components/MyTryOns";
import { Wishlist } from "./components/Wishlist";
import { Offers } from "./components/Offers";
import { Settings } from "./components/Settings";

// Assuming these image imports resolve correctly via your bundler (Vite alias)
import imgCatMangalsutra from "figma:asset/19f75d718df8ede7167628d5393f1d27667f8713.png";
import imgRectangle7 from "figma:asset/2235823097710444c6aa28fa04e48c2a27202094.png";
import imgVector3 from "figma:asset/3c0fefa1a462fc424307776078ef40e23596d3fa.png";
import imgCatRings from "figma:asset/3f11ce12997d9c6313379b839bd614ec3b6475b6.png";
import imgVector2 from "figma:asset/44c0fe7f60207bc68596839df3eba740a215d24a.png";
import imgLuxuryBackgroundGoldGradientDesign2 from "figma:asset/5bd91f872e7c1f8cc8a9b57a10c2e5503ecca26c.png";
import imgRectangle9 from "figma:asset/850551b45815c75661657b884ccce2af4ad5f0bc.png";
import imgCatEarrings from "figma:asset/9558e0c846f30c8aa5939cc9c165ba28bc0f9e1e.png";
import imgCatPendants from "figma:asset/ad763c2921c25a0c844c255968e7b2a8dcf029cb.png";
import imgVector from "figma:asset/b2ea6722d0036ab90e69d8abcda355acfd3c0cbb.png";
import imgVector5 from "figma:asset/ddfacdaa0a5604851834c98b66dd054d207ec8c8.png";
import imgVector1 from "figma:asset/e49d9dee72723fd8bdbe1c51ea7be3d43cf4de7b.png";
import imgImage34 from "figma:asset/e5c0b02830cff12b38961d729bb34cb8e1126e2c.png";
import imgImage35 from "figma:asset/f5575d8f5c5073585466226b821f83044ac2feb2.png";
import imgVector4 from "figma:asset/f6cad553f57d1dc208b2c4d61a95cfc7a46ccbf8.png";
import imgCatChains from "figma:asset/fc9e0fb363ea50f06254f1ce635653bee6dab4c1.png";
import imgNecklace1 from "./assets/1.png";
import imgNecklace2 from "./assets/2.png";
import imgNecklace3 from "./assets/3.png";
import imgNecklace6 from "./assets/6.png";
import imgHaram from "./assets/haram.png";
import imgManpathi from "./assets/manpathi.png";
import imgRing from "./assets/ring.png";
import banner1 from './assets/banner.png';
import banner2 from './assets/banner2.png';
import banner3 from './assets/banner3.png';
import banner4 from './assets/banner4.png';
import instructionsVideo from './assets/instructions.mp4';
import imgNecklace205 from "./assets/output.png";
import imgNecklace206 from "./assets/try1.png";
import imgNecklace207 from "./assets/qwe1.png";
import imgNecklace208 from "./assets/output33.png";
import imgNecklace209 from "./assets/peacock1.png";
import imgNecklace210 from "./assets/necklace234.png";
import imgNecklace211 from "./assets/necklace890.png";
import imgNecklace212 from "./assets/step1.png";
import imgNecklace213 from "./assets/new12.png"; 

export default function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Profile state
  const [userProfileName, setUserProfileName] = useState<string>("Guest User");
  const [userProfileEmail, setUserProfileEmail] = useState<string>("");
  
  const [activeCategory, setActiveCategory] = useState("Gold");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [carouselProgress, setCarouselProgress] = useState(0);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [showMyTryOns, setShowMyTryOns] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showOffers, setShowOffers] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Auto-rotate banner images every 3 seconds
  useEffect(() => {
    const bannerDuration = 3000;
    const rotationTimer = setInterval(() => {
      nextCarousel();
    }, bannerDuration);

    return () => clearInterval(rotationTimer);
  }, []);
  
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<"Women" | "Men" | "Kids">("Women");
  const [showVideoShopping, setShowVideoShopping] = useState(false);
  const [videoShoppingProduct, setVideoShoppingProduct] = useState<any>(null);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [activeAd, setActiveAd] = useState(0);
  const [adProgress, setAdProgress] = useState(0);
  
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [currentUserPhone, setCurrentUserPhone] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('[App] Error checking session:', error);
          return;
        }
        
        if (session?.user) {
          console.log('[App] Found existing session for user:', session.user.id);
          setCurrentUserId(session.user.id);
          setCurrentUserEmail(session.user.email || null);
          setCurrentUserPhone(session.user.phone || null);
          setIsAuthenticated(true);
          
          // Load profile
          try {
            const { data, error: profileError } = await supabase
              .from('customer_profiles')
              .select('full_name, email, phone_number')
              .eq('id', session.user.id)
              .single();
            
            if (!profileError && data) {
              console.log('[App] Profile loaded:', data.full_name);
              setUserProfileName(data.full_name || "Guest User");
              setUserProfileEmail(data.email || session.user.email || "");
            }
          } catch (err) {
            console.error('[App] Error loading profile from session:', err);
          }
        } else {
          console.log('[App] No existing session found');
        }
      } catch (err) {
        console.error('[App] Error in checkSession:', err);
      }
    };
    
    checkSession();
  }, []);

  // Load user profile data
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!isAuthenticated || !currentUserId) return;
      
      try {
        const { data, error } = await supabase
          .from('customer_profiles')
          .select('full_name, email, phone_number')
          .eq('id', currentUserId)
          .single();
        
        if (error) {
          console.error('[App] Error loading profile:', error);
          return;
        }
        
        if (data) {
          setUserProfileName(data.full_name || "Guest User");
          setUserProfileEmail(data.email || currentUserEmail || "");
        }
      } catch (err) {
        console.error('[App] Error in loadUserProfile:', err);
      }
    };
    
    loadUserProfile();
  }, [isAuthenticated, currentUserId]);

  // Auto-rotate video playlists every 5 minutes
  useEffect(() => {
    const adDuration = 300000;
    const progressInterval = 1000;
    let progressTimer: NodeJS.Timeout;
    let rotationTimer: NodeJS.Timeout;

    const updateProgress = () => {
      setAdProgress(prev => {
        if (prev >= 100) {
          return 0;
        }
        return prev + (100 * progressInterval / adDuration);
      });
    };

    const rotateAd = () => {
      setActiveAd(prev => (prev + 1) % 2);
      setAdProgress(0);
    };

    progressTimer = setInterval(updateProgress, progressInterval);
    rotationTimer = setInterval(rotateAd, adDuration);
    setAdProgress(0);

    return () => {
      clearInterval(progressTimer);
      clearInterval(rotationTimer);
    };
  }, [activeAd]);
  
  const [tryOnModal, setTryOnModal] = useState<{ isOpen: boolean; product: any }>({
    isOpen: false,
    product: null
  });
  const [productDetail, setProductDetail] = useState<{ isOpen: boolean; product: any }>({
    isOpen: false,
    product: null
  });
  const [multiTryOnModal, setMultiTryOnModal] = useState<{ isOpen: boolean; products: any[] }>({
    isOpen: false,
    products: []
  });

  // Security-related state
  const [securityModeActive, setSecurityModeActive] = useState(false);
  const [isManualOverride, setIsManualOverride] = useState(false);
  const kioskId = import.meta.env.VITE_KIOSK_ID || 'KIOSK_001';
  const [isSecurityMonitoring, setIsSecurityMonitoring] = useState(false);
  
  // Track visitor on mount
  useEffect(() => {
    trackVisitor();
  }, []);

  // Monitor security settings from database
  useEffect(() => {
    const checkSecurityMode = async () => {
      try {
        const { data, error } = await supabase
          .from('security_settings')
          .select('*')
          .eq('kiosk_id', kioskId)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('[App] Error fetching security settings:', error);
          return;
        }

        if (!data) {
          console.log('[App] No security settings found');
          setSecurityModeActive(false);
          return;
        }

        console.log('[App] Security settings loaded:', data);

        if (!data.security_mode_enabled) {
          setSecurityModeActive(false);
          setIsManualOverride(false);
          return;
        }

        if (data.manual_override) {
          console.log('[App] Manual override is ON - activating security mode');
          setSecurityModeActive(true);
          setIsManualOverride(true);
          return;
        }

        if (data.auto_mode_enabled) {
          const now = new Date();
          const currentHour = now.getHours();
          const isScheduledTime = currentHour >= 22 || currentHour < 7;
          
          if (isScheduledTime) {
            console.log('[App] Currently in scheduled security hours (10 PM - 7 AM) - activating security mode');
            setSecurityModeActive(true);
            setIsManualOverride(false);
          } else {
            console.log('[App] Outside scheduled security hours - security mode inactive');
            setSecurityModeActive(false);
            setIsManualOverride(false);
          }
        } else {
          setSecurityModeActive(false);
          setIsManualOverride(false);
        }
      } catch (err) {
        console.error('[App] Error in checkSecurityMode:', err);
      }
    };

    checkSecurityMode();

    const channel = supabase
      .channel('security-settings-app')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'security_settings',
          filter: `kiosk_id=eq.${kioskId}`
        },
        (payload) => {
          console.log('[App] Security settings updated in real-time:', payload.new);
          checkSecurityMode();
        }
      )
      .subscribe();

    const intervalId = setInterval(checkSecurityMode, 60000);

    return () => {
      channel.unsubscribe();
      clearInterval(intervalId);
    };
  }, [kioskId]);

  const categories = ["Gold", "Diamond", "Silver", "Book Now"];
  const carouselImages = [banner1, banner2, banner3, banner4];

  const products = {
    trending: [
       { id: 2, name: "Royal Gold Necklace", image: imgVector1, images: [imgVector1, "https://images.unsplash.com/photo-1611012756377-05e2e4269fa3?w=1080", imgVector1], rating: 4.8, reviewCount: 289, type: "NECKLACE", price: "Ã¢â€šÂ¹ 1,25,999", originalPrice: "Ã¢â€šÂ¹ 1,45,999", description: "Stunning gold necklace...", material: "22K Gold", purity: "BIS Hallmarked", weight: "45.2 grams", dimensions: "42 cm length", category: "Trending" },
       { id: 3, name: "Designer Gold Earrings", image: imgVector2, images: [imgVector2, "https://images.unsplash.com/photo-1651328905475-16882e198d54?w=1080", imgVector2], rating: 4.6, reviewCount: 203, type: "EARRINGS", price: "Ã¢â€šÂ¹ 32,999", originalPrice: "Ã¢â€šÂ¹ 38,999", description: "Beautiful handcrafted gold earrings...", material: "22K Gold", purity: "BIS Hallmarked", weight: "12.5 grams", dimensions: "3.5 x 2.0 cm", category: "Trending" },
    ],
    gold: [
      { id: 205, name: "Traditional Gold Ruby Necklace", image: imgNecklace205, images: [imgNecklace205], rating: 4.9, reviewCount: 278, type: "NECKLACE", price: "Ã¢â€šÂ¹ 2,15,999", description: "Exquisite traditional necklace with multi-strand gold bead chains, intricately carved floral pendant with ruby accents, leaf motifs, and pearl drop", material: "22K Gold with Ruby & Pearl", purity: "BIS Hallmarked", weight: "85.2 grams", dimensions: "50 cm length", category: "Gold" },
      { id: 206, name: "Royal Peacock Design Gold Necklace", image: imgNecklace206, images: [imgNecklace206], rating: 4.9, reviewCount: 345, type: "NECKLACE", price: "Ã¢â€šÂ¹ 3,25,999", description: "Stunning peacock-inspired choker with layered mango motifs, ruby and emerald stone work, pearl droplets, and central teardrop pendant with pearl drop", material: "22K Gold with Ruby, Emerald & Pearl", purity: "BIS Hallmarked", weight: "95.8 grams", dimensions: "42 cm length", category: "Gold" },
      { id: 207, name: "Antique Kundan Choker Necklace", image: imgNecklace207, images: [imgNecklace207], rating: 4.8, reviewCount: 289, type: "NECKLACE", price: "Ã¢â€šÂ¹ 2,95,999", description: "Opulent antique-finish choker with intricate filigree work, emerald and ruby cabochons, gold bead strands, and ruby bead drop embellishments", material: "22K Gold with Emerald & Ruby", purity: "BIS Hallmarked", weight: "102.5 grams", dimensions: "38 cm length", category: "Gold" },
      { id: 208, name: "Temple Lakshmi Gold Long Necklace", image: imgNecklace208, images: [imgNecklace208], rating: 4.9, reviewCount: 267, type: "NECKLACE", price: "Ã¢â€šÂ¹ 2,45,999", description: "Traditional temple jewelry long necklace with mesh chain work, circular coin motifs, ruby accents, Lakshmi pendant, and ruby bead danglers", material: "22K Gold with Ruby", purity: "BIS Hallmarked", weight: "88.3 grams", dimensions: "65 cm length", category: "Gold" },
      { id: 209, name: "Peacock Enamel Gold Ball Necklace", image: imgNecklace209, images: [imgNecklace209], rating: 4.7, reviewCount: 198, type: "NECKLACE", price: "Ã¢â€šÂ¹ 1,95,999", description: "Elegant gold ball cluster necklace with red dori, vibrant meenakari peacock centerpiece featuring multicolor enamel work and gold bead accents", material: "22K Gold with Meenakari Enamel", purity: "BIS Hallmarked", weight: "72.8 grams", dimensions: "45 cm length", category: "Gold" },
      { id: 210, name: "Traditional Antique Gold Necklace", image: imgNecklace210, images: [imgNecklace210], rating: 4.8, reviewCount: 234, type: "NECKLACE", price: "Ã¢â€šÂ¹ 2,05,999", description: "Classic antique gold necklace with multi-strand bead chains, circular medallion patterns, ruby and emerald accents, ornate central pendant with gold ball drops", material: "22K Gold with Ruby & Emerald", purity: "BIS Hallmarked", weight: "81.5 grams", dimensions: "46 cm length", category: "Gold" },
      { id: 211, name: "Polki Emerald Pearl Bridal Necklace", image: imgNecklace211, images: [imgNecklace211], rating: 5.0, reviewCount: 412, type: "NECKLACE", price: "Ã¢â€šÂ¹ 4,85,999", description: "Magnificent multi-strand bridal necklace with lustrous pearls, emerald beads, uncut polki diamonds, sunburst ruby pendant with jhumka drop", material: "22K Gold with Polki, Ruby, Emerald & Pearl", purity: "BIS Hallmarked", weight: "125.6 grams", dimensions: "52 cm length", category: "Gold" },
      { id: 212, name: "Antique Emerald Two-Layer Necklace", image: imgNecklace212, images: [imgNecklace212], rating: 4.8, reviewCount: 256, type: "NECKLACE", price: "Ã¢â€šÂ¹ 2,75,999", description: "Stunning two-layered antique necklace with emerald cabochons, intricate spiral filigree work, gold bead embellishments, and ornate pendant with pearl accents", material: "22K Gold with Emerald & Pearl", purity: "BIS Hallmarked", weight: "92.4 grams", dimensions: "48 cm length", category: "Gold" },
      { id: 213, name: "Contemporary Floral Gold Necklace", image: imgNecklace213, images: [imgNecklace213], rating: 4.6, reviewCount: 187, type: "NECKLACE", price: "Ã¢â€šÂ¹ 1,65,999", description: "Modern design necklace with geometric square panels, purple and green gemstone cabochons, gold bead chain, circular loop danglers with floral accents", material: "22K Gold with Amethyst & Emerald", purity: "BIS Hallmarked", weight: "68.7 grams", dimensions: "44 cm length", category: "Gold" },
      { id: 301, name: "Temple Design Haram", image: imgNecklace2, images: [imgNecklace2], rating: 4.9, reviewCount: 287, type: "HARAMS", price: "Ã¢â€šÂ¹ 2,45,999", description: "Magnificent temple-design haram with Lakshmi pendant, layered beadwork in ruby and pearl", material: "22K Gold with Ruby & Pearl", purity: "BIS Hallmarked", weight: "135.8 grams", dimensions: "52 cm length", category: "Gold" },
      { id: 101, name: "Classic Gold Bangles", image: imgVector4, images: [imgVector4], rating: 4.7, reviewCount: 142, type: "BRACELET", price: "Ã¢â€šÂ¹ 85,999", description: "Elegant bangles with diamond accents", material: "22K Gold with Diamonds", weight: "12.5 grams", category: "Gold", metadata: { style: "flexible", material: "gold", test_mode: true } },
      { id: 18, name: "Traditional Gold Haram", image: imgHaram, images: [imgHaram], rating: 4.9, reviewCount: 112, type: "HARAMS", price: "Ã¢â€šÂ¹ 245,999", description: "Exquisite traditional haram with intricate temple design...", material: "22K Gold", weight: "125 grams", category: "Gold" },
      { id: 201, name: "Heritage Gold Necklace", image: imgNecklace1, images: [imgNecklace1], rating: 4.9, reviewCount: 245, type: "NECKLACE", price: "Ã¢â€šÂ¹ 1,35,999", description: "Ornate traditional gold necklace with stunning central pendant featuring intricate goldwork and gemstone accents", material: "22K Gold with Ruby & Emerald", purity: "BIS Hallmarked", weight: "52.5 grams", dimensions: "45 cm length", category: "Gold" },
      { id: 202, name: "Delicate Pearl Necklace", image: imgNecklace6, images: [imgNecklace6], rating: 4.7, reviewCount: 198, type: "NECKLACE", price: "Ã¢â€šÂ¹ 68,999", description: "Elegant necklace with golden floral motifs and pearl drop embellishments", material: "22K Gold with Pearls & Ruby", purity: "BIS Hallmarked", weight: "28.3 grams", dimensions: "40 cm length", category: "Gold" },
      { id: 203, name: "Traditional Gold Necklace", image: imgNecklace3, images: [imgNecklace3], rating: 4.8, reviewCount: 312, type: "NECKLACE", price: "Ã¢â€šÂ¹ 1,85,999", description: "Elaborate traditional necklace with coin designs, gemstone accents, and teardrop pendant", material: "22K Gold with Ruby & Emerald", purity: "BIS Hallmarked", weight: "78.5 grams", dimensions: "48 cm length", category: "Gold" },
      { id: 4, name: "Classic Gold Ring", image: imgRing, images: [imgRing, "https://images.unsplash.com/photo-1670831635481-63aa22ee8439?w=1080"], rating: 4.3, reviewCount: 128, type: "RINGS", price: "Ã¢â€šÂ¹ 38,999", description: "Timeless gold ring...", material: "22K Gold", weight: "6.8 grams", category: "Gold" },
      { id: 5, name: "Traditional Gold Necklace", image: imgVector1, images: [imgVector1, "https://images.unsplash.com/photo-1611012756377-05e2e4269fa3?w=1080"], rating: 4.7, reviewCount: 245, type: "CHAINS", price: "Ã¢â€šÂ¹ 98,999", description: "Heritage-inspired necklace...", material: "22K Gold", weight: "38.5 grams", category: "Gold" },
      { id: 6, name: "Elegant Gold Earrings", image: imgVector2, images: [imgVector2, "https://images.unsplash.com/photo-1651328905475-16882e198d54?w=1080"], rating: 4.5, reviewCount: 187, type: "EARRINGS", price: "Ã¢â€šÂ¹ 28,999", description: "Sophisticated earrings...", material: "22K Gold", weight: "10.2 grams", category: "Gold" },
      { id: 10, name: "Simple Gold Chain", image: imgCatChains, images: [imgCatChains], rating: 4.2, reviewCount: 95, type: "CHAINS", price: "Ã¢â€šÂ¹ 18,500", description: "Classic gold chain...", material: "22K Gold", weight: "5 grams", category: "Gold" },
      { id: 12, name: "Floral Gold Pendant", image: imgCatPendants, images: [imgCatPendants], rating: 4.6, reviewCount: 150, type: "PENDANTS", price: "Ã¢â€šÂ¹ 22,000", description: "Delicate floral pendant...", material: "22K Gold", weight: "4 grams", category: "Gold" },
      { id: 15, name: "Traditional Waist Belt", image: imgLuxuryBackgroundGoldGradientDesign2, images: [imgLuxuryBackgroundGoldGradientDesign2], rating: 4.7, reviewCount: 95, type: "HIPBELT", price: "Ã¢â€šÂ¹78,999", description: "Elegant gold waist belt with intricate design...", material: "22K Gold", weight: "85 grams", category: "Gold" },
      { id: 16, name: "Classic Mathapatti", image: imgManpathi, images: [imgManpathi], rating: 4.9, reviewCount: 78, type: "MATHAPATTI", price: "Ã¢â€šÂ¹ 65,999", description: "Traditional forehead ornament with intricate chain work and center pendant...", material: "22K Gold", weight: "32 grams", category: "Gold" }
    ],
    diamond: [],
    silver: []
  };

  const categoryCards = [
    { id: 1, title: "EARRINGS", image: imgCatEarrings, type: "EARRINGS" },
    { id: 2, title: "RINGS", image: imgCatRings, type: "RINGS" },
    { id: 6, title: "HARAMS", image: imgCatMangalsutra, type: "HARAMS" },
    { id: 3, title: "MANGALSUTRA", image: imgCatMangalsutra, type: "MANGALSUTRA" },
    { id: 4, title: "PENDANTS", image: imgCatPendants, type: "PENDANTS" },
    { id: 5, title: "CHAINS", image: imgCatChains, type: "CHAINS" },
    { id: 7, title: "ACCESSORIES", image: imgLuxuryBackgroundGoldGradientDesign2, type: "ACCESSORIES" }
  ];

  const handleTryOn = (product: any) => {
    if (!product?.type) {
      console.error('[APP] Product type is missing:', product);
      return;
    }

    const detectorType = getDetectorForJewelry(product.type);
    
    const modalState = {
      isOpen: true,
      product: {
        ...product,
        image: Array.isArray(product.images) && product.images.length > 0
          ? product.images[0]
          : product.image
      }
    };

    console.log('[APP] Setting try-on modal with:', {
      type: product.type,
      detectorType
    });

    setTryOnModal(modalState);
  };

  const handleProductClick = (product: any) => {
    setProductDetail({ 
      isOpen: true, 
      product: {
        ...product,
        onVideoShopping: handleVideoShopping
      }
    });
  };

  const handleVideoShopping = (product: any) => {
    setVideoShoppingProduct(product);
    setShowVideoShopping(true);
    setProductDetail({ isOpen: false, product: null });
  };

   const handleDetailTryOn = () => {
     if (productDetail.product) {
       setTryOnModal({ isOpen: true, product: productDetail.product });
       setProductDetail({ isOpen: false, product: null });
     }
   };

  const nextCarousel = () => {
    setCarouselIndex((prev) => (prev + 1) % carouselImages.length);
  };

  const prevCarousel = () => {
    setCarouselIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const handleSubCategorySelect = (subCategory: string) => {
    setSelectedSubCategory(subCategory);
    setShowCategoryDropdown(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setCurrentUserId(null);
    setCurrentUserEmail(null);
    setCurrentUserPhone(null);
    setUserProfileName("Guest User");
    setUserProfileEmail("");
    window.location.href = '/';
  };

  const visibleProducts = React.useMemo(() => {
    let categoryKey = activeCategory.toLowerCase() as keyof typeof products;

    if (!products[categoryKey] || activeCategory === "Book Now") {
      categoryKey = 'trending';
    }

    const currentCategoryProducts = products[categoryKey] || products.trending;

    if (selectedSubCategory) {
      return currentCategoryProducts.filter(
        p => p.type && p.type.toUpperCase() === selectedSubCategory.toUpperCase()
      );
    }

    return currentCategoryProducts;
  }, [activeCategory, selectedSubCategory]);

  if (securityModeActive) {
    return (
      <>
        <SecurityBlackScreen 
          isManualOverride={isManualOverride}
          onDisabled={() => {
            console.log('[App] Security disabled, refreshing interface...');
          }}
        />
        <SecurityMonitor 
          isActive={true}
          onSecurityStateChange={(isMonitoring) => {
            console.log('[App] Security monitoring state changed:', isMonitoring);
          }}
        />
      </>
    );
  }

  if (showVideoShopping) {
    return <ProductPage onBack={() => setShowVideoShopping(false)} product={videoShoppingProduct} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          !isAuthenticated ? (
            <Login onLoginSuccess={() => setIsAuthenticated(true)} />
          ) : showProfileSetup ? (
            <ProfileSetup
              userId={currentUserId!}
              userEmail={currentUserEmail}
              userPhone={currentUserPhone}
              onComplete={async () => {
                setShowProfileSetup(false);
                setIsAuthenticated(true);
                
                // Reload user profile after setup
                try {
                  const { data, error } = await supabase
                    .from('customer_profiles')
                    .select('full_name, email, phone_number')
                    .eq('id', currentUserId!)
                    .single();
                  
                  if (!error && data) {
                    setUserProfileName(data.full_name || "Guest User");
                    setUserProfileEmail(data.email || currentUserEmail || "");
                  }
                    console.log('[App] Profile reloaded after setup:', data.full_name);
                } catch (err) {
                  console.error('[App] Error reloading profile:', err);
                }
              }}
            />
          ) : (
          <>
            <Toaster richColors position="top-center" />
            <CustomerSupportModal 
              isOpen={showSupportModal}
              onClose={() => setShowSupportModal(false)}
              faqs={[
                {
                  question: "How do I reset my password?",
                  answer: "Click on 'Forgot Password' on the login page and follow the instructions."
                },
                {
                  question: "Why am I unable to log in?",
                  answer: "Please check your email and password. If the issue continues, try resetting your password."
                },
                {
                  question: "How can I update my profile?",
                  answer: "After logging in, go to the 'My Profile' section to update your details."
                }
              ]}
            />
            <VideoInstructionsModal
              isOpen={showInstructionsModal}
              onClose={() => setShowInstructionsModal(false)}
              videoSrc={instructionsVideo}
            />
            <IdleAd 
              images={[
                imgImage35,
                imgImage34,
                imgRectangle7,
                imgRectangle9,
                imgVector1
              ]}
              inactivityTimeout={30000}
              slideInterval={5000}
            />
            <div className="bg-[#fcf5f1] content-stretch flex flex-col items-start relative w-full min-h-screen">
              {/* Header */}
              <div className="bg-[#f6e1d2] h-auto md:h-[176px] relative shrink-0 w-full border-b-4 border-[#eaecf0]">
                <div className="box-border content-stretch flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 py-4 sm:py-6 md:py-8 lg:py-12 relative size-full">
                  {/* Logo */}
                  <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0">
                    <p className="font-['Playfair_Display'] font-normal leading-[normal] relative shrink-0 text-[#2a120a] text-3xl sm:text-4xl md:text-5xl lg:text-[60px] text-nowrap whitespace-pre">Alankara AI</p>
                  </div>
                  
                  {/* Header Actions */}
                  <div className="content-stretch flex gap-[24px] items-center relative shrink-0 p-[0px] m-[0px]">
                    {/* Support Icon - Lottie Animation */}
                    <button
                      className="relative shrink-0 size-10 sm:size-12 md:size-14 lg:size-[64px] transition-opacity"
                      onClick={() => setShowSupportModal(true)}
                      style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
                      aria-label="Customer Support"
                    >
                      <Lottie 
                        animationData={aiChatBotAnimation}
                        loop={true}
                        autoplay={true}
                        style={{ width: '100%', height: '100%' }}
                      />
                    </button>
                    
                    {/* Search Button */}
                    <button
                      className="relative shrink-0 size-10 sm:size-12 md:size-14 lg:size-[64px] hover:opacity-80 transition-opacity"
                      onClick={() => setShowSearchModal(true)}
                      style={{ background: 'transparent', border: 'none', padding: 0 }}
                      aria-label="Search"
                    >
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64 64">
                        <path d={headerSvgPaths.p1b92c370} stroke="#7C563D" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" />
                      </svg>
                    </button>
                    
                    {/* Instructions Video Button */}
                    <button
                      className="relative shrink-0 size-10 sm:size-12 md:size-14 lg:size-[64px] hover:opacity-80 transition-opacity"
                      onClick={() => setShowInstructionsModal(true)}
                      style={{ background: 'transparent', border: 'none', padding: 0 }}
                      aria-label="Try-On Instructions"
                    >
                      <div className="size-full flex items-center justify-center">
                        <Info className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 text-[#7C563D] stroke-[2]" />
                      </div>
                    </button>
                    
                    {/* Profile Dropdown */}
                    <ProfileDropdown
                      userName={userProfileName}
                      userEmail={userProfileEmail}
                      onLogout={handleLogout}
                      onEditProfile={() => {
                        setShowProfileSetup(true);
                      }}
                      onMyTryOns={() => {
                        setShowMyTryOns(true);
                      }}
                      onWishlist={() => {
                        setShowWishlist(true);
                      }}
                      onOffers={() => {
                        setShowOffers(true);
                      }}
                      onSettings={() => {
                        setShowSettings(true);
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Category Navigation */}
              <div className="bg-[#fcf5f1] h-auto min-h-[80px] md:h-[160px] relative shrink-0 w-full">
                <div className="flex flex-row flex-wrap items-center justify-center size-full px-2 sm:px-4 md:px-8 lg:px-16 xl:px-24 py-3 sm:py-4 md:py-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6 xl:gap-8">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setActiveCategory(category);
                        setSelectedSubCategory(null);
                        if (category === "Book Now") {
                          setShowVideoShopping(true);
                          setShowCategoryDropdown(false);
                          setShowAdminDashboard(false);
                        } else {
                          setShowVideoShopping(false);
                          setShowAdminDashboard(false);
                          setShowCategoryDropdown(prev => !prev);
                        }
                      }}
                      className="box-border content-stretch flex gap-2 items-center justify-center px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 lg:p-8 relative hover:opacity-80 transition-opacity"
                    >
                      <p
                        className={`font-['Playfair_Display'] text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[48px] whitespace-nowrap ${
                          activeCategory === category
                            ? "bg-clip-text text-transparent"
                            : "text-black"
                        }`}
                        style={activeCategory === category ? {
                          backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 101 64\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(5.05 0 0 3.2 50.5 32)\\'><stop stop-color=\\'rgba(255,160,71,1)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(251,145,46,1)\\' offset=\\'0.5\\'/><stop stop-color=\\'rgba(247,130,21,1)\\' offset=\\'1\\'/></radialGradient></defs></svg>')",
                          WebkitBackgroundClip: 'text',
                          backgroundClip: 'text',
                        } : {}}
                      >
                        {category}
                      </p>
                      <div
                        className={`absolute h-1 sm:h-2 md:h-3 lg:h-[12px] left-0 right-0 rounded-tl-md rounded-tr-md lg:rounded-tl-lg lg:rounded-tr-lg bottom-0 transition-opacity ${
                          activeCategory === category ? "opacity-100" : "opacity-0"
                        }`}
                        style={activeCategory === category ? {
                          backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 165 12\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(8.25 0 0 0.6 82.5 6)\\'><stop stop-color=\\'rgba(255,160,71,1)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(251,145,46,1)\\' offset=\\'0.5\\'/><stop stop-color=\\'rgba(247,130,21,1)\\' offset=\\'1\\'/></radialGradient></defs></svg>')"
                        } : {}}
                      />
                    </button>
                  ))}
                </div>

                <CategoryDropdown
                  isOpen={showCategoryDropdown}
                  onClose={() => setShowCategoryDropdown(false)}
                  selectedFilter={categoryFilter}
                  onFilterChange={setCategoryFilter}
                  onSubCategorySelect={handleSubCategorySelect}
                />
              </div>

              {/* Hero Banner */}
              <div className="content-stretch flex flex-col h-[500px] items-center overflow-clip relative shrink-0 w-full">
                <div className="relative h-[506px] w-full">
                  <img
                    alt="Hero banner"
                    className="absolute inset-0 object-cover size-full"
                    src={carouselImages[carouselIndex]}
                  />
                  <div className="absolute bg-gradient-to-b from-transparent to-[rgba(0,0,0,0.3)] inset-0 to-[78.371%]" />

                  <button
                    onClick={prevCarousel}
                    className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-2 sm:p-4 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </button>
                  <button
                    onClick={nextCarousel}
                    className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-2 sm:p-4 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </button>

                  <div className="absolute bottom-[32px] left-1/2 -translate-x-1/2 flex gap-[16px] items-center z-10">
                    {carouselImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCarouselIndex(index)}
                        className={`backdrop-blur-[2px] backdrop-filter rounded-[999px] transition-all ${
                          index === carouselIndex
                            ? "bg-white h-4 w-24 sm:h-5 sm:w-36 md:h-[24px] md:w-[60px]"
                            : "bg-white/50 size-4 sm:size-5 md:size-[24px] hover:bg-white/70"
                        }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="content-stretch flex flex-col gap-[64px] items-start relative shrink-0 w-full py-[64px]">
                <div className="box-border content-stretch flex flex-col gap-[40px] items-start px-4 sm:px-8 md:px-16 lg:px-[96px] py-0 relative w-full overflow-visible">
                  <h2 className="font-['Playfair_Display'] text-[#2a120a] text-3xl sm:text-4xl md:text-5xl lg:text-[60px] text-center w-full">
                    {selectedSubCategory ? `${selectedSubCategory} in ${activeCategory}` : `Discover ${activeCategory} Jewellery`}
                  </h2>
                  <div className="relative w-full">
                    {visibleProducts.length > 3 && (
                      <>
                        <button
                          onClick={() => {
                            const container = document.getElementById('product-scroll');
                            if (container) {
                              container.scrollBy({ left: -container.offsetWidth, behavior: 'smooth' });
                            }
                          }}
                          className="absolute left-[-20px] top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors"
                          aria-label="Previous products"
                        >
                          <ChevronLeft className="w-6 h-6 text-[#7c563d]" />
                        </button>
                        <button
                          onClick={() => {
                            const container = document.getElementById('product-scroll');
                            if (container) {
                              container.scrollBy({ left: container.offsetWidth, behavior: 'smooth' });
                            }
                          }}
                          className="absolute right-[-20px] top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors"
                          aria-label="Next products"
                        >
                          <ChevronRight className="w-6 h-6 text-[#7c563d]" />
                        </button>
                      </>
                    )}
                    <div 
                      id="product-scroll"
                      className="overflow-x-auto overflow-y-hidden scrollbar-hide pb-4 px-0"
                      style={{ scrollBehavior: 'smooth', scrollSnapType: 'x mandatory' }}
                    >
                      <div className="flex gap-[24px] justify-start w-full px-2">
                        {visibleProducts.map((product) => (
                          <div 
                            key={product.id} 
                            className="flex-none w-[calc(33.333%-16px)] scroll-snap-align-start"
                            style={{ scrollSnapAlign: 'start' }}
                          >
                            <ProductCard
                              {...product}
                              onTryOn={() => handleTryOn(product)}
                              onClick={() => handleProductClick(product)}
                              onVideoShopping={() => handleVideoShopping(product)}
                            />
                          </div>
                        ))}
                        {visibleProducts.length === 0 && (
                          <p className="text-center text-gray-500 w-full py-10 font-['Montserrat']">
                            No {selectedSubCategory ? selectedSubCategory.toLowerCase() : ''} products found in {activeCategory}.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="box-border content-stretch flex flex-col gap-[40px] items-start px-4 sm:px-8 md:px-16 lg:px-[96px] py-0 relative w-full">
                  <h2 className="font-['Playfair_Display'] text-[#2a120a] text-3xl sm:text-4xl md:text-5xl lg:text-[60px] text-center w-full">Alankara Collections</h2>
                  <div className="content-start flex flex-wrap gap-8 md:gap-[48px] items-start relative w-full justify-center">
                    <div className="h-auto md:h-[542px] relative w-full sm:w-[calc(50%-16px)] md:w-[400px]">
                      <img alt="Collection 1" className="block w-full h-auto md:size-full object-cover rounded-lg" src={imgRectangle7} />
                    </div>
                    <div className="h-auto md:h-[542.316px] relative rounded-[32px] w-full sm:w-[calc(50%-16px)] md:w-[448px] border-4 md:border-[10px] border-white shadow-[0px_4px_16px_1px_rgba(216,130,76,0.08)]">
                      <img alt="Collection 2" className="absolute inset-0 object-cover rounded-[inherit] md:rounded-[32px] size-full" src={imgImage34} />
                    </div>
                    <div className="h-auto md:h-[542px] relative w-full sm:w-full md:w-[400px] mt-8 sm:mt-0">
                      <img alt="Collection 3" className="block w-full h-auto md:size-full object-cover rounded-lg" src={imgRectangle9} />
                    </div>
                  </div>
                  <div className="bg-[#fcf5f1] border border-white rounded-[999px] px-6 py-2 md:px-[32px] md:py-[10px] mx-auto shadow-[0px_4px_12px_0px_rgba(255,255,255,0.25)] mt-4">
                    <p className="font-['Playfair'] text-[#7c563d] text-xl md:text-[32px]" style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}>
                      COMING SOON
                    </p>
                  </div>
                </div>
              </div>

              <div className="box-border content-stretch flex flex-col gap-[32px] items-start px-4 sm:px-8 md:px-16 lg:px-[96px] py-0 relative w-full">
                <div className="content-stretch flex flex-col gap-[8px] items-center justify-center relative shrink-0 w-full">
                  <h2 className="font-['Playfair_Display'] text-[#2a120a] text-3xl sm:text-4xl md:text-5xl lg:text-[60px] text-center">Find Your Perfect Match</h2>
                  <p className="font-['Playfair_Display'] font-light text-[#7c563d] text-xl sm:text-2xl md:text-3xl lg:text-[40px] text-center">Shop by Categories</p>
                </div>

                <div className="flex flex-wrap justify-between gap-x-4 md:gap-x-[24px] gap-y-4 w-full">
                  {categoryCards.slice(0, 3).map((cat, index) => (
                    <div 
                      key={cat.id} 
                      className={`
                        flex flex-col items-center gap-y-1
                        w-[calc(50%-0.5rem)]
                        md:w-[calc(33.333%-1rem)]
                        ${index >= 3 ? 'md:w-[calc(50%-1rem)]' : ''}
                      `}
                    >
                      <CategoryCard
                        image={cat.image}
                        title={cat.title}
                        onClick={() => handleSubCategorySelect(cat.type)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {!tryOnModal.isOpen && (
                <div className="relative w-full bg-black overflow-hidden">
                  <div
                    className="relative w-full max-w-[100vw] mx-auto"
                    style={{ paddingBottom: '56.25%' }}
                  >
                    <div className="absolute inset-0 w-full h-full">
                      <div className="relative w-full h-full overflow-hidden">
                        <div
                          className="absolute inset-0 flex w-[200%] transition-transform duration-1000"
                          style={{ transform: `translateX(-${activeAd * 50}%)` }}
                        >
                          <div className="w-1/2 h-full relative">
                            <iframe
                              className="absolute inset-0 w-full h-full"
                              src="https://www.youtube.com/embed/videoseries?list=PLORDXG8AU8egIyZZBlx9VKqISK2Z5U9Ya&autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=PLORDXG8AU8egIyZZBlx9VKqISK2Z5U9Ya"
                              title="Jewelry Advertisements 1"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              referrerPolicy="strict-origin-when-cross-origin"
                              loading="lazy"
                              allowFullScreen
                            />
                          </div>

                          <div className="w-1/2 h-full relative">
                            <iframe
                              className="absolute inset-0 w-full h-full"
                              src="https://www.youtube.com/embed/videoseries?list=PLlsNa0r0eHSs8kEhtvgwUI1OpAgDlDWfK&autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=PLlsNa0r0eHSs8kEhtvgwUI1OpAgDlDWfK"
                              title="Jewelry Advertisements 2"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              referrerPolicy="strict-origin-when-cross-origin"
                              loading="lazy"
                              allowFullScreen
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="absolute top-4 right-4 flex gap-2 z-10">
                      {[0, 1].map((index) => (
                        <button
                          key={index}
                          onClick={() => setActiveAd(index)}
                          className={`w-3 h-3 rounded-full transition-all ${
                            activeAd === index ? "bg-white w-8" : "bg-white/50 hover:bg-white/70"
                          }`}
                          aria-label={`Switch to playlist ${index + 1}`}
                        />
                      ))}
                    </div>

                    <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-10">
                      <div
                        className="h-full bg-white transition-all duration-300"
                        style={{ width: `${adProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <ProductDetail
                isOpen={productDetail.isOpen}
                onClose={() => setProductDetail({ isOpen: false, product: null })}
                product={productDetail.product}
                onTryOn={handleDetailTryOn}
              />

              {tryOnModal.isOpen && tryOnModal.product?.image && tryOnModal.product?.type && (
                <VirtualTryOn
                  isOpen={true}
                  onClose={() => setTryOnModal({ isOpen: false, product: null })}
                  productId={tryOnModal.product.id}
                  productImage={tryOnModal.product.image}
                  productName={tryOnModal.product.name || ""}
                  jewelryType={tryOnModal.product.type}
                  detectorType={getDetectorForJewelry(tryOnModal.product.type)}
                  currentUserId={currentUserId}
                />
              )}

              <SearchModal
                isOpen={showSearchModal}
                onClose={() => setShowSearchModal(false)}
                products={products as any}
                onTryOn={(product) => handleTryOn(product)}
                onProductClick={(product) => handleProductClick(product)}
              />
              
              <MyTryOns
                isOpen={showMyTryOns}
                onClose={() => setShowMyTryOns(false)}
                userId={currentUserId || ""}
                onTryOn={(product) => {
                  setShowMyTryOns(false);
                  handleTryOn(product);
                }}
              />
              
              <Wishlist
                isOpen={showWishlist}
                onClose={() => setShowWishlist(false)}
                userId={currentUserId || ""}
                onTryOn={(product) => {
                  setShowWishlist(false);
                  handleTryOn(product);
                }}
              />
              
              <Offers
                isOpen={showOffers}
                onClose={() => setShowOffers(false)}
              />
              
              <Settings
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
                userId={currentUserId || ""}
              />
            </div>
            <SecurityMonitor 
              isActive={true}
              onSecurityStateChange={(isMonitoring) => {
                setIsSecurityMonitoring(isMonitoring);
                if (isMonitoring) {
                  setTryOnModal({ isOpen: false, product: null });
                }
              }}
            />
          </>
          )
        } />
        
        <Route path="/admin" element={
          <AlankaraAiDashboard onExit={() => window.location.href = '/'} />
        } />
      </Routes>
    </Router>
  );
}