// COPY THIS ENTIRE FILE TO: src/imports/AdminAiDashboard.tsx

import imgFrame134 from "../assets/5f89ee062f2210170042d849c64718bf7f770345.png";
import { TrendingProduct, useAdminDashboard } from "../hooks/useAdminDashboard";
import svgPaths from "./svg-3nqkn1oc8r";
import { SecuritySettings } from "../components/SecuritySettings";
import { AdminSupportModal } from "../components/AdminSupportModal";
import { CampaignManager } from "../components/CampaignManager";
import React, { useState } from "react";
// [KEEP ALL YOUR EXISTING HEADER/LOGO COMPONENTS - Lines 1-200 approximately]
// Logo, NotificationBox, LogOut01, SearchContainer, Header, Frame100, etc.

function Logo() {
  return (
    <div className="content-stretch flex gap-2 md:gap-[10px] items-center justify-center relative shrink-0" data-name="logo">
      <p className="font-['Playfair_Display:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[#2a120a] text-3xl sm:text-4xl md:text-5xl lg:text-[60px] text-nowrap whitespace-pre">Alankara AI</p>
    </div>
  );
}

function NotificationBox() {
  return (
    <div className="relative shrink-0 size-10 sm:size-12 md:size-14 lg:size-[64px]" data-name="notification-box">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64 64">
        <g id="notification-box">
          <path d={svgPaths.p353e9300} id="Icon" stroke="var(--stroke-0, #202020)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5.33333" />
        </g>
      </svg>
    </div>
  );
}

function LogOut01({ onClick }: { onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="relative shrink-0 size-10 sm:size-12 md:size-14 lg:size-[64px] hover:opacity-70 transition-opacity cursor-pointer bg-transparent border-none p-0" 
      data-name="log-out-01"
      aria-label="Exit to customer dashboard"
    >
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64 64">
        <g id="log-out-01">
          <path d={svgPaths.p9897f40} id="Icon" stroke="var(--stroke-0, #202020)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5.33333" />
        </g>
      </svg>
    </button>
  );
}

function SearchContainer({ onExit }: { onExit?: () => void }) {
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  const handleTechSupport = () => {
    window.open('https://cal.com/aismartlive-solutions-cx0zjs/technical-support', '_blank');
  };

  return (
    <>
      <div className="content-stretch flex gap-4 sm:gap-6 md:gap-8 lg:gap-[48px] items-center relative shrink-0" data-name="Search Container">
        {/* Analytics Chatbot Button - NEW */}
        <button
          onClick={() => setIsSupportModalOpen(true)}
          className="relative shrink-0 size-10 sm:size-12 md:size-14 lg:size-[64px] hover:opacity-70 transition-opacity cursor-pointer bg-transparent border-none p-0"
          aria-label="Analytics Assistant"
          title="Ask analytics questions"
        >
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64 64">
            {/* Database/Analytics Icon */}
            <ellipse cx="32" cy="18" rx="18" ry="8" stroke="#202020" strokeWidth="4" fill="none"/>
            <path d="M14 18v20c0 4.4 8 8 18 8s18-3.6 18-8V18" stroke="#202020" strokeWidth="4" fill="none"/>
            <path d="M14 28c0 4.4 8 8 18 8s18-3.6 18-8" stroke="#202020" strokeWidth="4" fill="none"/>
          </svg>
        </button>

        {/* Tech Support Button - EXISTING */}
        <button
          onClick={handleTechSupport}
          className="relative shrink-0 size-10 sm:size-12 md:size-14 lg:size-[64px] hover:opacity-70 transition-opacity cursor-pointer bg-transparent border-none p-0"
          aria-label="Technical Support"
          title="Book tech support call"
        >
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="28" stroke="#202020" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <path d="M32 20v16M32 44h.02" stroke="#202020" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <NotificationBox />
        <LogOut01 onClick={onExit} />
      </div>

      {/* Admin Analytics Support Modal */}
      <AdminSupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />
    </>
  );
}

function Header({ onExit }: { onExit?: () => void }) {
  return (
    <div className="bg-white relative shrink-0 w-full border-b border-[#eaecf0] shadow-sm" data-name="Header">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 md:px-16 lg:px-[96px] py-4 md:py-6 relative w-full gap-4 md:gap-0">
          <Logo />
          <SearchContainer onExit={onExit} />
        </div>
      </div>
    </div>
  );
}

function Frame100() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-2 items-start px-4 sm:px-8 md:px-16 lg:px-[96px] py-6 sm:py-8 md:py-[64px] relative w-full">
          <p className="font-['Inter:Medium',_sans-serif] font-medium leading-[1.2] not-italic relative shrink-0 text-[#020202] text-4xl sm:text-5xl md:text-6xl lg:text-[80px] text-nowrap whitespace-pre">Welcome back, Ram</p>
        </div>
      </div>
    </div>
  );
}

// [KEEP ALL YOUR EXISTING OVERVIEW COMPONENTS]
// Frame118, NotificationBox1-4, Left, Left1-3, Frame104, Frame108, Frame109, Frame110, Frame106, etc.

function TextPadding() {
  return (
    <div className="box-border content-stretch flex items-center justify-center px-0.5 md:px-[2px] py-0 relative shrink-0" data-name="Text padding">
      <p className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[1.2] md:leading-[30px] not-italic relative shrink-0 text-[#344054] text-sm sm:text-base md:text-[21px] text-nowrap whitespace-pre">This Month</p>
    </div>
  );
}

function ChevronDown() {
  return (
    <div className="relative shrink-0 size-4 sm:size-5 md:size-[30px]" data-name="chevron-down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
        <g id="chevron-down">
          <path d={svgPaths.p3031b880} id="Icon" stroke="var(--stroke-0, #344054)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <button className="bg-[rgba(255,255,255,0.5)] relative rounded-md md:rounded-[12px] shrink-0 hover:bg-white/80 transition-colors" data-name="Button" type="button">
      <div className="box-border content-stretch flex gap-0.5 sm:gap-1 md:gap-[4px] items-center justify-center overflow-clip px-2 sm:px-3 md:px-[21px] py-1.5 sm:py-2 md:py-[15px] relative rounded-[inherit]">
        <TextPadding />
        <ChevronDown />
      </div>
      <div aria-hidden="true" className="absolute border-[#d0d5dd] border border-solid inset-0 pointer-events-none rounded-[inherit] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]" />
    </button>
  );
}

function Frame118() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <p className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[1.3] not-italic relative shrink-0 text-[#222226] text-xl sm:text-2xl md:text-3xl lg:text-[48px] text-nowrap whitespace-pre">Overview</p>
      <Button />
    </div>
  );
}

