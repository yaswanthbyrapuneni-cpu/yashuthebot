import svgPaths from "./svg-31xqbxzqb1";
import imgVector from "figma:asset/f7cc924189778152b702dd16d8167c831b79b64c.png";
import imgVector1 from "figma:asset/db58ea0127e8ad2399d9f28222f6bcb0446ce891.png";
import imgVector2 from "figma:asset/5a8c2dd706b9ab9206444d9bab55c1dce0e00b2a.png";

function ProductNameContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[4.356px] items-start relative shrink-0 w-full" data-name="Product Name Container">
      <p className="-webkit-box css-qpoi1n font-['Montserrat:Regular',_sans-serif] font-normal leading-[normal] min-w-full overflow-ellipsis overflow-hidden relative shrink-0 text-[#7c563d] text-[24px] w-[min-content]">Gold Ring</p>
    </div>
  );
}

function ProductNameContainer1() {
  return (
    <div className="content-stretch flex flex-col gap-[26.133px] items-start relative shrink-0 w-full" data-name="Product Name Container">
      <ProductNameContainer />
    </div>
  );
}

function VideoIcon() {
  return (
    <div className="h-[16.696px] relative shrink-0 w-[29.217px]" data-name="Video icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 17">
        <g id="Video icon">
          <g id="Vector">
            <path d={svgPaths.p9511200} fill="var(--fill-0, #7C563D)" />
            <path d={svgPaths.p2f5f3800} fill="var(--fill-0, #7C563D)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function VideoIcon1() {
  return (
    <div className="box-border content-stretch flex flex-col items-start px-[2px] py-[8px] relative shrink-0 size-[32px]" data-name="Video Icon">
      <VideoIcon />
    </div>
  );
}

function VideoShoppingButton() {
  return (
    <div className="box-border content-stretch flex h-full items-center justify-center px-[16px] py-[8px] relative rounded-[8.711px] shrink-0" data-name="Video shopping Button">
      <div aria-hidden="true" className="absolute border-2 border-[#7c563d] border-solid inset-0 pointer-events-none rounded-[8.711px]" />
      <VideoIcon1 />
    </div>
  );
}

function TryOnIcon() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Try On Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Try On Icon">
          <g id="Icon">
            <path d={svgPaths.p30315f00} stroke="var(--stroke-0, #FCF5F1)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d={svgPaths.p1b34bb80} stroke="var(--stroke-0, #FCF5F1)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function TryOnButton() {
  return (
    <div className="bg-[#7c563d] box-border content-stretch flex gap-[12px] items-center justify-center pl-[20px] pr-[24px] py-[12px] relative rounded-[12px] shrink-0" data-name="Try On Button">
      <TryOnIcon />
      <p className="font-['Montserrat:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[#fcf5f1] text-[20px] text-nowrap whitespace-pre">{`Try On `}</p>
    </div>
  );
}

function ProductActions() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Product Actions">
      <div className="flex flex-row items-center self-stretch">
        <VideoShoppingButton />
      </div>
      <TryOnButton />
    </div>
  );
}

function ProductInfo() {
  return (
    <div className="relative shrink-0 w-full" data-name="Product Info">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[12px] items-start pb-[24px] pt-[16px] px-[24px] relative w-full">
          <ProductNameContainer1 />
          <ProductActions />
        </div>
      </div>
    </div>
  );
}

function ProductCard() {
  return (
    <div className="bg-[#fcf8f6] relative rounded-[26.133px] shrink-0 w-[450px]" data-name="Product Card">
      <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[inherit] w-[450px]">
        <div className="aspect-[450/450] relative shrink-0 w-full" data-name="Vector">
          <img alt="" className="block max-w-none size-full" height="450" src={imgVector} width="450" />
        </div>
        <ProductInfo />
      </div>
      <div aria-hidden="true" className="absolute border border-[#ecbd9f] border-solid inset-[-1px] pointer-events-none rounded-[27.133px]" />
    </div>
  );
}

function ProductNameContainer2() {
  return (
    <div className="content-stretch flex flex-col gap-[4.356px] items-start relative shrink-0 w-full" data-name="Product Name Container">
      <p className="-webkit-box css-qpoi1n font-['Montserrat:Regular',_sans-serif] font-normal leading-[normal] min-w-full overflow-ellipsis overflow-hidden relative shrink-0 text-[#7c563d] text-[24px] w-[min-content]">Gold Ring</p>
    </div>
  );
}

function ProductNameContainer3() {
  return (
    <div className="content-stretch flex flex-col gap-[26.133px] items-start relative shrink-0 w-full" data-name="Product Name Container">
      <ProductNameContainer2 />
    </div>
  );
}

