// src/components/CategoryDropdown.tsx
import React from "react"; // Added React import
import imgEllipse11 from "figma:asset/66c38fe3b7f639c209b1c5089f8aef58d3fdfdf4.png";

interface CategoryDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFilter: "Women" | "Men" | "Kids";
  onFilterChange: (filter: "Women" | "Men" | "Kids") => void;
  onSubCategorySelect: (subCategory: string) => void; // Added prop type
}

function FilterItem({
  label,
  isActive,
  onClick
}: {
  label: "Women" | "Men" | "Kids";
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative rounded-[689.883px] shrink-0 w-[114.635px] ${isActive ? 'bg-[#fcf5f1]' : ''}`}
      style={{ background: 'transparent', border: 'none', padding: 0 }}
    >
      <div className="box-border content-stretch flex gap-[5.525px] items-center justify-center overflow-clip p-[11.049px] relative size-full">
        <div className="relative shrink-0 size-[22.098px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 23">
            <circle cx="11.0061" cy="11.0061" fill={isActive ? "#A06F4F" : "#C88787"} r="11.0061" />
          </svg>
        </div>
        <div className={`flex flex-col font-['Poppins:Medium',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16.574px] text-nowrap uppercase ${isActive ? 'text-[#a06f4f]' : 'text-[#5f422f]'}`}>
          <p className="leading-[normal] whitespace-pre">{label}</p>
        </div>
      </div>
      {isActive && (
        <>
          <div aria-hidden="true" className="absolute border-[#e7e7e7] border-[0.691px] border-solid inset-0 pointer-events-none rounded-[689.883px] shadow-[0px_0px_11.049px_0.691px_rgba(0,0,0,0.04)]" />
        </>
      )}
    </button>
  );
}

function CategoryFilters({
  selectedFilter,
  onFilterChange
}: {
  selectedFilter: "Women" | "Men" | "Kids";
  onFilterChange: (filter: "Women" | "Men" | "Kids") => void;
}) {
  return (
    <div className="bg-[#f6e1d2] relative rounded-[689.883px] shrink-0 w-[337px]">
      <div className="box-border content-stretch flex items-center justify-between overflow-clip p-[8.287px] relative size-full">
        <FilterItem label="Women" isActive={selectedFilter === "Women"} onClick={() => onFilterChange("Women")} />
        <FilterItem label="Men" isActive={selectedFilter === "Men"} onClick={() => onFilterChange("Men")} />
        <FilterItem label="Kids" isActive={selectedFilter === "Kids"} onClick={() => onFilterChange("Kids")} />
      </div>
      <div className="absolute inset-0 pointer-events-none shadow-[0px_0px_2.762px_0px_inset_rgba(0,0,0,0.08)]" />
      <div aria-hidden="true" className="absolute border-[0.691px] border-solid border-white inset-0 pointer-events-none rounded-[689.883px]" />
    </div>
  );
}

// Modified Item component to accept and use onClick
function Item({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick} // Added onClick handler
      className="content-stretch flex gap-[8px] items-center relative shrink-0 hover:opacity-70 transition-opacity"
      style={{ background: 'transparent', border: 'none', padding: 0 }}
    >
      <div className="relative shrink-0 size-[32px]">
        <img alt="" className="block max-w-none size-full" height="32" src={imgEllipse11} width="32" />
      </div>
      <p className="font-['Poppins:Light',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#a06f4f] text-[32px] text-nowrap uppercase whitespace-pre">{label}</p>
    </button>
  );
}

// Modified CategoryColumn to accept and pass onSubCategorySelect
function CategoryColumn({ onSubCategorySelect }: { onSubCategorySelect: (label: string) => void }) {
  const categories = ["BANGLES", "HARAMS", "CHAINS", "RINGS"];
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0">
      {categories.map(label => (
        <Item key={label} label={label} onClick={() => onSubCategorySelect(label)} />
      ))}
    </div>
  );
}

// Modified CategoryColumn1 to accept and pass onSubCategorySelect
function CategoryColumn1({ onSubCategorySelect }: { onSubCategorySelect: (label: string) => void }) {
   const categories = ["NECKLACE", "EARRINGS", "ACCESSORIES"];
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start justify-end relative shrink-0">
       {categories.map(label => (
        <Item key={label} label={label} onClick={() => onSubCategorySelect(label)} />
      ))}
    </div>
  );
}

// Updated main component to accept and pass onSubCategorySelect
export function CategoryDropdown({ isOpen, onClose, selectedFilter, onFilterChange, onSubCategorySelect }: CategoryDropdownProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        aria-hidden="true" // Added aria-hidden for accessibility
      />

      {/* Dropdown */}
      {/* Added role and aria-modal for accessibility */}
      <div className="absolute top-full left-0 right-0 mt-4 z-50 px-[96px]" role="dialog" aria-modal="true">
        <div className="bg-[#fcf5f1] relative rounded-[32px] shadow-[0px_4px_32px_2px_rgba(0,0,0,0.08)] w-full">
          <div className="size-full">
            <div className="box-border content-stretch flex flex-col gap-[10px] items-start overflow-clip px-px py-0 relative size-full">
              <div className="relative shrink-0 w-full">
                <div className="size-full">
                  <div className="box-border content-stretch flex flex-col gap-[32px] items-start pb-[40px] pt-[24px] px-[40px] relative w-full">
                    {/* Header */}
                    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
                      <p className="font-['Poppins:Medium',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#2a120a] text-[28px] text-nowrap uppercase whitespace-pre">Shop by Category</p>
                      {/* Note: Filters might need adjustment based on data model */}
                      <CategoryFilters selectedFilter={selectedFilter} onFilterChange={onFilterChange} />
                    </div>

                    {/* Category List - Pass the handler down */}
                    <div className="content-stretch flex gap-[64px] items-start relative shrink-0 w-full">
                      <CategoryColumn onSubCategorySelect={onSubCategorySelect} />
                      <CategoryColumn1 onSubCategorySelect={onSubCategorySelect} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}