function NotificationBox1() {
  return (
    <div className="relative shrink-0 size-6 sm:size-8 md:size-10 lg:size-[48px]" data-name="notification-box">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 48">
        <g id="notification-box">
          <path d={svgPaths.pa3b7c00} id="Icon" stroke="var(--stroke-0, #8B8B91)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
        </g>
      </svg>
    </div>
  );
}

function Left() {
  return (
    <div className="content-stretch flex gap-2 sm:gap-3 md:gap-[13.886px] items-center relative shrink-0" data-name="left">
      <NotificationBox1 />
      <p className="font-['Inter:Regular',_sans-serif] font-normal leading-[1.3] not-italic relative shrink-0 text-[#75757c] text-base sm:text-lg md:text-2xl lg:text-[40px] text-nowrap whitespace-pre">Visitors</p>
    </div>
  );
}

function Frame104({ count }: { count: number }) {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Left />
      <p className="font-['Inter:Medium',_sans-serif] font-medium leading-[1.3] not-italic relative shrink-0 text-[#2d2d32] text-base sm:text-lg md:text-2xl lg:text-[40px] text-nowrap whitespace-pre">{(count || 0).toLocaleString()}</p>
    </div>
  );
}

function NotificationBox2() {
  return (
    <div className="relative shrink-0 size-6 sm:size-8 md:size-10 lg:size-[48px]" data-name="notification-box">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 48"><g id="notification-box"><path d={svgPaths.pa3b7c00} id="Icon" stroke="var(--stroke-0, #8B8B91)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" /></g></svg>
    </div>
  );
}

function Left1() {
  return (
    <div className="content-stretch flex gap-2 sm:gap-3 md:gap-[13.886px] items-center relative shrink-0" data-name="left">
      <NotificationBox2 /><p className="font-['Inter:Regular',_sans-serif] font-normal leading-[1.3] not-italic relative shrink-0 text-[#75757c] text-base sm:text-lg md:text-2xl lg:text-[40px] text-nowrap whitespace-pre">Try On</p>
    </div>
  );
}

function Frame108({ count }: { count: number }) {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Left1 /><p className="font-['Inter:Medium',_sans-serif] font-medium leading-[1.3] not-italic relative shrink-0 text-[#2d2d32] text-base sm:text-lg md:text-2xl lg:text-[40px] text-nowrap whitespace-pre">{(count || 0).toLocaleString()}</p>
    </div>
  );
}

function NotificationBox4() {
  return (
    <div className="relative shrink-0 size-6 sm:size-8 md:size-10 lg:size-[48px]" data-name="notification-box">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 48"><g id="notification-box"><path d={svgPaths.pa3b7c00} id="Icon" stroke="var(--stroke-0, #8B8B91)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" /></g></svg>
    </div>
  );
}

function Left3() {
  return (
    <div className="content-stretch flex gap-2 sm:gap-3 md:gap-[13.886px] items-center relative shrink-0" data-name="left">
      <NotificationBox4 /><p className="font-['Inter:Regular',_sans-serif] font-normal leading-[1.3] not-italic relative shrink-0 text-[#75757c] text-base sm:text-lg md:text-2xl lg:text-[40px] text-nowrap whitespace-pre">Repeated Users</p>
    </div>
  );
}

function Frame110({ count }: { count: number }) {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Left3 /><p className="font-['Inter:Medium',_sans-serif] font-medium leading-[1.3] not-italic relative shrink-0 text-[#2d2d32] text-base sm:text-lg md:text-2xl lg:text-[40px] text-nowrap whitespace-pre">{(count || 0).toLocaleString()}</p>
    </div>
  );
}

function Frame106({ visitors, tryOns, repeatedUsers }: { visitors: number; tryOns: number; repeatedUsers: number }) {
  return (
    <div className="bg-white relative rounded-lg md:rounded-[24px] shrink-0 w-full shadow-sm">
      <div aria-hidden="true" className="absolute border border-[#eeeeef] border-solid inset-0 pointer-events-none rounded-[inherit]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-4 sm:gap-6 md:gap-[32px] items-start p-4 sm:p-6 md:p-[32px] relative w-full">
          <Frame104 count={visitors} />
          <Frame108 count={tryOns} />
          <Frame110 count={repeatedUsers} />
        </div>
      </div>
    </div>
  );
}

function Stars01() {
  return (
    <div className="relative shrink-0 size-6 sm:size-8 md:size-10 lg:size-[48px]" data-name="stars-01">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 48"><g id="stars-01"><g id="Icon"><path d={svgPaths.p706a80} stroke="var(--stroke-0, #8B8B91)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" /><path d={svgPaths.p25909b80} stroke="var(--stroke-0, #8B8B91)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" /></g></g></svg>
    </div>
  );
}

function Frame119() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="size-full">
        <div className="box-border content-stretch flex gap-2 sm:gap-3 md:gap-[16px] items-start px-2 sm:px-3 md:px-[16px] py-0 relative w-full">
          <Stars01 />
          <p className="basis-0 font-['Poppins:Regular',_sans-serif] grow leading-[1.5] min-h-px min-w-px not-italic relative shrink-0 text-xs sm:text-sm md:text-base lg:text-[28px] text-zinc-600">This month, 13.45 % more sales compared to previous month.</p>
        </div>
      </div>
    </div>
  );
}

