import svgPaths from "./svg-cn7axce2jm";

function BackArrow() {
  return (
    <div className="relative shrink-0 size-[48px]" data-name="Back Arrow">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 48">
        <g id="Back Arrow">
          <path d={svgPaths.p11b7a7c0} id="Icon" stroke="var(--stroke-0, #A06F4F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
        </g>
      </svg>
    </div>
  );
}

export default function Breadcrums() {
  return (
    <div className="relative size-full" data-name="Breadcrums">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[10px] items-center px-[96px] py-[48px] relative size-full">
          <BackArrow />
          <div className="flex flex-col font-['Poppins:Medium',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#a06f4f] text-[40px] text-nowrap uppercase">
            <p className="leading-[normal] whitespace-pre">VIDEO SHOPPING</p>
          </div>
        </div>
      </div>
    </div>
  );
}