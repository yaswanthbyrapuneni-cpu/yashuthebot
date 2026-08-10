import svgPaths from "./svg-yk7h33o67x";

function Logo() {
  return (
    <div className="content-stretch flex items-end justify-center relative shrink-0" data-name="logo">
      <p className="[word-break:break-word] font-['Clash_Display:Regular',sans-serif] leading-[0] not-italic relative shrink-0 text-[0px] text-black whitespace-pre">
        <span className="leading-[1.3] text-[48px]">
          {`Vastra `}
          <br aria-hidden />
        </span>
        <span className="font-['Clash_Display:Semibold',sans-serif] leading-[1.3] text-[48px]">Alankara</span>
      </p>
    </div>
  );
}

function Logo1() {
  return <div className="h-[62px] relative shrink-0 w-[153px]" data-name="logo" />;
}

function Header() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Header">
      <div aria-hidden className="absolute border-[#fef7ff] border-b-4 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-between px-[64px] py-[32px] relative size-full">
          <Logo />
          <Logo1 />
        </div>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="h-[207px] relative shrink-0 w-full">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="relative size-full" />
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="32" preserveAspectRatio="none" viewBox="0 0 32 32" width="32">
        <g id="Icon">
          <path d={svgPaths.p13bade00} id="Vector" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
          <path d={svgPaths.pde53700} id="Vector_2" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container2() {
  return (
    <div className="bg-[#171717] content-stretch drop-shadow-[0px_20px_12.5px_rgba(23,23,23,0.1),0px_8px_5px_rgba(23,23,23,0.1)] flex items-center justify-center relative rounded-[16px] shrink-0 size-[64px]" data-name="Container">
      <Icon />
    </div>
  );
}

function ContainerMargin() {
  return (
    <div className="relative shrink-0" data-name="Container:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[24px] relative size-full">
        <Container2 />
      </div>
    </div>
  );
}

function ParagraphMargin() {
  return (
    <div className="relative shrink-0" data-name="Paragraph:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] relative size-full">
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#737373] text-[14px] text-center whitespace-nowrap">Sign in to access the management dashboard</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <ContainerMargin />
        <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[32px] not-italic relative shrink-0 text-[#171717] text-[24px] text-center tracking-[-0.6px] whitespace-nowrap">Admin Portal</p>
        <ParagraphMargin />
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="[word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[4px] not-italic text-[#404040] text-[14px] top-[2.2px] whitespace-nowrap">Email Address</p>
      </div>
    </div>
  );
}

function EmailInput() {
  return (
    <div className="bg-[#fafafa] h-[49.6px] relative rounded-[14px] shrink-0 w-[382.4px]" data-name="Email Input">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center overflow-clip pl-[44.8px] pr-[16.8px] py-[12.8px] relative rounded-[inherit] size-full">
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#a1a1a1] text-[16px] w-full">admin@example.com</p>
      </div>
      <div aria-hidden className="absolute border-[#e5e5e5] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
        <g id="Icon">
          <path d={svgPaths.pd919a80} id="Vector" stroke="#A1A1A1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p189c1170} id="Vector_2" stroke="#A1A1A1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute h-[49.6px] left-0 top-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center pl-[14px] relative size-full">
        <Icon1 />
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <EmailInput />
        <Container7 />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container5 />
        <Container6 />
      </div>
    </div>
  );
}

function Label() {
  return (
    <div className="relative shrink-0" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#404040] text-[14px] whitespace-nowrap">Password</p>
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="relative shrink-0" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#737373] text-[12px] whitespace-nowrap">Forgot password?</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="h-[20px] relative shrink-0 w-[382.4px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pl-[4px] relative size-full">
        <Label />
        <Link />
      </div>
    </div>
  );
}

function PasswordInput() {
  return (
    <div className="bg-[#fafafa] h-[49.6px] relative rounded-[14px] shrink-0 w-[382.4px]" data-name="Password Input">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center overflow-clip pl-[44.8px] pr-[16.8px] py-[12.8px] relative rounded-[inherit] size-full">
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#a1a1a1] text-[16px] w-full">••••••••</p>
      </div>
      <div aria-hidden className="absolute border-[#e5e5e5] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
        <g id="Icon">
          <path d={svgPaths.p2566d000} id="Vector" stroke="#A1A1A1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1bf79e00} id="Vector_2" stroke="#A1A1A1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute h-[49.6px] left-0 top-[6px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center pl-[14px] relative size-full">
        <Icon2 />
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[6px] relative size-full">
        <PasswordInput />
        <Container11 />
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="relative shrink-0 w-[382.4px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[20px] relative size-full">
        <Container9 />
        <Container10 />
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="Icon">
          <path d="M3.33333 8H12.6667" id="Vector" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1d405500} id="Vector_2" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function IconMargin() {
  return (
    <div className="relative shrink-0" data-name="Icon:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start pl-[8px] relative size-full">
        <Icon3 />
      </div>
    </div>
  );
}

function Button() {
  return (
    <a className="bg-[#171717] content-stretch cursor-pointer flex h-[52px] items-center justify-center px-[16px] py-[14px] relative rounded-[14px] shrink-0 w-[382.4px]" data-name="Button">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic relative shrink-0 text-[16px] text-center text-white whitespace-nowrap">Sign in to Dashboard</p>
      <IconMargin />
    </a>
  );
}

function ButtonMargin() {
  return (
    <div className="relative shrink-0" data-name="Button:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[20px] relative size-full">
        <Button />
      </div>
    </div>
  );
}

function Form() {
  return (
    <div className="relative shrink-0 w-full" data-name="Form">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container4 />
        <Container8 />
        <ButtonMargin />
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="bg-white drop-shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)] relative rounded-[24px] shrink-0 w-full" data-name="Container">
      <div aria-hidden className="absolute border-[0.8px] border-[rgba(229,229,229,0.6)] border-solid inset-0 pointer-events-none rounded-[24px]" />
      <div className="content-stretch flex flex-col items-start p-[32.8px] relative size-full">
        <Form />
      </div>
    </div>
  );
}

function ContainerMargin1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[32px] relative size-full">
        <Container3 />
      </div>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute bg-[rgba(229,229,229,0.5)] h-[36px] left-[23.9px] rounded-[26843500px] top-0 w-[400.188px]" data-name="Paragraph">
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal leading-[0] left-[200px] not-italic text-[#737373] text-[0px] text-center top-[7.8px] whitespace-nowrap">
        <span className="leading-[20px] text-[14px]">{`Are you a customer? No login required. `}</span>
        <span className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] text-[#171717] text-[14px]">Continue shopping</span>
      </p>
    </div>
  );
}

function Container12() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Container">
      <Paragraph />
    </div>
  );
}

function ContainerMargin2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[32px] relative size-full">
        <Container12 />
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute content-stretch flex flex-col h-[1026px] items-start left-[416px] max-w-[448px] top-0 w-[448px]" data-name="Container">
      <Container1 />
      <ContainerMargin1 />
      <ContainerMargin2 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="h-[963px] relative shrink-0 w-full">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col items-center justify-center px-[64px] py-[32px] relative size-full">
          <Container />
        </div>
      </div>
    </div>
  );
}

function Frame() {
  return <div className="h-[191px] relative shrink-0 w-full" />;
}

export default function Authentication() {
  return (
    <div className="bg-[#f6f6f6] content-stretch flex flex-col items-start relative size-full" data-name="Authentication">
      <Header />
      <Frame1 />
      <Frame2 />
      <Frame />
    </div>
  );
}