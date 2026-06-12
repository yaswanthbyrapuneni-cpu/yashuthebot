function FilterItem() {
  return (
    <div className="bg-[#fcf5f1] relative rounded-[689.883px] shrink-0 w-[114.635px]" data-name="Filter Item">
      <div className="box-border content-stretch flex gap-[5.525px] items-center justify-center overflow-clip p-[11.049px] relative rounded-[inherit] w-[114.635px]">
        <div className="aspect-[100/100] basis-0 grow min-h-px min-w-px relative shrink-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 23">
            <circle cx="11.0061" cy="11.0061" fill="var(--fill-0, #A06F4F)" id="Ellipse 9" r="11.0061" />
          </svg>
        </div>
        <div className="flex flex-col font-['Poppins:Medium',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#a06f4f] text-[16.574px] text-nowrap uppercase">
          <p className="leading-[normal] whitespace-pre">Women</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#e7e7e7] border-[0.691px] border-solid inset-0 pointer-events-none rounded-[689.883px] shadow-[0px_0px_11.049px_0.691px_rgba(0,0,0,0.04)]" />
    </div>
  );
}

function FilterItem1() {
  return (
    <div className="box-border content-stretch flex gap-[5.525px] items-center justify-center px-[11.049px] py-[8.287px] relative rounded-[689.883px] shrink-0" data-name="Filter Item">
      <div className="relative shrink-0 size-[22.098px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 23">
          <circle cx="11.0492" cy="11.0492" fill="var(--fill-0, #C88787)" id="Ellipse 9" r="11.0492" />
        </svg>
      </div>
      <div className="flex flex-col font-['Poppins:Medium',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#5f422f] text-[16.574px] text-nowrap uppercase">
        <p className="leading-[normal] whitespace-pre">Men</p>
      </div>
    </div>
  );
}

function FilterItem2() {
  return (
    <div className="box-border content-stretch flex gap-[5.525px] items-center justify-center px-[11.049px] py-[8.287px] relative rounded-[689.883px] shrink-0" data-name="Filter Item">
      <div className="relative shrink-0 size-[22.098px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 23">
          <circle cx="11.0492" cy="11.0492" fill="var(--fill-0, #C88787)" id="Ellipse 9" r="11.0492" />
        </svg>
      </div>
      <div className="flex flex-col font-['Poppins:Medium',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#5f422f] text-[16.574px] text-nowrap uppercase">
        <p className="leading-[normal] whitespace-pre">KIDS</p>
      </div>
    </div>
  );
}

export default function CategoryFilters() {
  return (
    <div className="bg-[#f6e1d2] relative rounded-[689.883px] size-full" data-name="Category Filters">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex items-center justify-between overflow-clip p-[8.287px] relative size-full">
          <FilterItem />
          <FilterItem1 />
          <FilterItem2 />
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none shadow-[0px_0px_2.762px_0px_inset_rgba(0,0,0,0.08)]" />
      <div aria-hidden="true" className="absolute border-[0.691px] border-solid border-white inset-0 pointer-events-none rounded-[689.883px]" />
    </div>
  );
}