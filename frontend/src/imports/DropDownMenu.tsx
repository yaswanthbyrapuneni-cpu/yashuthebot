import imgEllipse11 from "figma:asset/66c38fe3b7f639c209b1c5089f8aef58d3fdfdf4.png";

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

function CategoryFilters() {
  return (
    <div className="bg-[#f6e1d2] relative rounded-[689.883px] shrink-0 w-[337px]" data-name="Category Filters">
      <div className="box-border content-stretch flex items-center justify-between overflow-clip p-[8.287px] relative rounded-[inherit] w-[337px]">
        <FilterItem />
        <FilterItem1 />
        <FilterItem2 />
      </div>
      <div className="absolute inset-0 pointer-events-none shadow-[0px_0px_2.762px_0px_inset_rgba(0,0,0,0.08)]" />
      <div aria-hidden="true" className="absolute border-[0.691px] border-solid border-white inset-0 pointer-events-none rounded-[689.883px]" />
    </div>
  );
}

function Header() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Header">
      <p className="font-['Poppins:Medium',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#2a120a] text-[28px] text-nowrap uppercase whitespace-pre">Shop by Category</p>
      <CategoryFilters />
    </div>
  );
}

function Item() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="item">
      <div className="relative shrink-0 size-[32px]">
        <img alt="" className="block max-w-none size-full" height="32" src={imgEllipse11} width="32" />
      </div>
      <p className="font-['Poppins:Light',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#a06f4f] text-[32px] text-nowrap uppercase whitespace-pre">BANGLES</p>
    </div>
  );
}

function Item1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="item">
      <div className="relative shrink-0 size-[32px]">
        <img alt="" className="block max-w-none size-full" height="32" src={imgEllipse11} width="32" />
      </div>
      <p className="font-['Poppins:Light',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#a06f4f] text-[32px] text-nowrap uppercase whitespace-pre">HARAMS</p>
    </div>
  );
}

function Item2() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="item">
      <div className="relative shrink-0 size-[32px]">
        <img alt="" className="block max-w-none size-full" height="32" src={imgEllipse11} width="32" />
      </div>
      <p className="font-['Poppins:Light',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#a06f4f] text-[32px] text-nowrap uppercase whitespace-pre">VANKEY</p>
    </div>
  );
}

function Item3() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="item">
      <div className="relative shrink-0 size-[32px]">
        <img alt="" className="block max-w-none size-full" height="32" src={imgEllipse11} width="32" />
      </div>
      <p className="font-['Poppins:Light',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#a06f4f] text-[32px] text-nowrap uppercase whitespace-pre">CHAINS</p>
    </div>
  );
}

function Item4() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="item">
      <div className="relative shrink-0 size-[32px]">
        <img alt="" className="block max-w-none size-full" height="32" src={imgEllipse11} width="32" />
      </div>
      <p className="font-['Poppins:Light',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#a06f4f] text-[32px] text-nowrap uppercase whitespace-pre">RINGS</p>
    </div>
  );
}

function Item5() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="item">
      <div className="relative shrink-0 size-[32px]">
        <img alt="" className="block max-w-none size-full" height="32" src={imgEllipse11} width="32" />
      </div>
      <p className="font-['Poppins:Light',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#a06f4f] text-[32px] text-nowrap uppercase whitespace-pre">Harams</p>
    </div>
  );
}

function CategoryColumn() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0" data-name="Category Column">
      <Item />
      <Item1 />
      <Item2 />
      <Item3 />
      <Item4 />
      <Item5 />
    </div>
  );
}

function Item6() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="item">
      <div className="relative shrink-0 size-[32px]">
        <img alt="" className="block max-w-none size-full" height="32" src={imgEllipse11} width="32" />
      </div>
      <p className="font-['Poppins:Light',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#a06f4f] text-[32px] text-nowrap uppercase whitespace-pre">NECKLACE</p>
    </div>
  );
}

function Item7() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="item">
      <div className="relative shrink-0 size-[32px]">
        <img alt="" className="block max-w-none size-full" height="32" src={imgEllipse11} width="32" />
      </div>
      <p className="font-['Poppins:Light',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#a06f4f] text-[32px] text-nowrap uppercase whitespace-pre">EARRINGS</p>
    </div>
  );
}

function Item8() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="item">
      <div className="relative shrink-0 size-[32px]">
        <img alt="" className="block max-w-none size-full" height="32" src={imgEllipse11} width="32" />
      </div>
      <p className="font-['Poppins:Light',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#a06f4f] text-[32px] text-nowrap uppercase whitespace-pre">PENDANTS</p>
    </div>
  );
}

function Item9() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="item">
      <div className="relative shrink-0 size-[32px]">
        <img alt="" className="block max-w-none size-full" height="32" src={imgEllipse11} width="32" />
      </div>
      <p className="font-['Poppins:Light',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#a06f4f] text-[32px] text-nowrap uppercase whitespace-pre">mangalsutra</p>
    </div>
  );
}

function Item10() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="item">
      <div className="relative shrink-0 size-[32px]">
        <img alt="" className="block max-w-none size-full" height="32" src={imgEllipse11} width="32" />
      </div>
      <p className="font-['Poppins:Light',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#a06f4f] text-[32px] text-nowrap uppercase whitespace-pre">ACCESSORIES</p>
    </div>
  );
}

function CategoryColumn1() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start justify-end relative shrink-0" data-name="Category Column">
      <Item6 />
      <Item7 />
      <Item8 />
      <Item9 />
      <Item10 />
    </div>
  );
}

function CategoryList() {
  return (
    <div className="content-stretch flex gap-[64px] items-start relative shrink-0 w-full" data-name="Category List">
      <CategoryColumn />
      <CategoryColumn1 />
    </div>
  );
}

function Container() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[32px] items-start pb-[40px] pt-[24px] px-[40px] relative w-full">
          <Header />
          <CategoryList />
        </div>
      </div>
    </div>
  );
}

export default function DropDownMenu() {
  return (
    <div className="bg-[#fcf5f1] relative rounded-[32px] shadow-[0px_4px_32px_2px_rgba(0,0,0,0.08)] size-full" data-name="drop down menu">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[10px] items-start overflow-clip px-px py-0 relative size-full">
          <Container />
        </div>
      </div>
    </div>
  );
}