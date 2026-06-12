// src/imports/ProductPage.tsx
import React, { useState } from "react"; // Added React import
// Assuming svgPaths are correctly defined in this file based on your project structure
import svgPaths from "./svg-eesnoli9q3";
// Assuming these image imports resolve correctly via your bundler (Vite alias)
import imgImage41 from "figma:asset/2b9d147cd4bc2e8066aa4be3962f3b56cbeaa1cf.png";
import imgImage48 from "figma:asset/56eec9f31f5047398a011db41854b5a8c8a20924.png";
import imgImage49 from "figma:asset/a3d71be07a9d660969dffea5a85717267457b3bc.png";
import imgImage47 from "figma:asset/409ed5f751806f8023bc3b462845618f2dce0566.png";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";

// --- Component: Logo ---
function Logo() {
  return <div className="content-stretch flex gap-2 md:gap-[10px] items-center justify-center relative shrink-0" data-name="logo">
      {/* Responsive text size */}
      <p className="font-['Playfair_Display:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[#2a120a] text-3xl sm:text-4xl md:text-5xl lg:text-[60px] text-nowrap whitespace-pre">Alankara AI</p>
    </div>;
}

// --- Component: SearchIcon ---
function SearchIcon() {
  return (
    // Responsive size
    <div className="relative shrink-0 size-10 sm:size-12 md:size-14 lg:size-16" data-name="Search Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64 64">
        <g id="Search Icon">
          {/* Ensure svgPaths.p1b92c370 is correctly defined */}
          <path d={svgPaths.p1b92c370} id="Icon" stroke="var(--stroke-0, #7C563D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" />
        </g>
      </svg>
    </div>
  );
}

// --- Component: SearchContainer ---
function SearchContainer() {
  return (
    // Responsive gap
    <div className="content-stretch flex gap-8 md:gap-[48px] items-center relative shrink-0" data-name="Search Container">
      <SearchIcon />
    </div>
  );
}

// --- Component: LogOut01 ---
function LogOut01() {
  return (
    // Responsive size
    <div className="relative shrink-0 size-10 sm:size-12 md:size-14 lg:size-16" data-name="log-out-01">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64 64">
        <g id="log-out-01">
          {/* Ensure svgPaths.p9897f40 is correctly defined */}
          <path d={svgPaths.p9897f40} id="Icon" stroke="var(--stroke-0, #7C563D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5.33333" />
        </g>
      </svg>
    </div>
  );
}

// --- Component: Frame217 (Header Actions) ---
function Frame217() {
  return (
    // Responsive gap
    <div className="content-stretch flex gap-4 sm:gap-6 md:gap-8 lg:gap-[40px] items-center relative shrink-0">
      <SearchContainer />
      <LogOut01 />
    </div>
  );
}

// --- Component: Header ---
function Header() {
  return <div className="bg-[#f6e1d2] relative shrink-0 w-full" data-name="Header">
      <div className="flex flex-col md:flex-row items-center justify-between overflow-clip rounded-[inherit] size-full">
        {/* Responsive padding and layout */}
        <div className="box-border content-stretch flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 py-4 sm:py-6 md:py-8 lg:py-12 relative w-full gap-4 md:gap-0">
          <Logo />
          <Frame217 />
        </div>
      </div>
      {/* Bottom border */}
      <div aria-hidden="true" className="absolute border-b-4 border-x-0 border-t-0 border-[#eaecf0] border-solid inset-0 pointer-events-none" />
    </div>;
}

// --- Component: Breadcrumbs ---
// CHANGE: Added `onBack` prop to the Breadcrumbs component definition.
// This allows passing a function from the parent (ProductPage) to handle the back action.
function Breadcrumbs({
  onBack
}: {
  onBack?: () => void;
}) {
  return <div className="relative shrink-0 w-full" data-name="Breadcrumbs">
      <div className="overflow-clip rounded-[inherit] size-full">
        {/* Responsive padding and gap */}
        <div className="box-border content-stretch flex gap-2 md:gap-[10px] items-center px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 py-4 sm:py-6 md:py-8 lg:py-12 relative w-full">
          {/* CHANGE: Wrapped the back arrow SVG in a button element. */}
          {/* Added an `onClick` handler that calls the `onBack` function passed via props. */}
          {/* Added basic styling for a button (transparent background, no border, hover effect). */}
          {/* Added `aria-label` for accessibility. */}
          <button onClick={onBack} // Call the passed-in onBack function when clicked
        className="relative shrink-0 size-8 sm:size-10 md:size-12 lg:size-[48px] hover:opacity-70 transition-opacity cursor-pointer" // Added cursor-pointer
        aria-label="Go back" // Accessibility label
        style={{
          background: 'transparent',
          border: 'none',
          padding: 0
        }} // Basic button styling
        data-name="Back Arrow">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 48">
              <g id="Back Arrow">
                <path d="M38 24H10M10 24L24 38M10 24L24 10" id="Icon" stroke="#A06F4F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
              </g>
            </svg>
          </button>
          {/* Page Title - Responsive text size */}
          <div className="flex flex-col font-['Poppins:Medium',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#a06f4f] text-xl sm:text-2xl md:text-3xl lg:text-[40px] text-nowrap uppercase">
            <p className="leading-[normal] whitespace-pre">VIDEO SHOPPING</p>
          </div>
        </div>
      </div>
    </div>;
}