function VideoIcon2() {
  return (
    <div className="h-[16.696px] relative shrink-0 w-[29.217px]" data-name="Video icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 17">
        <g id="Video icon">
          <g id="Vector">
            <path d={svgPaths.p9511200} fill="var(--fill-0, #7C563D)" />
            <path d={svgPaths.p2f5f3800} fill="var(--fill-0, #7C563D)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function VideoIcon3() {
  return (
    <div className="box-border content-stretch flex flex-col items-start px-[2px] py-[8px] relative shrink-0 size-[32px]" data-name="Video Icon">
      <VideoIcon2 />
    </div>
  );
}

function VideoShoppingButton1() {
  return (
    <div className="box-border content-stretch flex h-full items-center justify-center px-[16px] py-[8px] relative rounded-[8.711px] shrink-0" data-name="Video shopping Button">
      <div aria-hidden="true" className="absolute border-2 border-[#7c563d] border-solid inset-0 pointer-events-none rounded-[8.711px]" />
      <VideoIcon3 />
    </div>
  );
}

function TryOnIcon1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Try On Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Try On Icon">
          <g id="Icon">
            <path d={svgPaths.p30315f00} stroke="var(--stroke-0, #FCF5F1)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d={svgPaths.p1b34bb80} stroke="var(--stroke-0, #FCF5F1)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function TryOnButton1() {
  return (
    <div className="bg-[#7c563d] box-border content-stretch flex gap-[12px] items-center justify-center pl-[20px] pr-[24px] py-[12px] relative rounded-[12px] shrink-0" data-name="Try On Button">
      <TryOnIcon1 />
      <p className="font-['Montserrat:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[#fcf5f1] text-[20px] text-nowrap whitespace-pre">{`Try On `}</p>
    </div>
  );
}

function ProductActions1() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Product Actions">
      <div className="flex flex-row items-center self-stretch">
        <VideoShoppingButton1 />
      </div>
      <TryOnButton1 />
    </div>
  );
}

function ProductInfo1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Product Info">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[12px] items-start pb-[24px] pt-[16px] px-[24px] relative w-full">
          <ProductNameContainer3 />
          <ProductActions1 />
        </div>
      </div>
    </div>
  );
}

function ProductCard1() {
  return (
    <div className="bg-[#fcf8f6] relative rounded-[26.133px] shrink-0 w-[450px]" data-name="Product Card">
      <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[inherit] w-[450px]">
        <div className="aspect-[450/450] relative shrink-0 w-full" data-name="Vector">
          <img alt="" className="block max-w-none size-full" height="450" src={imgVector1} width="450" />
        </div>
        <ProductInfo1 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#ecbd9f] border-solid inset-[-1px] pointer-events-none rounded-[27.133px]" />
    </div>
  );
}

function ProductNameContainer4() {
  return (
    <div className="content-stretch flex flex-col gap-[4.356px] items-start relative shrink-0 w-full" data-name="Product Name Container">
      <p className="-webkit-box css-qpoi1n font-['Montserrat:Regular',_sans-serif] font-normal leading-[normal] min-w-full overflow-ellipsis overflow-hidden relative shrink-0 text-[#7c563d] text-[24px] w-[min-content]">Gold Ring</p>
    </div>
  );
}

function ProductNameContainer5() {
  return (
    <div className="content-stretch flex flex-col gap-[26.133px] items-start relative shrink-0 w-full" data-name="Product Name Container">
      <ProductNameContainer4 />
    </div>
  );
}

function VideoIcon4() {
  return (
    <div className="h-[16.696px] relative shrink-0 w-[29.217px]" data-name="Video icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 17">
        <g id="Video icon">
          <g id="Vector">
            <path d={svgPaths.p9511200} fill="var(--fill-0, #7C563D)" />
            <path d={svgPaths.p2f5f3800} fill="var(--fill-0, #7C563D)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function VideoIcon5() {
  return (
    <div className="box-border content-stretch flex flex-col items-start px-[2px] py-[8px] relative shrink-0 size-[32px]" data-name="Video Icon">
      <VideoIcon4 />
    </div>
  );
}

function VideoShoppingButton2() {
  return (
    <div className="box-border content-stretch flex h-full items-center justify-center px-[16px] py-[8px] relative rounded-[8.711px] shrink-0" data-name="Video shopping Button">
      <div aria-hidden="true" className="absolute border-2 border-[#7c563d] border-solid inset-0 pointer-events-none rounded-[8.711px]" />
      <VideoIcon5 />
    </div>
  );
}

function TryOnIcon2() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Try On Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Try On Icon">
          <g id="Icon">
            <path d={svgPaths.p30315f00} stroke="var(--stroke-0, #FCF5F1)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d={svgPaths.p1b34bb80} stroke="var(--stroke-0, #FCF5F1)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function TryOnButton2() {
  return (
    <div className="bg-[#7c563d] box-border content-stretch flex gap-[12px] items-center justify-center pl-[20px] pr-[24px] py-[12px] relative rounded-[12px] shrink-0" data-name="Try On Button">
      <TryOnIcon2 />
      <p className="font-['Montserrat:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[#fcf5f1] text-[20px] text-nowrap whitespace-pre">{`Try On `}</p>
    </div>
  );
}

function ProductActions2() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Product Actions">
      <div className="flex flex-row items-center self-stretch">
        <VideoShoppingButton2 />
      </div>
      <TryOnButton2 />
    </div>
  );
}

function ProductInfo2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Product Info">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[12px] items-start pb-[24px] pt-[16px] px-[24px] relative w-full">
          <ProductNameContainer5 />
          <ProductActions2 />
        </div>
      </div>
    </div>
  );
}

function ProductCard2() {
  return (
    <div className="bg-[#fcf8f6] relative rounded-[26.133px] shrink-0 w-[450px]" data-name="Product Card">
      <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[inherit] w-[450px]">
        <div className="aspect-[450/450] relative shrink-0 w-full" data-name="Vector">
          <img alt="" className="block max-w-none size-full" height="450" src={imgVector2} width="450" />
        </div>
        <ProductInfo2 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#ecbd9f] border-solid inset-[-1px] pointer-events-none rounded-[27.133px]" />
    </div>
  );
}

export default function GoldProducts() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative size-full" data-name="Gold Products">
      <ProductCard />
      <ProductCard1 />
      <ProductCard2 />
    </div>
  );
}