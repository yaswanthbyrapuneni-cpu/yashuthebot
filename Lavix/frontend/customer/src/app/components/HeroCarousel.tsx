import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";

import slide1 from "../../assets/mens_banner.jpg";
import slide2 from "../../assets/saree_model_1.png";
import slide3 from "../../assets/mens_banner.jpg";
import slide4 from "../../assets/saree_model_1.png";
import slide5 from "../../assets/saree_model_1.png";

interface Slide {
  id: number;
  image: string;
  tag: string;
  headline: string;
  description: string;
  cta: string;
  ctaLink: string;
  accent: string;
}

const SLIDES: Slide[] = [
  { id:1, image:slide1, tag:"New Season",    headline:"Redefine Your\nStyle Statement",   description:"Discover curated fashion that speaks your personality. AI-powered virtual try-on included.", cta:"Shop Now",          ctaLink:"/mens",   accent:"#d4af37" },
  { id:2, image:slide2, tag:"Exclusive Drops",headline:"Elevate Every\nOccasion",          description:"Premium collections for men & women. Crafted for those who dare to stand out.",             cta:"Explore Collection",ctaLink:"/womens", accent:"#c9a96e" },
  { id:3, image:slide3, tag:"Men Edition",    headline:"Bold Looks for\nBold Minds",       description:"From casual everyday wear to sharp formal attire — we have it all.",                        cta:"Shop Men",          ctaLink:"/mens",   accent:"#6c8ebf" },
  { id:4, image:slide4, tag:"Women Edit",     headline:"Grace Meets\nModern Fashion",      description:"Effortlessly beautiful. Timeless silhouettes reimagined for the modern woman.",             cta:"Shop Women",        ctaLink:"/womens", accent:"#c77daa" },
  { id:5, image:slide5, tag:"Virtual Try-On", headline:"Try Before\nYou Buy",              description:"Use our AI-powered virtual dressing room to see how it looks before you order.",            cta:"Try It Now",        ctaLink:"/mens",   accent:"#4caf87" },
];

const INTERVAL = 3000;

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [direction, setDirection] = useState<"next"|"prev">("next");
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const goTo = useCallback((index:number, dir:"next"|"prev"="next") => {
    if (transitioning) return;
    setDirection(dir);
    setTransitioning(true);
    setVisible(false);
    setTimeout(() => { setCurrent(index); setVisible(true); setTransitioning(false); }, 350);
  }, [transitioning]);

  const goNext = useCallback(() => goTo((current+1)%SLIDES.length,"next"), [current, goTo]);
  const goPrev = useCallback(() => goTo((current-1+SLIDES.length)%SLIDES.length,"prev"), [current, goTo]);

  useEffect(() => {
    if (isHovered) { if(timerRef.current) clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(goNext, INTERVAL);
    return () => { if(timerRef.current) clearInterval(timerRef.current); };
  }, [isHovered, goNext]);

  const slide = SLIDES[current];
  const tx = !visible ? (direction==="next"?"translateX(-40px) scale(0.98)":"translateX(40px) scale(0.98)") : "translateX(0) scale(1)";

  return (
    <div
      className="relative w-full max-w-[1786px] rounded-[24px] overflow-hidden mb-[32px] select-none"
      style={{height:"clamp(300px,50vw,689px)"}}
      onMouseEnter={()=>setIsHovered(true)}
      onMouseLeave={()=>setIsHovered(false)}
    >
      <div className="absolute inset-0">
        <img src={slide.image} alt={slide.headline} className="w-full h-full object-cover"
          style={{transition:"opacity 0.35s ease,transform 0.35s ease",opacity:visible?1:0,transform:visible?"scale(1)":"scale(1.03)"}} />
        <div className="absolute inset-0" style={{background:"linear-gradient(90deg,rgba(0,0,0,0.72) 0%,rgba(0,0,0,0.35) 55%,rgba(0,0,0,0.05) 100%)"}} />
      </div>

      <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-28"
        style={{transition:"opacity 0.35s ease,transform 0.35s ease",opacity:visible?1:0,transform:tx}}>
        <span className="inline-block rounded-full text-xs sm:text-sm font-semibold uppercase px-3 py-1 mb-3 sm:mb-4"
          style={{backgroundColor:slide.accent,color:"#fff",letterSpacing:"0.12em",width:"fit-content"}}>
          {slide.tag}
        </span>
        <h1 className="text-white font-bold leading-tight mb-3 sm:mb-4"
          style={{fontSize:"clamp(1.8rem,5vw,4rem)",fontFamily:"'Clash Display',sans-serif",whiteSpace:"pre-line",textShadow:"0 2px 12px rgba(0,0,0,0.4)"}}>
          {slide.headline}
        </h1>
        <p className="text-white/80 mb-5 sm:mb-8 max-w-[480px]"
          style={{fontSize:"clamp(0.85rem,1.8vw,1.15rem)",lineHeight:1.65}}>
          {slide.description}
        </p>
        <Link to={slide.ctaLink}
          className="flex items-center gap-2 font-semibold px-5 py-3 rounded-full text-sm sm:text-base transition-all duration-300 hover:scale-105 active:scale-95 no-underline"
          style={{backgroundColor:slide.accent,color:"#fff",boxShadow:`0 4px 20px ${slide.accent}55`,width:"fit-content"}}>
          {slide.cta}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
          </svg>
        </Link>
      </div>

      {[{fn:goPrev,side:"left-3 sm:left-5",pts:"15 18 9 12 15 6"},{fn:goNext,side:"right-3 sm:right-5",pts:"9 18 15 12 9 6"}].map(({fn,side,pts},i)=>(
        <button key={i} onClick={fn} aria-label={i===0?"Previous slide":"Next slide"}
          className={`absolute ${side} top-1/2 -translate-y-1/2 z-10 flex items-center justify-center rounded-full border border-white/30 bg-black/30 text-white transition-all duration-200 hover:bg-black/60 hover:scale-110 active:scale-95 focus:outline-none`}
          style={{width:"clamp(36px,5vw,56px)",height:"clamp(36px,5vw,56px)"}}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={{width:"clamp(14px,2.5vw,22px)",height:"clamp(14px,2.5vw,22px)"}}>
            <polyline points={pts}/>
          </svg>
        </button>
      ))}

      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
        {SLIDES.map((s,i)=>(
          <button key={s.id} onClick={()=>goTo(i,i>current?"next":"prev")} aria-label={`Slide ${i+1}`}
            className="border-0 p-0 focus:outline-none cursor-pointer"
            style={{width:i===current?"clamp(24px,3vw,36px)":"clamp(8px,1.2vw,12px)",height:"clamp(8px,1.2vw,12px)",borderRadius:"9999px",
              backgroundColor:i===current?slide.accent:"rgba(255,255,255,0.45)",transition:"all 0.35s ease",
              boxShadow:i===current?`0 0 8px ${slide.accent}99`:"none"}}/>
        ))}
      </div>

      {!isHovered&&(
        <div className="absolute bottom-0 left-0 h-[3px] z-10"
          style={{backgroundColor:slide.accent,animation:`vastra-progress ${INTERVAL}ms linear`,opacity:0.85}}/>
      )}
      <style>{`@keyframes vastra-progress{from{width:0%}to{width:100%}}`}</style>
    </div>
  );
}