function Frame120({ visitors, tryOns, repeatedUsers }: { visitors: number; tryOns: number; repeatedUsers: number }) {
  return (
    <div className="content-stretch flex flex-col gap-3 sm:gap-4 md:gap-[24px] items-start relative shrink-0 w-full">
      <Frame106 visitors={visitors} tryOns={tryOns} repeatedUsers={repeatedUsers} />
      <Frame119 />
    </div>
  );
}

function Frame114({ visitors, tryOns, repeatedUsers }: { visitors: number; tryOns: number; repeatedUsers: number }) {
  return (
    <div className="content-stretch flex flex-col gap-4 sm:gap-6 md:gap-[32px] items-start relative shrink-0 w-full">
      <Frame118 />
      <Frame120 visitors={visitors} tryOns={tryOns} repeatedUsers={repeatedUsers} />
    </div>
  );
}

function TryOn({ visitors, tryOns, repeatedUsers }: { visitors: number; tryOns: number; repeatedUsers: number }) {
  return (
    <div className="w-full bg-[#f7f7f7] h-full relative rounded-lg md:rounded-[32px] shrink-0 border border-[#c9c9cc]" data-name="Try on">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex flex-col items-start justify-between px-4 sm:px-6 md:px-[24px] py-4 sm:py-6 md:py-[32px] relative size-full">
          <Frame114 visitors={visitors} tryOns={tryOns} repeatedUsers={repeatedUsers} />
        </div>
      </div>
    </div>
  );
}

function Frame111({ count, lastMonth }: { count: number; lastMonth: number }) {
  const percentChange = lastMonth > 0 ? (((count - lastMonth) / lastMonth) * 100).toFixed(0) : 0;
  const isPositive = Number(percentChange) >= 0;
  
  return (
    <div className="content-stretch flex flex-col font-['Inter:Medium',_sans-serif] font-medium gap-1 sm:gap-2 md:gap-[12px] items-start justify-center not-italic relative shrink-0 w-full">
      <p className="leading-[1.1] md:leading-[96px] relative shrink-0 text-[#eeeeef] text-5xl sm:text-6xl md:text-7xl lg:text-[96px] text-left text-nowrap whitespace-pre">{count.toLocaleString()}</p>
      <p className="leading-[1.3] min-w-full relative shrink-0 text-[#8b8b91] text-sm sm:text-base md:text-xl lg:text-[32px] w-[min-content]">
        <span className={isPositive ? "text-[#10f500]" : "text-[#ff2222]"}>{isPositive ? '+' : ''}{percentChange}%</span>
        <span>{` since last month`}</span>
      </p>
    </div>
  );
}

function Frame117({ count, lastMonth }: { count: number; lastMonth: number }) {
  return (
    <div className="relative shrink-0 w-full">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-4 sm:gap-6 md:gap-[48px] items-start pl-4 sm:pl-6 md:pl-[40px] pr-0 py-0 relative w-full">
          <p className="font-['Inter:Extra_Bold',_sans-serif] font-extrabold leading-[1.2] md:leading-[96px] not-italic relative shrink-0 text-2xl sm:text-3xl md:text-5xl lg:text-[80px] text-zinc-600 w-full">Try On</p>
          <Frame111 count={count} lastMonth={lastMonth} />
        </div>
      </div>
    </div>
  );
}

function Frame112({ count }: { count: number }) {
  return (
    <div className="content-stretch flex items-center justify-between leading-[1.3] not-italic relative shrink-0 text-sm sm:text-base md:text-xl lg:text-[32px] text-nowrap w-full whitespace-pre">
      <p className="font-['Inter:Medium',_sans-serif] font-medium relative shrink-0 text-[#afafb4]">last month</p>
      <p className="font-['Inter:Semi_Bold',_sans-serif] font-semibold relative shrink-0 text-[#eeeeef]">{(count || 0).toLocaleString()}</p>
    </div>
  );
}

function Frame113({ count }: { count: number }) {
  return (
    <div className="bg-[#2d2d32] box-border content-stretch flex flex-col gap-2 h-auto items-start pb-4 md:pb-[104px] px-4 sm:px-6 md:pl-[40px] md:pr-[48px] pt-4 sm:pt-6 md:pt-[30px] relative rounded-t-lg md:rounded-t-[24px] w-full">
      <div aria-hidden="true" className="absolute border-t border-solid border-zinc-600 inset-x-0 top-0 pointer-events-none rounded-t-[inherit]" />
      <Frame112 count={count} />
    </div>
  );
}

function Frame121({ count, monthName }: { count: number; monthName: string }) {
  return (
    <div className="content-stretch flex items-center justify-between leading-[1.3] not-italic relative shrink-0 text-sm sm:text-base md:text-xl lg:text-[32px] text-nowrap w-full whitespace-pre">
      <p className="font-['Inter:Medium',_sans-serif] font-medium relative shrink-0 text-[#afafb4]">{monthName}</p>
      <p className="font-['Inter:Semi_Bold',_sans-serif] font-semibold relative shrink-0 text-[#eeeeef]">{(count || 0).toLocaleString()}</p>
    </div>
  );
}

function Frame115({ count, monthName, className }: { count: number; monthName: string; className?: string }) {
  return (
    <div className={`bg-[#3a3a41] box-border content-stretch flex flex-col gap-2 h-auto items-start pb-4 md:pb-[32px] px-4 sm:px-6 md:pl-[40px] md:pr-[48px] pt-4 sm:pt-6 md:pt-[30px] relative rounded-t-lg md:rounded-t-[24px] w-full ${className}`}>
      <div aria-hidden="true" className="absolute border border-solid border-zinc-600 inset-0 pointer-events-none rounded-[inherit]" />
      <Frame121 count={count} monthName={monthName} />
    </div>
  );
}

