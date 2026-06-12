import imgVector from "figma:asset/9558e0c846f30c8aa5939cc9c165ba28bc0f9e1e.png";
import imgVector1 from "figma:asset/3f11ce12997d9c6313379b839bd614ec3b6475b6.png";
import imgVector2 from "figma:asset/19f75d718df8ede7167628d5393f1d27667f8713.png";
import imgVector3 from "figma:asset/ad763c2921c25a0c844c255968e7b2a8dcf029cb.png";
import imgVector4 from "figma:asset/fc9e0fb363ea50f06254f1ce635653bee6dab4c1.png";

function FindYourPerfectMatchContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center justify-center leading-[normal] relative shrink-0 whitespace-pre" data-name="Find Your Perfect Match Container">
      <p className="font-['Playfair_Display:Regular',_sans-serif] font-normal relative shrink-0 text-[#2a120a] text-3xl sm:text-4xl md:text-5xl lg:text-[60px] text-center">Find Your Perfect Match</p>
      <p className="font-['Inter:Light',_sans-serif] font-light not-italic relative shrink-0 text-[#7c563d] text-xl sm:text-2xl md:text-3xl lg:text-[40px] text-center">Shop by Categories</p>
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex gap-[12px] items-center justify-center relative shrink-0 w-full" data-name="Heading">
      <FindYourPerfectMatchContainer />
    </div>
  );
}

function EarringsNameContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Earrings Name Container">
      <p className="[white-space-collapse:collapse] font-['Playfair:Regular',_sans-serif] font-normal leading-[normal] overflow-ellipsis overflow-hidden relative shrink-0 text-[#7c563d] text-xl sm:text-2xl md:text-3xl lg:text-[40px] text-center text-nowrap w-full" style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}>
        EARRINGS
      </p>
    </div>
  );
}

function EarringsCard() {
  return (
    <div className="relative shrink-0 w-full" data-name="Earrings Card">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[12px] items-start px-[24px] py-[12px] relative w-full">
          <EarringsNameContainer />
        </div>
      </div>
    </div>
  );
}

function Card1() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-center justify-end min-h-px min-w-px overflow-clip relative rounded-[26.133px] shrink-0" data-name="CARD 1">
      <div className="h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] relative shrink-0 w-full" data-name="Vector">
        <img alt="" className="block max-w-none size-full object-cover" src={imgVector} />
      </div>
      <EarringsCard />
    </div>
  );
}

function RingsNameContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Rings Name Container">
      <p className="[white-space-collapse:collapse] font-['Playfair:Regular',_sans-serif] font-normal leading-[normal] overflow-ellipsis overflow-hidden relative shrink-0 text-[#7c563d] text-[40px] text-center text-nowrap w-full" style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}>
        RINGS
      </p>
    </div>
  );
}

function RingsCard() {
  return (
    <div className="relative shrink-0 w-full" data-name="Rings Card">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[12px] items-start px-[24px] py-[12px] relative w-full">
          <RingsNameContainer />
        </div>
      </div>
    </div>
  );
}

function Card2() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-center justify-end min-h-px min-w-px overflow-clip relative rounded-[26.133px] shrink-0" data-name="CARD 2">
      <div className="h-[450px] relative shrink-0 w-full" data-name="Vector">
        <img alt="" className="block max-w-none size-full" height="450" src={imgVector1} width="453.333" />
      </div>
      <RingsCard />
    </div>
  );
}

function MangalsutraNameContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Mangalsutra Name Container">
      <p className="[white-space-collapse:collapse] font-['Playfair:Regular',_sans-serif] font-normal leading-[normal] overflow-ellipsis overflow-hidden relative shrink-0 text-[#7c563d] text-[40px] text-center text-nowrap w-full" style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}>
        MANGALSUTRA
      </p>
    </div>
  );
}

function MangalsutraCard() {
  return (
    <div className="relative shrink-0 w-full" data-name="Mangalsutra Card">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[12px] items-start px-[24px] py-[12px] relative w-full">
          <MangalsutraNameContainer />
        </div>
      </div>
    </div>
  );
}

function Card3() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-center justify-end min-h-px min-w-px overflow-clip relative rounded-[26.133px] shrink-0" data-name="CARD 3">
      <div className="h-[450px] relative shrink-0 w-full" data-name="Vector">
        <img alt="" className="block max-w-none size-full" height="450" src={imgVector2} width="453.333" />
      </div>
      <MangalsutraCard />
    </div>
  );
}

function Cards() {
  return (
    <div className="content-stretch flex gap-[24px] items-end justify-center relative shrink-0 w-full" data-name="cards">
      <Card1 />
      <Card2 />
      <Card3 />
    </div>
  );
}

function PendantsNameContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Pendants Name Container">
      <p className="[white-space-collapse:collapse] font-['Playfair:Regular',_sans-serif] font-normal leading-[normal] overflow-ellipsis overflow-hidden relative shrink-0 text-[#7c563d] text-[40px] text-center text-nowrap w-full" style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}>
        PANDANTS
      </p>
    </div>
  );
}

function PendantsCard() {
  return (
    <div className="relative shrink-0 w-full" data-name="Pendants Card">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[12px] items-start px-[24px] py-[12px] relative w-full">
          <PendantsNameContainer />
        </div>
      </div>
    </div>
  );
}

function Card4() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-center justify-center min-h-px min-w-px overflow-clip relative rounded-[26.133px] shrink-0" data-name="CARD 1">
      <div className="h-[450px] relative shrink-0 w-full" data-name="Vector">
        <img alt="" className="block max-w-none size-full" height="450" src={imgVector3} width="692" />
      </div>
      <PendantsCard />
    </div>
  );
}

function ChainsNameContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Chains Name Container">
      <p className="[white-space-collapse:collapse] font-['Playfair:Regular',_sans-serif] font-normal leading-[normal] overflow-ellipsis overflow-hidden relative shrink-0 text-[#7c563d] text-[40px] text-center text-nowrap w-full" style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}>
        CHAINS
      </p>
    </div>
  );
}

function ChainsCard() {
  return (
    <div className="relative shrink-0 w-full" data-name="Chains Card">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[12px] items-start px-[24px] py-[12px] relative w-full">
          <ChainsNameContainer />
        </div>
      </div>
    </div>
  );
}

function Card5() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-center justify-center min-h-px min-w-px overflow-clip relative rounded-[26.133px] shrink-0" data-name="CARD 2">
      <div className="h-[450px] relative shrink-0 w-full" data-name="Vector">
        <img alt="" className="block max-w-none size-full" height="450" src={imgVector4} width="692" />
      </div>
      <ChainsCard />
    </div>
  );
}

function Cards1() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full" data-name="cards">
      <Card4 />
      <Card5 />
    </div>
  );
}

export default function MainContainer() {
  return (
    <div className="relative size-full" data-name="Main container">
      <div className="flex flex-col items-end size-full">
        <div className="box-border content-stretch flex flex-col gap-[32px] items-end px-4 sm:px-8 md:px-16 lg:px-[96px] py-0 relative size-full">
          <Heading />
          <Cards />
          <Cards1 />
        </div>
      </div>
    </div>
  );
}