// --- Component: Frame229 (Section Title) ---
function Frame229() {
  return <div className="relative shrink-0 w-full">
      <div className="overflow-clip rounded-[inherit] size-full">
        {/* Responsive padding */}
        <div className="box-border content-stretch flex gap-2 md:gap-[10px] items-start px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 py-2 md:py-[10px] relative w-full">
          {/* Responsive text size, allow wrapping on smaller screens */}
          <p className="font-['Playfair_Display:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[#7c563d] text-2xl sm:text-3xl md:text-4xl lg:text-[48px] whitespace-normal md:whitespace-pre">Amazing Live Shopping Experience</p>
        </div>
      </div>
    </div>;
}

// --- Component: Frame230 (Description Text) ---
function Frame230() {
  return <div className="relative shrink-0 w-full">
      <div className="overflow-clip rounded-[inherit] size-full">
         {/* Responsive padding */}
        <div className="box-border content-stretch flex gap-2 md:gap-[10px] items-start px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 py-2 md:py-[10px] relative w-full">
           {/* Responsive text size */}
          <p className="basis-0 font-['Poppins:Regular',_sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#7c563d] text-sm sm:text-base md:text-lg lg:text-xl xl:text-[24px]">
            Experience jewelry shopping like never before with our live video consultation. Connect face-to-face with our expert consultants who will guide you through our exquisite collection, answer your questions in real-time, and help you find the perfect piece that matches your style and budget. Book your personalized session today!
          </p>
        </div>
      </div>
    </div>;
}

// --- Component: ImageContainer (Main Image) ---
function ImageContainer() {
  return (
    // Responsive width and height
    <div className="relative shrink-0 w-full md:w-96 lg:w-[600px] xl:w-[752px] h-64 sm:h-80 md:h-96 lg:h-[600px] xl:h-[752px]" data-name="Image Container">
      <div className="relative size-full" data-name="image 41">
        {/* Added alt text */}
        <img alt="Live video shopping session" className="absolute inset-0 max-w-none object-contain sm:object-cover pointer-events-none size-full rounded-lg" src={imgImage41} />
      </div>
    </div>
  );
}

// --- Component: Frame219 (Label for Name Input) ---
function Frame219() {
  return (
    // Responsive text size and gap
    <div className="content-stretch flex font-['Poppins:Medium',_sans-serif] gap-1 md:gap-[12px] items-start leading-[0] not-italic relative shrink-0 text-[#5f422f] text-base sm:text-lg md:text-xl lg:text-[28px] text-nowrap w-full">
      <div className="flex flex-col justify-center relative shrink-0">
        <p className="leading-[1.4] text-nowrap whitespace-pre">Name:</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0">
        <p className="leading-[1.4] text-nowrap whitespace-pre">*</p>
      </div>
    </div>
  );
}

// --- Component: FormField (Reusable Input) ---
interface FormFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string; // Added type prop for flexibility (e.g., text, email, tel)
}
function FormField({
  value,
  onChange,
  placeholder,
  type = "text"
}: FormFieldProps) {
  return (
    // Responsive rounding
    <div className="bg-[#fcf5f1] relative rounded-lg md:rounded-[12px] shrink-0 w-full" data-name="Form field">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        {/* Responsive padding and gap */}
        <div className="box-border content-stretch flex gap-1 md:gap-[10px] items-center px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4 relative w-full">
          <input type={type} // Use the passed type
          value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          // Responsive text size
          className="flex-1 bg-transparent font-['Poppins:Regular',_sans-serif] leading-[1.4] not-italic text-[#7c563d] text-sm sm:text-base md:text-lg lg:text-xl xl:text-[24px] outline-none placeholder:text-[#e29d6f]" />
        </div>
      </div>
      {/* Border */}
      <div aria-hidden="true" className="absolute border border-[#e29d6f] border-solid inset-0 pointer-events-none rounded-lg md:rounded-[12px]" />
    </div>
  );
}