function Group1({ lastMonth, twoMonthsAgo, twoMonthsAgoName }: { lastMonth: number; twoMonthsAgo: number; twoMonthsAgoName: string }) {
  return (
    <div className="flex flex-col items-start relative w-full">
      <Frame113 count={lastMonth} />
      <Frame115 count={twoMonthsAgo} monthName={twoMonthsAgoName} className="-mt-16 md:-mt-[99px]" />
    </div>
  );
}

function Bottom({ lastMonth, twoMonthsAgo, twoMonthsAgoName }: { lastMonth: number; twoMonthsAgo: number; twoMonthsAgoName: string }) {
  return (
    <div className="relative shrink-0 w-full mt-auto" data-name="Bottom">
      <Group1 lastMonth={lastMonth} twoMonthsAgo={twoMonthsAgo} twoMonthsAgoName={twoMonthsAgoName} />
    </div>
  );
}

function TrendUp01() {
  return (
    <div className="absolute right-4 sm:right-6 md:right-[40px] size-10 sm:size-12 md:size-16 lg:size-[80px] top-4 sm:top-6 md:top-[40px]" data-name="trend-up-01">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 80 80">
        <g id="trend-up-01">
          <path d={svgPaths.p1138a1a0} id="Icon" stroke="var(--stroke-0, #52525B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8" />
        </g>
      </svg>
    </div>
  );
}

function TryOn1({ currentMonth, lastMonth, twoMonthsAgo }: { currentMonth: number; lastMonth: number; twoMonthsAgo: number }) {
  const twoMonthsAgoDate = new Date();
  twoMonthsAgoDate.setMonth(twoMonthsAgoDate.getMonth() - 2);
  const twoMonthsAgoName = twoMonthsAgoDate.toLocaleString('default', { month: 'long' });
  
  return (
    <div className="w-full box-border content-stretch flex flex-col h-full items-start justify-between overflow-clip pb-0 pt-4 sm:pt-6 md:pt-[32px] px-0 relative rounded-lg md:rounded-[32px] shrink-0 bg-[#1f1f23] border border-[#3a3a41]" data-name="Try on">
      <Frame117 count={currentMonth} lastMonth={lastMonth} />
      <Bottom lastMonth={lastMonth} twoMonthsAgo={twoMonthsAgo} twoMonthsAgoName={twoMonthsAgoName} />
      <TrendUp01 />
    </div>
  );
}

function Frame116({ visitors, tryOns, repeatedUsers, currentMonthTryOns, lastMonthTryOns, twoMonthsAgoTryOns }: { 
  visitors: number; 
  tryOns: number; 
  repeatedUsers: number;
  currentMonthTryOns: number;
  lastMonthTryOns: number;
  twoMonthsAgoTryOns: number;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-[40px] items-stretch relative shrink-0 w-full">
      <TryOn visitors={visitors} tryOns={tryOns} repeatedUsers={repeatedUsers} />
      <TryOn1 currentMonth={currentMonthTryOns} lastMonth={lastMonthTryOns} twoMonthsAgo={twoMonthsAgoTryOns} />
    </div>
  );
}

// ========== EMOTION COMPONENTS - UPDATED WITH REAL DATA ==========

