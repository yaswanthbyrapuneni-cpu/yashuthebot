import { Link } from "react-router-dom";

export function Header() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Header">
      <div aria-hidden className="absolute border-[#fef7ff] border-b-4 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-between px-4 sm:px-8 md:px-[64px] py-4 sm:py-[24px] md:py-[32px] relative size-full">
          <Link to="/home" className="content-stretch flex items-end justify-center relative shrink-0" data-name="logo">
            <p className="[word-break:break-word] font-['Clash_Display:Regular',sans-serif] leading-[0] not-italic relative shrink-0 text-[0px] text-black whitespace-pre">
                <span className="font-['Clash_Display:Semibold',sans-serif] leading-[1.3] text-2xl sm:text-3xl md:text-[44px]">Lavix</span>
            </p>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full shrink-0 border border-gray-200 bg-gray-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{width:"50%",height:"50%"}}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