// --- Component: Frame222 (Name Input Section) ---
function Frame222({
  value,
  onChange
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    // Responsive gap
    <div className="content-stretch flex flex-col gap-2 md:gap-3 items-start relative shrink-0 w-full">
      <Frame219 />
      <FormField value={value} onChange={onChange} placeholder="Enter your name" />
    </div>
  );
}

// --- Component: Frame220 (Label for Mobile Input) ---
function Frame220() {
  return (
    // Responsive text size and gap
    <div className="content-stretch flex font-['Poppins:Medium',_sans-serif] gap-1 md:gap-[12px] items-start leading-[0] not-italic relative shrink-0 text-[#5f422f] text-base sm:text-lg md:text-xl lg:text-[28px] text-nowrap w-full">
      <div className="flex flex-col justify-center relative shrink-0">
        <p className="leading-[1.4] text-nowrap whitespace-pre">Mobile No:</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0">
        <p className="leading-[1.4] text-nowrap whitespace-pre">*</p>
      </div>
    </div>
  );
}

// --- Component: Frame223 (Mobile Input Section) ---
function Frame223({
  value,
  onChange
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    // Responsive gap
    <div className="content-stretch flex flex-col gap-2 md:gap-3 items-start relative shrink-0 w-full">
      <Frame220 />
      {/* Set input type to "tel" for mobile numbers */}
      <FormField value={value} onChange={onChange} placeholder="Enter mobile number" type="tel" />
    </div>
  );
}

// --- Component: Frame221 (Label for Email Input) ---
function Frame221() {
  return (
    // Responsive text size and gap
    <div className="content-stretch flex font-['Poppins:Medium',_sans-serif] gap-1 md:gap-[12px] items-start leading-[0] not-italic relative shrink-0 text-[#5f422f] text-base sm:text-lg md:text-xl lg:text-[28px] text-nowrap w-full">
      <div className="flex flex-col justify-center relative shrink-0">
        <p className="leading-[1.4] text-nowrap whitespace-pre">Email:</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0">
        <p className="leading-[1.4] text-nowrap whitespace-pre">*</p>
      </div>
    </div>
  );
}

// --- Component: Frame224 (Email Input Section) ---
function Frame224({
  value,
  onChange
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    // Responsive gap
    <div className="content-stretch flex flex-col gap-2 md:gap-3 items-start relative shrink-0 w-full">
      <Frame221 />
       {/* Set input type to "email" */}
      <FormField value={value} onChange={onChange} placeholder="Enter email address" type="email" />
    </div>
  );
}

// --- Component: Frame238 (Label for Language Selection) ---
function Frame238() {
  return (
    // Responsive text size and gap
    <div className="content-stretch flex font-['Poppins:Medium',_sans-serif] gap-1 md:gap-[12px] items-start leading-[0] not-italic relative shrink-0 text-[#5f422f] text-base sm:text-lg md:text-xl lg:text-[28px] text-nowrap w-full">
      <div className="flex flex-col justify-center relative shrink-0">
        <p className="leading-[1.4] text-nowrap whitespace-pre">Select Language:</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0">
        <p className="leading-[1.4] text-nowrap whitespace-pre">*</p>
      </div>
    </div>
  );
}

// --- Component: LanguageButton ---
interface LanguageButtonProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}
function LanguageButton({
  label,
  isSelected,
  onClick
}: LanguageButtonProps) {
  return <button type="button" // Prevent form submission
  onClick={onClick}
  // Styling changes based on isSelected state, added hover state
  className={`basis-0 grow min-h-px min-w-px relative rounded-lg md:rounded-[12px] shrink-0 transition-colors ${isSelected ? "bg-[#e29d6f]" : "bg-[#fcf5f1] hover:bg-[#f6e1d2]"}`} data-name="Form field">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        {/* Responsive padding */}
        <div className="box-border content-stretch flex gap-1 md:gap-[10px] items-center justify-center px-2 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4 relative w-full">
          {/* Responsive text size and color change */}
          <div className={`flex flex-col font-['Poppins:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-xs sm:text-sm md:text-base lg:text-lg xl:text-[24px] text-nowrap ${isSelected ? "text-[#fcf5f1]" : "text-[#ce8f65]"}`}>
            <p className="leading-[1.4] whitespace-pre">{label}</p>
          </div>
        </div>
      </div>
      {/* Border styling change */}
      <div aria-hidden="true" className={`absolute border border-solid inset-0 pointer-events-none rounded-lg md:rounded-[12px] ${isSelected ? "border-[#ce8f65]" : "border-[#e29d6f]"}`} />
    </button>;
}