function DotsVertical() {
  return (<div className="relative shrink-0 size-8 sm:size-10 md:size-12 lg:size-[64px]" data-name="dots-vertical"><svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64 64"><g id="dots-vertical"><g id="Icon"><path d={svgPaths.p25b79f80} stroke="var(--stroke-0, #98A2B3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5.33333" /><path d={svgPaths.p165f8400} stroke="var(--stroke-0, #98A2B3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5.33333" /><path d={svgPaths.p37ddcc00} stroke="var(--stroke-0, #98A2B3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5.33333" /></g></g></svg></div>);
}

function Dropdown() {
  return (<button type="button" className="content-stretch flex flex-col items-start relative shrink-0 hover:bg-gray-100 rounded-full p-1" data-name="Dropdown"><DotsVertical /></button>);
}

function Frame142() {
  return (
    <div className="box-border content-stretch flex items-center justify-between px-0 py-2 md:py-[12px] relative shrink-0 w-full">
      <p className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[1.3] not-italic relative shrink-0 text-[#222226] text-lg sm:text-xl md:text-3xl lg:text-[48px] whitespace-normal md:whitespace-pre">Emotional Engagement Analytics</p>
      <Dropdown />
    </div>
  );
}

function Frame126() {
  return (
    <div className="content-stretch flex flex-col gap-3 sm:gap-4 md:gap-[24px] items-start relative shrink-0 w-full">
      <Frame142 />
      <p className="font-['Poppins:Regular',_sans-serif] leading-[1.5] not-italic relative shrink-0 text-sm sm:text-base md:text-lg lg:text-[32px] text-zinc-600 w-full">Measure how deeply customers connect with your jewellery through expressions and repeat views.</p>
    </div>
  );
}

// UPDATED: EmotionBar now accepts real percentages
function EmotionBar({ happyPercent, neutralPercent, sadPercent }: { 
  happyPercent: number; 
  neutralPercent: number; 
  sadPercent: number; 
}) {
  return (
    <div className="bg-[#f7f7f7] h-3 relative rounded-full shrink-0 w-full overflow-hidden border border-[#c9c9cc]">
      <div className="flex h-full w-full">
        <div
          className="h-full bg-[#0DC300]"
          style={{ width: `${happyPercent}%` }}
          title={`Happy: ${happyPercent}%`}
        ></div>
        <div
          className="h-full bg-[#FF8D54]"
          style={{ width: `${neutralPercent}%` }}
          title={`Neutral: ${neutralPercent}%`}
        ></div>
        <div
          className="h-full bg-[#FF2222]"
          style={{ width: `${sadPercent}%` }}
          title={`Sad/Bad: ${sadPercent}%`}
        ></div>
      </div>
    </div>
  );
}

function Frame127() {
  return (<div className="relative shrink-0 size-8 sm:size-10 md:size-12 lg:size-[52px]"><svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 52 52"><g id="Frame 127"><circle cx="26" cy="26" fill="var(--fill-0, #0DC300)" id="Ellipse 8" r="20" stroke="var(--stroke-0, white)" strokeWidth="8" /></g></svg></div>);
}

function Frame128() {
  return (<div className="content-stretch flex gap-2 sm:gap-4 md:gap-[28px] items-center relative shrink-0"><Frame127 /><p className="font-['Inter:Regular',_sans-serif] font-normal leading-[1.3] not-italic relative shrink-0 text-[#75757c] text-base sm:text-lg md:text-2xl lg:text-[40px] text-nowrap whitespace-pre">Happy</p></div>);
}

// UPDATED: Frame129 now accepts percent prop
function Frame129({ percent }: { percent: number }) {
  return (<div className="content-stretch flex items-center justify-between relative shrink-0 w-full"><Frame128 /><p className="font-['Inter:Medium',_sans-serif] font-medium leading-[1.3] not-italic relative shrink-0 text-[#2d2d32] text-xl sm:text-2xl md:text-3xl lg:text-[48px] text-nowrap whitespace-pre">{percent}%</p></div>);
}

function Frame139() {
  return (<div className="relative shrink-0 size-8 sm:size-10 md:size-12 lg:size-[52px]"><svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 52 52"><g id="Frame 127"><circle cx="26" cy="26" fill="var(--fill-0, #FF8D54)" id="Ellipse 8" r="20" stroke="var(--stroke-0, white)" strokeWidth="8" /></g></svg></div>);
}

function Frame143() {
  return (<div className="content-stretch flex gap-2 sm:gap-4 md:gap-[28px] items-center relative shrink-0"><Frame139 /><p className="font-['Inter:Regular',_sans-serif] font-normal leading-[1.3] not-italic relative shrink-0 text-[#75757c] text-base sm:text-lg md:text-2xl lg:text-[40px] text-nowrap whitespace-pre">Neutral</p></div>);
}

// UPDATED: Frame130 now accepts percent prop
function Frame130({ percent }: { percent: number }) {
  return (<div className="content-stretch flex items-center justify-between relative shrink-0 w-full"><Frame143 /><p className="font-['Inter:Medium',_sans-serif] font-medium leading-[1.3] not-italic relative shrink-0 text-[#2d2d32] text-xl sm:text-2xl md:text-3xl lg:text-[48px] text-nowrap whitespace-pre">{percent}%</p></div>);
}

function Frame144() {
  return (<div className="relative shrink-0 size-8 sm:size-10 md:size-12 lg:size-[52px]"><svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 52 52"><g id="Frame 127"><circle cx="26" cy="26" fill="var(--fill-0, #FF2222)" id="Ellipse 8" r="20" stroke="var(--stroke-0, white)" strokeWidth="8" /></g></svg></div>);
}

function Frame149() {
  return (<div className="content-stretch flex gap-2 sm:gap-4 md:gap-[28px] items-center relative shrink-0"><Frame144 /><p className="font-['Inter:Regular',_sans-serif] font-normal leading-[1.3] not-italic relative shrink-0 text-[#75757c] text-base sm:text-lg md:text-2xl lg:text-[40px] text-nowrap whitespace-pre">Sad/Bad</p></div>);
}

// UPDATED: Frame131 now accepts percent prop
function Frame131({ percent }: { percent: number }) {
  return (<div className="content-stretch flex items-center justify-between relative shrink-0 w-full"><Frame149 /><p className="font-['Inter:Medium',_sans-serif] font-medium leading-[1.3] not-italic relative shrink-0 text-[#2d2d32] text-xl sm:text-2xl md:text-3xl lg:text-[48px] text-nowrap whitespace-pre">{percent}%</p></div>);
}

// UPDATED: Frame132 now accepts and passes percentages
function Frame132({ happyPercent, neutralPercent, sadPercent }: { 
  happyPercent: number; 
  neutralPercent: number; 
  sadPercent: number; 
}) {
  return (
    <div className="relative shrink-0 w-full">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-2 sm:gap-3 md:gap-[12px] items-start px-4 sm:px-6 md:px-[32px] py-0 relative w-full">
          <Frame129 percent={happyPercent} />
          <Frame130 percent={neutralPercent} />
          <Frame131 percent={sadPercent} />
        </div>
      </div>
    </div>
  );
}

function Stars2() {
  return (<div className="relative shrink-0 size-6 sm:size-8 md:size-10 lg:size-[48px]" data-name="stars-01"><svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 48"><g id="stars-01"><g id="Icon"><path d={svgPaths.p706a80} stroke="var(--stroke-0, #2AA01D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" /><path d={svgPaths.p25909b80} stroke="var(--stroke-0, #2AA01D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" /></g></g></svg></div>);
}

function Frame123() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="size-full">
        <div className="box-border content-stretch flex gap-2 sm:gap-3 md:gap-[16px] items-start px-2 sm:px-3 md:px-[16px] py-0 relative w-full">
          <Stars2 />
          <p className="basis-0 font-['Poppins:Regular',_sans-serif] grow leading-[1.5] min-h-px min-w-px not-italic relative shrink-0 text-[#2aa01d] text-xs sm:text-sm md:text-base lg:text-[28px]">This month showed a 12% rise in positive emotions during AR try-ons. Rings and Necklaces generated the highest happiness scores, with users spending an average of 38 seconds interacting per item.</p>
        </div>
      </div>
    </div>
  );
}

function Frame133() {
  return (
    <div className="bg-[#d7fbd3] relative rounded-lg md:rounded-[16px] shrink-0 w-full">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex flex-col gap-2 sm:gap-3 md:gap-[16px] items-start p-4 sm:p-6 md:p-[32px] relative w-full">
          <Frame123 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#90ffb9] border-solid inset-0 pointer-events-none rounded-[inherit]" />
    </div>
  );
}

// UPDATED: EmotionalEngagementAnalytics now accepts emotionStats
function EmotionalEngagementAnalytics({ emotionStats }: { 
  emotionStats: { happy_percentage: number; neutral_percentage: number; sad_percentage: number; total_samples: number } 
}) {
  return (
    <div className="bg-white relative rounded-xl md:rounded-[32px] shrink-0 w-full border border-[#eaecf0] shadow-sm" data-name="Emotional Engagement Analytics">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex flex-col gap-4 sm:gap-6 md:gap-[40px] items-start p-4 sm:p-6 md:p-[40px] relative w-full">
          <Frame126 />
          <EmotionBar 
            happyPercent={emotionStats.happy_percentage} 
            neutralPercent={emotionStats.neutral_percentage} 
            sadPercent={emotionStats.sad_percentage} 
          />
          <Frame132 
            happyPercent={emotionStats.happy_percentage}
            neutralPercent={emotionStats.neutral_percentage}
            sadPercent={emotionStats.sad_percentage}
          />
          <Frame133 />
        </div>
      </div>
    </div>
  );
}

// ========== TRENDING PRODUCTS - UPDATED WITH REAL DATA ==========

function DotsVertical1() {
  return (<div className="relative shrink-0 size-8 sm:size-10 md:size-12 lg:size-[64px]" data-name="dots-vertical"><svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64 64"><g id="dots-vertical"><g id="Icon"><path d={svgPaths.p25b79f80} stroke="var(--stroke-0, #98A2B3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5.33333" /><path d={svgPaths.p165f8400} stroke="var(--stroke-0, #98A2B3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5.33333" /><path d={svgPaths.p37ddcc00} stroke="var(--stroke-0, #98A2B3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5.33333" /></g></g></svg></div>);
}

function Dropdown1() {
  return (<button type="button" className="content-stretch flex flex-col items-start relative shrink-0 hover:bg-gray-100 rounded-full p-1" data-name="Dropdown"><DotsVertical1 /></button>);
}

function Frame150() {
  return (
    <div className="box-border content-stretch flex items-center justify-between px-0 py-2 md:py-[12px] relative shrink-0 w-full">
      <p className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[1.3] not-italic relative shrink-0 text-[#222226] text-lg sm:text-xl md:text-3xl lg:text-[48px] whitespace-normal md:whitespace-pre">Trending in "Try-on"</p>
      <Dropdown1 />
    </div>
  );
}

// NEW: ProductItem component for real products
function ProductItem({ product }: { product: TrendingProduct }) {
  const imageUrl = product.product_image || imgFrame134;

  return (
    <div className="bg-white box-border content-stretch flex flex-col gap-2 md:gap-[16px] items-start p-2 md:p-[16px] relative rounded-lg md:rounded-[32px] shrink-0 w-full shadow-sm border border-[#c9c9cc]">
      <div className="aspect-square sm:aspect-[546/542] pointer-events-none relative rounded-lg md:rounded-[24px] shrink-0 w-full overflow-hidden">
        <img 
          alt={product.product_name} 
          className="absolute left-0 top-0 max-w-none size-full object-cover" 
          src={imageUrl}
          onError={(e) => {
            e.currentTarget.src = imgFrame134;
          }}
        />
        <div aria-hidden="true" className="absolute border border-[#eeeeef] border-solid inset-0 rounded-[inherit]" />
      </div>
      
      <div className="relative shrink-0 w-full">
        <div className="size-full">
          <div className="box-border content-stretch flex flex-col gap-2 md:gap-[16px] items-start pb-2 md:pb-[12px] pt-0 px-2 md:px-[12px] relative w-full">
            <p className="font-['Inter:Medium',_sans-serif] font-medium leading-[1.3] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#222226] text-sm sm:text-base md:text-lg lg:text-[40px] w-full line-clamp-1">
              {product.product_name}
            </p>
            <div className="content-stretch flex gap-1 md:gap-[12px] items-center relative shrink-0">
              <div className="content-stretch flex font-['Inter:Regular',_sans-serif] font-normal gap-1 md:gap-[12px] items-center leading-[1.3] not-italic relative shrink-0 text-xs sm:text-sm md:text-base lg:text-[32px] text-nowrap whitespace-pre">
                <p className="relative shrink-0 text-[#8b8b91]">Try-on:</p>
                <p className="relative shrink-0 text-[#222226]">{product.try_count}</p>
              </div>
              <div className="content-stretch flex gap-1 md:gap-[12px] items-center relative shrink-0">
                <p className="font-['Inter:Medium',_sans-serif] font-['Inter:Regular',_sans-serif] font-medium font-normal leading-[1.3] not-italic relative shrink-0 text-[#8b8b91] text-xs sm:text-sm md:text-base lg:text-[32px] text-nowrap whitespace-pre">
                  <span>{`| `}</span>
                  <span className="text-[#222226]">😊 {product.positive_score}%</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// UPDATED: Items now maps over real trending products
function Items({ trendingProducts }: { trendingProducts: TrendingProduct[] }) {
  if (!trendingProducts || trendingProducts.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 lg:gap-[56px] items-start relative rounded-lg md:rounded-[32px] shrink-0 w-full">
        <div className="text-center p-8 text-gray-500 col-span-full">No trending products yet</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 lg:gap-[56px] items-start relative rounded-lg md:rounded-[32px] shrink-0 w-full" data-name="Items">
      {trendingProducts.map((product) => (
        <ProductItem key={product.product_id} product={product} />
      ))}
    </div>
  );
}

// UPDATED: Frame107 now passes trending products
function Frame107({ trendingProducts }: { trendingProducts: TrendingProduct[] }) {
  return (
    <div className="content-stretch flex flex-col items-start relative rounded-lg md:rounded-[32px] shrink-0 w-full">
      <Items trendingProducts={trendingProducts} />
    </div>
  );
}

// UPDATED: TrendingOnTryOn now accepts trending products
function TrendingOnTryOn({ trendingProducts }: { trendingProducts: TrendingProduct[] }) {
  return (
    <div className="bg-white relative rounded-xl md:rounded-[48px] shrink-0 w-full border border-[#eaecf0] shadow-sm" data-name="Trending on Try-on">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex flex-col gap-4 sm:gap-6 md:gap-[40px] items-start p-4 sm:p-6 md:p-[40px] relative w-full">
          <Frame150 />
          <Frame107 trendingProducts={trendingProducts} />
        </div>
      </div>
    </div>
  );
}

// [KEEP YOUR CAMPAIGN SECTION AS IS - TrendingOnTryOn1]

function DotsVertical2() {
  return (<div className="relative shrink-0 size-8 sm:size-10 md:size-12 lg:size-[64px]" data-name="dots-vertical"><svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64 64"><g id="dots-vertical"><g id="Icon"><path d={svgPaths.p12c63f0} stroke="var(--stroke-0, #98A2B3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5.33333" /><path d={svgPaths.p1313f620} stroke="var(--stroke-0, #98A2B3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5.33333" /><path d={svgPaths.p3dce5f20} stroke="var(--stroke-0, #98A2B3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5.33333" /></g></g></svg></div>);
}

function Dropdown2() {
  return (<button type="button" className="content-stretch flex flex-col items-start relative shrink-0 hover:bg-gray-100 rounded-full p-1" data-name="Dropdown"><DotsVertical2 /></button>);
}

function Frame166() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex items-center justify-between pb-4 sm:pb-6 md:pb-[40px] pt-2 md:pt-[12px] px-4 sm:px-6 md:px-[40px] relative w-full border-b border-[#eaecf0]">
          <p className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[1.3] not-italic relative shrink-0 text-[#222226] text-lg sm:text-xl md:text-3xl lg:text-[48px] text-nowrap whitespace-pre">{`Campaign & Offers`}</p>
          <Dropdown2 />
        </div>
      </div>
    </div>
  );
}

function Frame140() {
  return (<div className="pointer-events-none relative rounded-lg md:rounded-[32px] shrink-0 size-24 sm:size-32 md:size-40 lg:size-[160px] overflow-hidden"><img alt="Diwali Gold Sale offer" className="absolute left-0 top-0 max-w-none size-full object-cover" src={imgFrame134} /><div aria-hidden="true" className="absolute border border-[#c9c9cc] border-solid inset-0 rounded-[inherit] shadow-[2px_4px_8px_0px_rgba(0,0,0,0.04)]" /></div>);
}

function Frame167() {
  return (<div className="content-stretch flex font-['Inter:Regular',_sans-serif] font-normal gap-1 md:gap-[12px] items-center leading-[1.3] not-italic relative shrink-0 text-sm sm:text-base md:text-lg lg:text-[40px] text-nowrap whitespace-pre"><p className="relative shrink-0 text-[#8b8b91]">Ends in :</p><p className="relative shrink-0 text-[#222226]">3 Days</p></div>);
}

function Frame168() {
  return (<div className="content-stretch flex gap-1 md:gap-[12px] items-center relative shrink-0"><Frame167 /></div>);
}

function Content1() {
  return (
    <div className="basis-0 grow h-full min-h-px min-w-px relative shrink-0" data-name="Content">
      <div className="flex flex-col justify-center size-full">
        <div className="box-border content-stretch flex flex-col gap-2 md:gap-[16px] items-start justify-center pb-2 md:pb-[12px] pt-0 px-2 md:px-[12px] relative size-full">
          <p className="font-['Inter:Medium',_sans-serif] font-medium leading-[1.3] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#222226] text-lg sm:text-xl md:text-3xl lg:text-[48px] text-nowrap whitespace-pre line-clamp-1">Diwali Gold Sale offer</p>
          <Frame168 />
        </div>
      </div>
    </div>
  );
}

function Frame141() {
  return (<div className="basis-0 content-stretch flex gap-3 sm:gap-4 md:gap-[24px] grow items-center min-h-px min-w-px relative shrink-0"><Frame140 /><div className="basis-0 flex flex-row grow items-center self-stretch shrink-0"><Content1 /></div></div>);
}

function Trash01() {
  return (<div className="relative shrink-0 size-8 sm:size-10 md:size-12 lg:size-[60px]" data-name="trash-01"><svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 60 60"><g id="trash-01"><path d={svgPaths.p35532e00} id="Icon" stroke="var(--stroke-0, #8B8B91)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" /></g></svg></div>);
}

function ButtonsButton() {
  return (<button type="button" className="box-border content-stretch flex gap-1 md:gap-[12px] items-center justify-center overflow-clip p-2 sm:p-4 md:p-[30px] relative shrink-0 w-auto md:w-[120px] hover:bg-gray-100 rounded-md" data-name="Buttons/Button"><Trash01 /></button>);
}

function Edit01() {
  return (<div className="relative shrink-0 size-8 sm:size-10 md:size-12 lg:size-[60px]" data-name="edit-01"><svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 60 60"><g id="edit-01"><path d={svgPaths.p6184890} id="Icon" stroke="var(--stroke-0, #8B8B91)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" /></g></svg></div>);
}

function ButtonsButton1() {
  return (<button type="button" className="box-border content-stretch flex gap-1 md:gap-[12px] items-center justify-center overflow-clip p-2 sm:p-4 md:p-[30px] relative shrink-0 w-auto md:w-[120px] hover:bg-gray-100 rounded-md" data-name="Buttons/Button"><Edit01 /></button>);
}

function TableCell() {
  return (<div className="box-border content-stretch flex gap-1 sm:gap-2 md:gap-[8px] items-center p-2 sm:p-3 md:p-[24px] relative shrink-0"><ButtonsButton /><ButtonsButton1 /></div>);
}

function Items1() {
  return (
    <div className="content-stretch flex flex-col sm:flex-row gap-4 md:gap-[56px] items-center relative rounded-lg md:rounded-[32px] shrink-0 w-full" data-name="Items">
      <Frame141 />
      <TableCell />
    </div>
  );
}

function Frame124() {
  return (
    <div className="bg-white box-border content-stretch flex flex-col items-start px-2 sm:px-4 md:px-0 py-2 sm:py-3 md:py-[16px] relative rounded-lg md:rounded-[40px] shrink-0 w-full border border-gray-200 shadow-sm">
      <Items1 />
    </div>
  );
}

function Frame145() {
  return (
    <button type="button" className="relative rounded-lg md:rounded-[32px] shrink-0 w-full hover:opacity-90 transition-opacity" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\\'0 0 1328 126\\\' xmlns=\\\'http://www.w3.org/2000/svg\\\' preserveAspectRatio=\\\'none\\\'><rect x=\\\'0\\\' y=\\\'0\\\' height=\\\'100%\\\' width=\\\'100%\\\' fill=\\\'url(%23grad)\\\' opacity=\\\'1\\\'/><defs><radialGradient id=\\\'grad\\\' gradientUnits=\\\'userSpaceOnUse\\\' cx=\\\'0\\\' cy=\\\'0\\\' r=\\\'10\\\' gradientTransform=\\\'matrix(66.4 0 0 6.3 664 63)\\\'><stop stop-color=\\\'rgba(255,160,71,1)\\\' offset=\\\'0\\\'/><stop stop-color=\\\'rgba(251,145,46,1)\\\' offset=\\\'0.5\\\'/><stop stop-color=\\\'rgba(247,130,21,1)\\\' offset=\\\'1\\\'/></radialGradient></defs></svg>')" }}>
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-2 md:gap-[10px] items-center justify-center px-2 md:px-[10px] py-4 md:py-[32px] relative w-full">
          <p className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[1.3] not-italic relative shrink-0 text-lg sm:text-xl md:text-3xl lg:text-[48px] text-nowrap text-white whitespace-pre">Create New Promo</p>
        </div>
      </div>
    </button>
  );
}

function Frame148() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-4 sm:gap-6 md:gap-[40px] items-start px-4 sm:px-6 md:px-[40px] py-0 relative w-full">
          {[...Array(3).keys()].map((_, i) => (
            <Frame124 key={i} />
          ))}
          <Frame145 />
        </div>
      </div>
    </div>
  );
}

function TrendingOnTryOn1() {
  return (
    <div className="bg-white relative rounded-xl md:rounded-[32px] shrink-0 w-full border border-[#eaecf0] shadow-sm" data-name="Trending on Try-on">
      <div className="box-border content-stretch flex flex-col gap-4 sm:gap-6 md:gap-[40px] items-start overflow-clip pb-4 sm:pb-6 md:pb-[40px] pt-3 sm:pt-4 md:pt-[24px] px-0 relative rounded-[inherit] w-full">
        <Frame166 />
        <Frame148 />
      </div>
    </div>
  );
}

// UPDATED: Frame101 now accepts and passes emotion stats and trending products
function Frame101({ 
  visitors, 
  tryOns, 
  repeatedUsers, 
  currentMonthTryOns, 
  lastMonthTryOns, 
  twoMonthsAgoTryOns,
  emotionStats,
  trendingProducts
}: { 
  visitors: number; 
  tryOns: number; 
  repeatedUsers: number;
  currentMonthTryOns: number;
  lastMonthTryOns: number;
  twoMonthsAgoTryOns: number;
  emotionStats: { happy_percentage: number; neutral_percentage: number; sad_percentage: number; total_samples: number };
  trendingProducts: TrendingProduct[];
}) {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-col items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex flex-col gap-6 sm:gap-8 md:gap-10 lg:gap-[40px] items-center justify-center px-4 sm:px-8 md:px-16 lg:px-[96px] py-6 sm:py-8 md:py-[48px] relative w-full">
          <Frame116 
            visitors={visitors} 
            tryOns={tryOns} 
            repeatedUsers={repeatedUsers}
            currentMonthTryOns={currentMonthTryOns}
            lastMonthTryOns={lastMonthTryOns}
            twoMonthsAgoTryOns={twoMonthsAgoTryOns}
          />
          <EmotionalEngagementAnalytics emotionStats={emotionStats} />
          <TrendingOnTryOn trendingProducts={trendingProducts} />
          <TrendingOnTryOn1 />
        </div>
      </div>
    </div>
  );
}

// UPDATED: Main component now uses useAdminDashboard hook
export default function AlankaraAiDashboard({ onExit }: { onExit?: () => void }) {
  const { dashboardData, loading } = useAdminDashboard();
  
  // Show loading state
  if (loading || !dashboardData) {
    return (
      <div className="bg-white content-stretch flex flex-col items-start relative w-full min-h-screen" data-name="Alankara Ai - Dashboard">
        <Header onExit={onExit} />
        <Frame100 />
        <div className="w-full flex justify-center items-center p-10">
          <p className="font-['Inter:Medium',_sans-serif] text-xl">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Render with real data
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative w-full min-h-screen" data-name="Alankara Ai - Dashboard">
      <Header onExit={onExit} />
      <Frame100 />
      <SecuritySettings />
      {/* ⭐ NEW: Campaign Manager Component Added Here */}
      <div className="w-full px-4 sm:px-8 md:px-16 lg:px-[96px] py-6">
        <CampaignManager />
      </div>
      <Frame101 
        visitors={dashboardData.total_visitors} 
        tryOns={dashboardData.total_try_ons} 
        repeatedUsers={dashboardData.repeated_users}
        currentMonthTryOns={dashboardData.current_month_try_ons}
        lastMonthTryOns={dashboardData.last_month_try_ons}
        twoMonthsAgoTryOns={dashboardData.two_months_ago_try_ons}
        emotionStats={dashboardData.emotion_stats}
        trendingProducts={dashboardData.trending_products}
      />
    </div>
  );
}