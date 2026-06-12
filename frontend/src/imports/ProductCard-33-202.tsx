import svgPaths from "./svg-abrjor0i6o";
import imgVector from "figma:asset/f7cc924189778152b702dd16d8167c831b79b64c.png";

/**
 * @figmaAssetKey bd3c987e0e0c52d8361d48706b81d4e12a285e0a
 */
function ProductCard({ className }: { className?: string }) {
  return (
    <div className={className} data-name="Product Card">
      <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[inherit] size-full">
        <div className="aspect-[450/450] relative shrink-0 w-full" data-name="Vector">
          <img alt="" className="block max-w-none size-full" height="450" src={imgVector} width="450" />
        </div>
        <div className="relative shrink-0 w-full" data-name="Product Info">
          <div className="size-full">
            <div className="box-border content-stretch flex flex-col gap-[12px] items-start pb-[24px] pt-[16px] px-[24px] relative w-full">
              <div className="content-stretch flex flex-col gap-[26.133px] items-start relative shrink-0 w-full" data-name="Product Name Container">
                <div className="content-stretch flex flex-col gap-[4.356px] items-start relative shrink-0 w-full" data-name="Product Name Container">
                  <p className="-webkit-box css-qpoi1n font-['Montserrat:Regular',_sans-serif] font-normal leading-[normal] min-w-full overflow-ellipsis overflow-hidden relative shrink-0 text-[#7c563d] text-[24px] w-[min-content]">Gold Ring</p>
                </div>
              </div>
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Product Actions">
                <div className="flex flex-row items-center self-stretch">
                  <div className="box-border content-stretch flex h-full items-center justify-center px-[16px] py-[8px] relative rounded-[8.711px] shrink-0" data-name="Video shopping Button">
                    <div aria-hidden="true" className="absolute border-2 border-[#7c563d] border-solid inset-0 pointer-events-none rounded-[8.711px]" />
                    <div className="box-border content-stretch flex flex-col items-start px-[2px] py-[8px] relative shrink-0 size-[32px]" data-name="Video Icon">
                      <div className="h-[16.696px] relative shrink-0 w-[29.217px]" data-name="Video icon">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 17">
                          <g id="Video icon">
                            <g id="Vector">
                              <path d={svgPaths.p11f20b00} fill="var(--fill-0, #7C563D)" />
                              <path d={svgPaths.p3fa8170} fill="var(--fill-0, #7C563D)" />
                            </g>
                          </g>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-[#7c563d] box-border content-stretch flex gap-[12px] items-center justify-center pl-[20px] pr-[24px] py-[12px] relative rounded-[12px] shrink-0" data-name="Try On Button">
                  <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Try On Icon">
                    <div className="absolute inset-[8.33%_8.33%_12.5%_8.33%]" data-name="Icon">
                      <div className="absolute inset-[-5.26%_-5%]" style={{ "--stroke-0": "rgba(252, 245, 241, 1)" } as React.CSSProperties}>
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 21">
                          <g id="Icon">
                            <path d={svgPaths.p18c8e600} stroke="var(--stroke-0, #FCF5F1)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                            <path d={svgPaths.p3fd92680} stroke="var(--stroke-0, #FCF5F1)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                          </g>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <p className="font-['Montserrat:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[#fcf5f1] text-[20px] text-nowrap whitespace-pre">Try On </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#ecbd9f] border-solid inset-[-1px] pointer-events-none rounded-[27.133px]" />
    </div>
  );
}

export default function ProductCard1() {
  return <ProductCard className="bg-[#fcf8f6] relative rounded-[26.133px] size-full" />;
}