// --- Component: Frame226 (Language Button Group) ---
function Frame226({
  selectedLanguage,
  onLanguageChange
}: {
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
}) {
  return (
    // Responsive gap
    <div className="content-stretch flex gap-2 sm:gap-3 md:gap-4 items-start relative shrink-0 w-full">
      <LanguageButton label="English" isSelected={selectedLanguage === "English"} onClick={() => onLanguageChange("English")} />
      <LanguageButton label="Telugu" isSelected={selectedLanguage === "Telugu"} onClick={() => onLanguageChange("Telugu")} />
      <LanguageButton label="Hindi" isSelected={selectedLanguage === "Hindi"} onClick={() => onLanguageChange("Hindi")} />
    </div>
  );
}

// --- Component: Frame225 (Language Selection Section) ---
function Frame225({
  selectedLanguage,
  onLanguageChange
}: {
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
}) {
  return (
    // Responsive gap
    <div className="content-stretch flex flex-col gap-2 md:gap-3 items-start relative shrink-0 w-full">
      <Frame238 />
      <Frame226 selectedLanguage={selectedLanguage} onLanguageChange={onLanguageChange} />
    </div>
  );
}

// --- Component: Frame239 (Label for Time Selection) ---
function Frame239() {
  return (
    // Responsive text size and gap
    <div className="content-stretch flex font-['Poppins:Medium',_sans-serif] gap-1 md:gap-[12px] items-start leading-[0] not-italic relative shrink-0 text-[#5f422f] text-base sm:text-lg md:text-xl lg:text-[28px] text-nowrap w-full">
      <div className="flex flex-col justify-center relative shrink-0">
        <p className="leading-[1.4] text-nowrap whitespace-pre">Select Time:</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0">
        <p className="leading-[1.4] text-nowrap whitespace-pre">*</p>
      </div>
    </div>
  );
}

// --- Component: TimeInput (for Hour, Minute, Period) ---
interface TimeInputProps {
  value: string;
  onChange: (value: string) => void;
  options?: string[];
  placeholder: string;
}
function TimeInput({
  value,
  onChange,
  options,
  placeholder
}: TimeInputProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  return <div className="relative content-stretch flex gap-1 md:gap-2 items-start shrink-0">
      {/* Responsive min-width */}
      <div className="bg-[#fcf5f1] relative rounded-lg md:rounded-[12px] shrink-0 min-w-[60px] sm:min-w-[80px] md:min-w-[100px]" data-name="Form field">
        {/* Responsive padding and gap */}
        <div className="box-border content-stretch flex gap-1 md:gap-[10px] items-center justify-center overflow-clip px-1 sm:px-2 md:px-3 py-1 sm:py-2 md:py-2.5 relative rounded-[inherit]">
          <input type="text" value={value} onChange={e => onChange(e.target.value)}
        // Show dropdown on focus if options exist
        onFocus={() => options && setShowDropdown(true)}
        // Hide dropdown on blur (with delay to allow clicking options)
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)} placeholder={placeholder}
        // Responsive text size and width
        className="flex flex-col font-['Poppins:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#7c563d] text-xs sm:text-sm md:text-base lg:text-lg xl:text-[24px] w-8 sm:w-10 md:w-12 bg-transparent outline-none text-center placeholder:text-[#ce8f65]" readOnly // Make input read-only if options are provided to force selection
        aria-haspopup="listbox" // Accessibility attribute
        aria-expanded={showDropdown} // Accessibility attribute
        />
          {/* Dropdown arrow button (if options exist) */}
          {options && <button type="button" // Prevent form submission
        onClick={() => setShowDropdown(!showDropdown)}
        // Responsive size for the arrow container
        className="flex size-6 sm:size-7 md:size-8 items-center justify-center relative shrink-0" style={{
          "--transform-inner-width": "47.984375",
          "--transform-inner-height": "47.984375"
        } as React.CSSProperties} // Keep style if needed for complex transforms
        aria-label="Toggle time options" // Accessibility label
        >
              <div className="flex-none rotate-[270deg]">
                {/* Responsive size for the arrow SVG */}
                <div className="relative size-4 sm:size-5 md:size-6 lg:size-[32px]" data-name="chevron_backward">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 48">
                    <g id="chevron_backward">
                      <path d={svgPaths.p15a74900} fill="var(--fill-0, #CE8F65)" id="icon" />
                    </g>
                  </svg>
                </div>
              </div>
            </button>}
        </div>
        {/* Border */}
        <div aria-hidden="true" className="absolute border border-[#ce8f65] border-solid inset-0 pointer-events-none rounded-lg md:rounded-[12px]" />

        {/* Dropdown List */}
        {options && showDropdown &&
      // Styling for the dropdown panel
      <div role="listbox" className="absolute top-full left-0 mt-1 bg-[#fcf5f1] border border-[#ce8f65] rounded-lg md:rounded-[12px] shadow-lg z-10 max-h-32 sm:max-h-40 md:max-h-[160px] overflow-y-auto">
            {options.map(option => <button type="button" // Prevent form submission
        key={option} role="option" // Accessibility attribute
        aria-selected={value === option} // Accessibility attribute
        // Update value and close dropdown on click
        onClick={() => {
          onChange(option);
          setShowDropdown(false);
        }}
        // Styling for dropdown items
        className="w-full px-2 sm:px-3 md:px-3 py-1 sm:py-1.5 md:py-2 text-left font-['Poppins:Regular',_sans-serif] text-xs sm:text-sm md:text-base lg:text-lg text-[#7c563d] hover:bg-[#e29d6f] hover:text-[#fcf5f1] transition-colors">
                {option}
              </button>)}
          </div>}
      </div>
    </div>;
}

// --- Component: Frame241 (Time Input Group) ---
function Frame241({
  time,
  onTimeChange
}: {
  time: {
    hour: string;
    minute: string;
    period: string;
  };
  onTimeChange: (field: 'hour' | 'minute' | 'period', value: string) => void;
}) {
  // Generate options for hours, minutes, and periods
  const hours = Array.from({
    length: 12
  }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minutes = Array.from({
    length: 60
  }, (_, i) => i.toString().padStart(2, '0'));
  const periods = ['AM', 'PM'];
  return (
    // Responsive gap
    <div className="content-stretch flex gap-2 sm:gap-3 md:gap-4 items-start relative shrink-0">
      <TimeInput value={time.hour} onChange={val => onTimeChange('hour', val)} options={hours} placeholder="HH" />
      <TimeInput value={time.minute} onChange={val => onTimeChange('minute', val)} options={minutes} placeholder="MM" />
      <TimeInput value={time.period} onChange={val => onTimeChange('period', val)} options={periods} placeholder="AM/PM" // Changed placeholder
      />
    </div>
  );
}

// --- Component: Frame242 (Time Selection Section) ---
function Frame242({
  time,
  onTimeChange
}: {
  time: {
    hour: string;
    minute: string;
    period: string;
  };
  onTimeChange: (field: 'hour' | 'minute' | 'period', value: string) => void;
}) {
  return (
    // Responsive gap
    <div className="content-stretch flex flex-col gap-2 md:gap-3 items-start relative shrink-0 w-full">
      
      <Frame241 time={time} onTimeChange={onTimeChange} />
    </div>
  );
}

// --- Component: FormField9 (Submit Button) ---
function FormField9({
  onClick
}: {
  onClick?: () => void;
}) {
  // Made onClick optional as it triggers form submit
  return <button onClick={onClick} // Keep onClick if needed for other actions, but submit is handled by form
  // Added hover state
  className="bg-[#7c563d] relative rounded-lg md:rounded-[12px] shrink-0 w-full hover:bg-[#5f422f] transition-colors" data-name="Form field" type="submit" // Set type to submit for form handling
  >
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
         {/* Responsive padding */}
        <div className="box-border content-stretch flex gap-1 md:gap-[10px] items-center justify-center px-4 sm:px-6 md:px-8 lg:px-10 py-2 sm:py-3 md:py-4 relative w-full">
           {/* Responsive text size */}
          <div className="flex flex-col font-['Poppins:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#fcf5f1] text-sm sm:text-base md:text-lg lg:text-xl xl:text-[28px] text-nowrap">
            <p className="leading-[1.4] whitespace-pre">Submit</p>
          </div>
        </div>
      </div>
      {/* Border */}
      <div aria-hidden="true" className="absolute border border-[#fcf5f1] border-solid inset-0 pointer-events-none rounded-lg md:rounded-[12px]" />
    </button>;
}

// --- Component: Frame243 (Submit Button Container) ---
function Frame243({
  onSubmit
}: {
  onSubmit: () => void;
}) {
  // onSubmit might not be strictly needed here if handled by form
  return (
    // Responsive gap, added padding top
    <div className="content-stretch flex flex-col gap-2 md:gap-3 items-center justify-center relative shrink-0 w-full pt-4">
      <FormField9 /> {/* Button inside will trigger the form's onSubmit */}
    </div>
  );
}

// --- Component: InfoContainer (Form Section) ---
interface InfoContainerProps {
  formData: {
    name: string;
    mobile: string;
    email: string;
    language: string;
    time: {
      hour: string;
      minute: string;
      period: string;
    };
  };
  onFormChange: (field: string, value: any) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void; // Type for form event
}
function InfoContainer({
  formData,
  onFormChange,
  onSubmit
}: InfoContainerProps) {
  return (
    // Added <form> element for semantic structure and form handling
    // Responsive gap and width
    <form onSubmit={onSubmit} // Handle form submission here
    className="content-stretch flex flex-col gap-4 sm:gap-6 md:gap-8 lg:gap-10 items-start relative self-stretch shrink-0 w-full md:w-auto lg:w-[500px] xl:w-[608px]" // Adjusted width classes
    data-name="Info Container" noValidate // Prevent default browser validation, rely on custom validation
    >
      <Frame222 value={formData.name} onChange={val => onFormChange('name', val)} />
      <Frame223 value={formData.mobile} onChange={val => onFormChange('mobile', val)} />
      <Frame224 value={formData.email} onChange={val => onFormChange('email', val)} />
      <Frame225 selectedLanguage={formData.language} onLanguageChange={val => onFormChange('language', val)} />

      {/* Time Selection */}
      <Frame239 />
      <Frame242 
        time={formData.time} 
        onTimeChange={(field, value) => onFormChange('time', { ...formData.time, [field]: value })} 
      />
      
      {/* onSubmit on the form handles the submission */}
      <Frame243 onSubmit={() => {/* Can keep this empty or log button click */}} />
    </form>
  );
}

// --- Component: ProductContainer (Image and Form Layout) ---
// Changed onSubmit prop type
interface ProductContainerProps {
  formData: {
    name: string;
    mobile: string;
    email: string;
    language: string;
    time: {
      hour: string;
      minute: string;
      period: string;
    };
  };
  onFormChange: (field: string, value: any) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}
function ProductContainer({
  formData,
  onFormChange,
  onSubmit
}: ProductContainerProps) {
  return <div className="relative shrink-0 w-full" data-name="Product Container">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
         {/* Responsive padding, layout direction (col then lg:row), and gap */}
        <div className="box-border content-stretch flex flex-col lg:flex-row gap-6 sm:gap-8 md:gap-10 lg:gap-[32px] items-center lg:items-start justify-center px-4 sm:px-8 md:px-12 lg:px-16 xl:px-[96px] py-6 sm:py-8 md:py-10 lg:py-[40px] relative w-full">
          <ImageContainer />
          {/* Pass onSubmit down to the InfoContainer (which is now a form) */}
          <InfoContainer formData={formData} onFormChange={onFormChange} onSubmit={onSubmit} />
        </div>
      </div>
    </div>;
}

// --- Component: Frame233 (Section Title: Know The Process) ---
function Frame233() {
  return <div className="relative shrink-0 w-full">
      <div className="overflow-clip rounded-[inherit] size-full">
        {/* Responsive padding */}
        <div className="box-border content-stretch flex gap-2 md:gap-[10px] items-start px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 py-2 md:py-[10px] relative w-full">
           {/* Responsive text size and underline offset */}
          <p className="[text-decoration-skip-ink:none] text-underline-offset-4 md:[text-underline-offset:30%] decoration-solid font-['Playfair_Display:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[#5f422f] text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[60px] text-nowrap underline whitespace-pre">Know The Process</p>
        </div>
      </div>
    </div>;
}

// --- Component: Frame235 (Step 1 Text) ---
function Frame235() {
  return <div className="basis-0 content-stretch flex gap-2 md:gap-[10px] grow items-center justify-center min-h-px min-w-px relative shrink-0">
       {/* Responsive text size */}
      <p className="font-['Poppins:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#7c563d] text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-[40px] whitespace-normal md:whitespace-pre text-center">Book Your Free Slot</p>
    </div>;
}

// --- Component: Frame234 (Step 1 Section) ---
function Frame234() {
  return (
    // Responsive rounding
    <div className="bg-[#fdfdfd] relative rounded-xl md:rounded-2xl lg:rounded-[32px] shrink-0 w-full">
      <div className="flex flex-col md:flex-row items-center overflow-clip rounded-[inherit] size-full">
        {/* Responsive padding, gap, and layout */}
        <div className="box-border content-stretch flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8 lg:gap-12 items-center px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 py-4 sm:py-6 md:py-8 lg:py-0 relative w-full">
          <Frame235 />
           {/* Responsive width and height */}
          <div className="relative shrink-0 w-full md:w-56 lg:w-72 xl:w-80 h-40 sm:h-56 md:h-64 lg:h-72 xl:h-[350px]" data-name="image 48">
            <img alt="Illustration for booking a slot" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full rounded-lg" src={imgImage48} />
          </div>
        </div>
      </div>
      {/* Border */}
      <div aria-hidden="true" className="absolute border border-[#ecbd9f] border-solid inset-0 pointer-events-none rounded-xl md:rounded-2xl lg:rounded-[32px]" />
    </div>
  );
}

// --- Component: Frame244 (Step 2 Text) ---
function Frame244() {
  return <div className="basis-0 content-stretch flex gap-2 md:gap-[10px] grow items-center justify-center min-h-px min-w-px relative shrink-0">
       {/* Responsive text size */}
      <p className="basis-0 font-['Poppins:Regular',_sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#7c563d] text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-[32px] text-center md:text-left">Our team will call you to confirm the appointment and to understand your requirement to Showcase the Product.</p>
    </div>;
}

// --- Component: Frame245 (Step 2 Section) ---
function Frame245() {
  return (
    // Responsive rounding
    <div className="bg-[#fdfdfd] relative rounded-xl md:rounded-2xl lg:rounded-[32px] shrink-0 w-full">
      <div className="flex flex-col md:flex-row items-center overflow-clip rounded-[inherit] size-full">
        {/* Responsive padding, gap, and layout */}
        <div className="box-border content-stretch flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8 lg:gap-12 items-center px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 py-4 sm:py-6 md:py-8 relative w-full">
           {/* Responsive width and height, order change */}
          <div className="relative shrink-0 w-full md:w-56 lg:w-72 xl:w-80 h-40 sm:h-56 md:h-64 lg:h-72 xl:h-[350px] order-2 md:order-1" data-name="image 49">
            <img alt="Illustration of call confirmation" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full rounded-lg" src={imgImage49} />
          </div>
          <div className="order-1 md:order-2 w-full"><Frame244 /></div>
        </div>
      </div>
       {/* Border */}
      <div aria-hidden="true" className="absolute border border-[#ecbd9f] border-solid inset-0 pointer-events-none rounded-xl md:rounded-2xl lg:rounded-[32px]" />
    </div>
  );
}

// --- Component: Frame246 (Step 3 Text) ---
function Frame246() {
  return <div className="basis-0 content-stretch flex gap-2 md:gap-[10px] grow items-center justify-center min-h-px min-w-px relative shrink-0">
       {/* Responsive text size */}
      <p className="basis-0 font-['Poppins:Regular',_sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#7c563d] text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-[32px] text-center md:text-left">Have an Exceptional Live Video Shopping Experience.</p>
    </div>;
}

// --- Component: Frame236 (Step 3 Section) ---
function Frame236() {
  return (
    // Responsive rounding
    <div className="bg-[#fdfdfd] relative rounded-xl md:rounded-2xl lg:rounded-[32px] shrink-0 w-full">
      <div className="flex flex-col md:flex-row items-center overflow-clip rounded-[inherit] size-full">
        {/* Responsive padding, gap, and layout */}
        <div className="box-border content-stretch flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8 lg:gap-12 items-center px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 py-4 sm:py-6 md:py-8 relative w-full">
          <Frame246 />
           {/* Responsive width and height */}
          <div className="relative shrink-0 w-full md:w-64 lg:w-80 xl:w-[500px] h-32 sm:h-40 md:h-48 lg:h-56 xl:h-[260px]" data-name="image 47">
            <img alt="Illustration of live video shopping" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full rounded-lg" src={imgImage47} />
          </div>
        </div>
      </div>
       {/* Border */}
      <div aria-hidden="true" className="absolute border border-[#ecbd9f] border-solid inset-0 pointer-events-none rounded-xl md:rounded-2xl lg:rounded-[32px]" />
    </div>
  );
}

// --- Component: Frame237 (Container for Steps) ---
function Frame237() {
  return (
    // Responsive gap
    <div className="content-stretch flex flex-col gap-3 sm:gap-4 md:gap-5 items-start relative shrink-0 w-full">
      <Frame234 />
      <Frame245 />
      <Frame236 />
    </div>
  );
}

// --- Component: Frame247 (Know the Process Section) ---
function Frame247() {
  return (
    // Responsive gap and padding
    <div className="content-stretch flex flex-col gap-4 sm:gap-6 md:gap-8 lg:gap-10 items-start relative shrink-0 w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 py-6 sm:py-8 md:py-10 lg:py-12">
      <Frame233 />
      <Frame237 />
    </div>
  );
}

// --- Main Component: ProductPage ---
interface ProductPageProps {
  onBack?: () => void;
  product?: {
    id: number;
    name: string;
    image: string;
    price?: string;
    type: string;
  } | null;
}
export function ProductPage({
  onBack,
  product
}: ProductPageProps) {
  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    language: 'English',
    time: {
      hour: '',
      minute: '',
      period: 'AM'
    }
  });
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Handler to update form data state
  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Basic form validation function
  const validateForm = () => {
    // Name validation
    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return false;
    }
    // Mobile validation
    if (!formData.mobile.trim()) {
      toast.error('Please enter your mobile number');
      return false;
    }
    // Simple regex for 10-digit mobile number
    if (!/^\d{10}$/.test(formData.mobile.trim())) {
      return false;
    }
    // Email validation
    if (!formData.email.trim()) {
      return false;
    }
    // Simple regex for email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      return false;
    }
    // Time validation
    if (!formData.time.hour || !formData.time.minute) {
      return false;
    }
    return true; // Form is valid
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormForm>) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      const submissionData = {
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.mobile,
          preferred_time: `${formData.time.hour}:${formData.time.minute} ${formData.time.period}`,
          language: formData.language
        },
        product: product ? {
          id: product.id,
          name: product.name,
          price: product.price || 'Price not available',
          image_url: product.image
        } : null
      };

      console.log('[Video Shopping] Sending request:', submissionData);

      const { data, error } = await supabase.functions.invoke('whatsapp-webhook', { 
        body: submissionData 
      });

      if (error) {
        console.error('[Video Shopping] Error:', error);
        throw error;
      }

      console.log('[Video Shopping] Success:', data);
      setShowSuccessDialog(true);
      setFormData({ name: '', mobile: '', email: '', language: 'English', time: { hour: '', minute: '', period: 'AM' } });
    } catch (error) {
      console.error('Failed to send request:', error);
    }
  };
  return (
    // Main container with responsive padding
    <div className="bg-[#fcf5f1] box-border content-stretch flex flex-col items-start pb-10 sm:pb-12 md:pb-16 lg:pb-20 pt-0 px-0 relative size-full min-h-screen overflow-x-hidden" data-name="Product Page"> {/* Added min-h-screen */}
      <Header />
      {/* CHANGE: Pass the `onBack` prop received from the parent (App.tsx) down to the Breadcrumbs component */}
      <Breadcrumbs onBack={onBack} />
      <Frame229 />
      <Frame230 />
      {/* CHANGE: Pass form state and the corrected `handleSubmit` handler to the ProductContainer */}
      <ProductContainer formData={formData} onFormChange={handleFormChange} onSubmit={handleSubmit} />
      <Frame247 />

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="bg-[#fcf5f1] border-2 border-[#e29d6f] max-w-md">
          <DialogClose className="absolute left-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-5 w-5 text-[#7c563d]" />
            <span className="sr-only">Close</span>
          </DialogClose>
          <DialogHeader className="pt-8">
            <DialogTitle className="text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-[#7c563d] flex items-center justify-center">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-['Playfair_Display:Medium',_sans-serif] text-2xl font-medium text-[#5f422f]">Request Successfully Sent!</p>
                  <p className="mt-2 font-['Poppins:Regular',_sans-serif] text-base text-[#7c563d]">Our team will contact you via WhatsApp shortly.</p>
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Export the component
export default ProductPage;