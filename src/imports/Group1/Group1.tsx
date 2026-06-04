import svgPaths from "./svg-tdybi2qk4c";

function Container2() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[64px] items-start left-[33px] not-italic text-[#222] top-[35px] whitespace-nowrap" data-name="Container">
      <p className="font-['Inter:Bold',sans-serif] leading-[16px] relative shrink-0 text-[14px] tracking-[0.6px]">⚠️ Heute: Kritische Hitzebelastung</p>
      <p className="font-['Inter:Light',sans-serif] leading-[40px] relative shrink-0 text-[36px] tracking-[0.3691px]">13:00 – 16:00</p>
    </div>
  );
}

function Container3() {
  return <div className="absolute h-[16px] left-[32px] top-[128px] w-[419px]" data-name="Container" />;
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[340px]" data-name="Icon">
      <div className="absolute inset-[-2.94%_-3.09%_-3.24%_-3.09%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 361 361">
          <g id="Icon">
            <path d={svgPaths.p11cd2300} id="Vector" stroke="var(--stroke-0, #E2E8F0)" strokeWidth="64" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute content-stretch flex h-[382px] items-start justify-center left-[32px] px-[39.5px] top-[180px] w-[419px]" data-name="Container">
      <Icon />
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] leading-[16px] left-[201px] not-italic text-[#646464] text-[12px] text-center top-[360px] whitespace-nowrap">Griff ziehen um andere Zeiten zu prüfen</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="bg-[#ff6a48] content-stretch flex items-center justify-center p-[10px] relative rounded-[20px] shrink-0 size-[40px]">
      <p className="font-['Inter:Bold',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#222] text-[22px] tracking-[0.6px] whitespace-nowrap">⚠</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px not-italic relative">
      <p className="font-['Inter:Medium',sans-serif] leading-[24px] relative shrink-0 text-[16px] text-white tracking-[-0.3125px] whitespace-pre">{`Keine Warnung für  6:35 pm`}</p>
      <p className="font-['Inter:Regular',sans-serif] leading-[20px] min-w-full relative shrink-0 text-[#e0e0e0] text-[14px] tracking-[-0.1504px] w-[min-content]">Extreme Hitzebelastung erwartet heute. Schwere Arbeiten müssen vor 14:00 erledigt werden.</p>
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute bg-[#222] content-stretch flex gap-[18px] items-start left-[32px] p-[18px] rounded-[16px] top-[589px] w-[419px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#ffedd4] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Frame2 />
      <Frame />
    </div>
  );
}

function Container6() {
  return <div className="absolute h-[52px] left-[32px] top-[716px] w-[129px]" data-name="Container" />;
}

function Container7() {
  return <div className="absolute h-[52px] left-[147px] top-[716px] w-[94px]" data-name="Container" />;
}

function Container8() {
  return <div className="absolute h-[52px] left-[242px] top-[716px] w-[129px]" data-name="Container" />;
}

function Container9() {
  return <div className="absolute h-[52px] left-[347px] top-[716px] w-[129px]" data-name="Container" />;
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M8 13.3333H14" id="Vector" stroke="var(--stroke-0, #222222)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2a19bb80} id="Vector_2" stroke="var(--stroke-0, #222222)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[20px] relative shrink-0 w-[277.734px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] leading-[20px] left-[139.5px] not-italic text-[#222] text-[14px] text-center top-0 tracking-[-0.1504px] whitespace-nowrap">München · Schwere Arbeit · Direkte Sonne</p>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-[#f9fafb] content-stretch flex gap-[8px] h-[52px] items-center justify-center left-[29px] pl-[58.625px] pr-[58.641px] py-[16px] rounded-[16px] top-[113px] w-[419px]" data-name="Button">
      <Icon1 />
      <Text />
    </div>
  );
}

function Container1() {
  return (
    <div className="bg-white h-[725px] relative rounded-[24px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="Container">
      <Container2 />
      <Container3 />
      <Container4 />
      <Container5 />
      <Container6 />
      <Container7 />
      <Container8 />
      <Container9 />
      <Button />
    </div>
  );
}

function Container() {
  return (
    <div className="h-[773px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col items-start pb-[18px] pt-[48px] px-[18px] relative size-full">
        <Container1 />
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[18px] py-[14px] relative size-full">
          <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] leading-[24px] min-w-px not-italic relative text-[16px] text-white tracking-[-0.3125px]">Aktuelle Zustand</p>
        </div>
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p3a14cd80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="font-['Inter:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[11px] text-white whitespace-nowrap">Lufttemperatur</p>
    </div>
  );
}

function Container13() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Light',sans-serif] leading-[28px] left-0 not-italic text-[18px] text-white top-0 tracking-[-0.4395px] whitespace-nowrap">34°C</p>
    </div>
  );
}

function Container11() {
  return (
    <div className="h-[44px] relative shrink-0 w-[85.578px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container12 />
        <Container13 />
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="bg-[rgba(77,77,77,0.7)] content-stretch flex gap-[12px] h-[94px] items-center px-[10px] py-[5px] relative rounded-[16px] shrink-0 w-[171px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#111] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Icon2 />
      <Container11 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p1f5efd00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="font-['Inter:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[11px] text-white whitespace-nowrap">Luftfeuchtigkeit</p>
    </div>
  );
}

function Container17() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Light',sans-serif] leading-[28px] left-0 not-italic text-[18px] text-white top-0 tracking-[-0.4395px] whitespace-nowrap">42%</p>
    </div>
  );
}

function Container15() {
  return (
    <div className="h-[44px] relative shrink-0 w-[89.453px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container16 />
        <Container17 />
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="bg-[rgba(77,77,77,0.7)] content-stretch flex gap-[12px] h-[94px] items-center px-[10px] py-[5px] relative rounded-[16px] shrink-0 w-[171px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#111] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Icon3 />
      <Container15 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p15cb5380} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p2021cec0} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p30db8e80} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="font-['Inter:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[11px] text-white whitespace-nowrap">Windgeschwindigkeit</p>
    </div>
  );
}

function Container21() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Light',sans-serif] leading-[28px] left-0 not-italic text-[18px] text-white top-0 tracking-[-0.4395px] whitespace-nowrap">12 km/h</p>
    </div>
  );
}

function Container19() {
  return (
    <div className="h-[44px] relative shrink-0 w-[120.203px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container20 />
        <Container21 />
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="bg-[rgba(77,77,77,0.7)] content-stretch flex gap-[12px] h-[94px] items-center px-[10px] py-[5px] relative rounded-[16px] shrink-0 w-[171px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#111] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Icon4 />
      <Container19 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p20d10600} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M10 1.66667V3.33333" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M10 16.6667V18.3333" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p2561cd80} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p1a2cf7c0} id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M1.66667 10H3.33333" id="Vector_6" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M16.6667 10H18.3333" id="Vector_7" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p3d0afd40} id="Vector_8" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p18688e80} id="Vector_9" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="font-['Inter:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[11px] text-white whitespace-nowrap">Sonneneinstrahlung</p>
    </div>
  );
}

function Container25() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Light',sans-serif] leading-[28px] left-0 not-italic text-[18px] text-white top-0 tracking-[-0.4395px] whitespace-nowrap">Hoch</p>
    </div>
  );
}

function Container23() {
  return (
    <div className="h-[44px] relative shrink-0 w-[112.609px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container24 />
        <Container25 />
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="bg-[rgba(77,77,77,0.7)] content-stretch flex gap-[12px] h-[94px] items-center px-[10px] py-[5px] relative rounded-[16px] shrink-0 w-[171px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#111] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Icon5 />
      <Container23 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-start flex flex-[1_0_0] flex-wrap gap-[16px] h-[204px] items-start min-w-px relative">
      <Container10 />
      <Container14 />
      <Container18 />
      <Container22 />
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p3a14cd80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container28() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full" data-name="Container">
      <p className="font-['Inter:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[11px] text-white whitespace-nowrap">
        Beurteilungs-
        <br aria-hidden="true" />
        temperatur
      </p>
    </div>
  );
}

function Container29() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Light',sans-serif] leading-[28px] left-0 not-italic text-[28px] text-white top-0 tracking-[-0.4395px] whitespace-nowrap">34°C</p>
    </div>
  );
}

function Container27() {
  return (
    <div className="relative shrink-0 w-[85.578px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[20px] items-start relative size-full">
        <Container28 />
        <Container29 />
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="bg-[#325cda] content-stretch flex flex-col gap-[12px] h-[204px] items-start justify-center px-[10px] py-[5px] relative rounded-[16px] shrink-0 w-[121px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#111] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Icon6 />
      <Container27 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row justify-center size-full">
        <div className="content-stretch flex gap-[10px] items-start justify-center pb-[18px] px-[18px] relative size-full">
          <Frame3 />
          <Container26 />
        </div>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] leading-[16px] min-w-px not-italic relative text-[14px] text-black tracking-[0.6px]">Maßnahmen erforderlich</p>
    </div>
  );
}

function Container34() {
  return <div className="absolute bg-[#ff6a48] left-0 rounded-[33554400px] size-[6px] top-[8px]" data-name="Container" />;
}

function Container35() {
  return (
    <div className="absolute h-[20px] left-[18px] top-0 w-[417px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] leading-[20px] left-0 not-italic text-[14px] text-black top-0 tracking-[-0.1504px] whitespace-nowrap">Schattenplätze bereitstellen</p>
    </div>
  );
}

function Container33() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <Container34 />
      <Container35 />
    </div>
  );
}

function Container37() {
  return <div className="absolute bg-[#ff6a48] left-0 rounded-[33554400px] size-[6px] top-[8px]" data-name="Container" />;
}

function Container38() {
  return (
    <div className="absolute h-[20px] left-[18px] top-0 w-[417px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] leading-[20px] left-0 not-italic text-[14px] text-black top-0 tracking-[-0.1504px] whitespace-nowrap">Schwere Arbeiten vor 13:00 erledigen</p>
    </div>
  );
}

function Container36() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <Container37 />
      <Container38 />
    </div>
  );
}

function Container40() {
  return <div className="absolute bg-[#ff6a48] left-0 rounded-[33554400px] size-[6px] top-[8px]" data-name="Container" />;
}

function Container41() {
  return (
    <div className="absolute h-[20px] left-[18px] top-0 w-[417px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] leading-[20px] left-0 not-italic text-[14px] text-black top-0 tracking-[-0.1504px] whitespace-nowrap">Ausreichend trinken + Sonnenschutz (LSF 50+)</p>
    </div>
  );
}

function Container39() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <Container40 />
      <Container41 />
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[84px] items-start relative shrink-0 w-full" data-name="Container">
      <Container33 />
      <Container36 />
      <Container39 />
    </div>
  );
}

function Container30() {
  return (
    <div className="bg-white h-[160px] relative rounded-[24px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[12px] items-start pt-[24px] px-[24px] relative size-full">
        <Container31 />
        <Container32 />
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['Inter:Regular',sans-serif] leading-[16px] left-0 not-italic text-[14px] text-black top-0 tracking-[0.6px] whitespace-nowrap">Warum?</p>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[6.453px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#ff6a48] text-[14px] top-0 tracking-[-0.1504px] whitespace-nowrap">•</p>
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[20px] relative shrink-0 w-[176.922px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0 tracking-[-0.1504px] whitespace-nowrap">Hitze: 34°C am Nachmittag</p>
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="content-stretch flex gap-[8px] h-[20px] items-start relative shrink-0 w-full" data-name="Container">
      <Text1 />
      <Text2 />
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[20px] relative shrink-0 w-[6.453px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#ff6a48] text-[14px] top-0 tracking-[-0.1504px] whitespace-nowrap">•</p>
      </div>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[20px] relative shrink-0 w-[154.875px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0 tracking-[-0.1504px] whitespace-nowrap">UV-Index: 8 (sehr hoch)</p>
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="content-stretch flex gap-[8px] h-[20px] items-start relative shrink-0 w-full" data-name="Container">
      <Text3 />
      <Text4 />
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[20px] relative shrink-0 w-[6.453px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#ff6a48] text-[14px] top-0 tracking-[-0.1504px] whitespace-nowrap">•</p>
      </div>
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[20px] relative shrink-0 w-[203.609px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0 tracking-[-0.1504px] whitespace-nowrap">Schwere Arbeit + direkte Sonne</p>
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="content-stretch flex gap-[8px] h-[20px] items-start relative shrink-0 w-full" data-name="Container">
      <Text5 />
      <Text6 />
    </div>
  );
}

function Container43() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[76px] items-start relative shrink-0 w-full" data-name="Container">
      <Container44 />
      <Container45 />
      <Container46 />
    </div>
  );
}

function Container42() {
  return (
    <div className="bg-[#e2e8f0] h-[154px] relative rounded-[24px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[24px]" />
      <div className="content-stretch flex flex-col gap-[12px] items-start pb-px pt-[21px] px-[21px] relative size-full">
        <Heading />
        <Container43 />
      </div>
    </div>
  );
}

function Text7() {
  return (
    <div className="h-[20px] relative shrink-0 w-[97.172px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] leading-[16px] left-0 not-italic text-[14px] text-black top-0 tracking-[0.6px] whitespace-nowrap">Mehr anzeigen</p>
      </div>
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M4 6L8 10L12 6" id="Vector" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="h-[52px] relative shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between p-[16px] relative size-full">
          <Text7 />
          <Icon7 />
        </div>
      </div>
    </div>
  );
}

function Container47() {
  return (
    <div className="bg-white h-[54px] relative rounded-[14px] shrink-0 w-full" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-px relative size-full">
          <Button1 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Frame1() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[18px] items-start px-[18px] relative size-full">
        <Container30 />
        <Container42 />
        <Container47 />
      </div>
    </div>
  );
}

function HeuteView() {
  return (
    <div className="bg-black content-stretch drop-shadow-[0px_4px_2px_rgba(0,0,0,0.25)] flex flex-col h-[1328px] items-start relative shrink-0 w-full" data-name="HeuteView">
      <Container />
      <Frame4 />
      <Frame5 />
      <Frame1 />
    </div>
  );
}

function MainContent() {
  return (
    <div className="absolute content-stretch flex flex-col h-[1408px] items-start left-0 top-0 w-[531px]" data-name="Main Content">
      <HeuteView />
    </div>
  );
}

function Icon8() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-[20px]" data-name="Icon">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <div className="absolute bottom-[12.5%] left-[37.5%] right-[37.5%] top-1/2" data-name="Vector">
          <div className="absolute inset-[-11.11%_-16.67%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.66667 9.16667">
              <path d={svgPaths.p12f93600} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
            </svg>
          </div>
        </div>
        <div className="absolute inset-[8.34%_12.5%_12.5%_12.5%]" data-name="Vector">
          <div className="absolute inset-[-5.26%_-5.56%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6667 17.4996">
              <path d={svgPaths.p29aa3400} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Text8() {
  return (
    <div className="h-[16px] relative shrink-0 w-[34.688px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Medium',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#0a0a0a] text-[12px] text-center whitespace-nowrap">Heute</p>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="h-[56px] relative rounded-[10px] shrink-0 w-[66.688px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-center px-[16px] py-[8px] relative size-full">
        <Icon8 />
        <Text8 />
      </div>
    </div>
  );
}

function Icon9() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-[20px]" data-name="Icon">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <div className="absolute bottom-3/4 left-[33.33%] right-[66.67%] top-[8.33%]" data-name="Vector">
          <div className="absolute inset-[-25%_-0.83px]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.66667 5">
              <path d="M0.833333 0.833333V4.16667" id="Vector" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
            </svg>
          </div>
        </div>
        <div className="absolute bottom-3/4 left-[66.67%] right-[33.33%] top-[8.33%]" data-name="Vector">
          <div className="absolute inset-[-25%_-0.83px]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.66667 5">
              <path d="M0.833333 0.833333V4.16667" id="Vector" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
            </svg>
          </div>
        </div>
        <div className="absolute inset-[16.67%_12.5%_8.33%_12.5%]" data-name="Vector">
          <div className="absolute inset-[-5.56%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6667 16.6667">
              <path d={svgPaths.pf3beb80} id="Vector" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
            </svg>
          </div>
        </div>
        <div className="absolute inset-[41.67%_12.5%_58.33%_12.5%]" data-name="Vector">
          <div className="absolute inset-[-0.83px_-5.56%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6667 1.66667">
              <path d="M0.833333 0.833333H15.8333" id="Vector" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Text9() {
  return (
    <div className="h-[16px] relative shrink-0 w-[46.75px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Medium',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#717182] text-[12px] text-center whitespace-nowrap">Planung</p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="h-[56px] relative rounded-[10px] shrink-0 w-[78.75px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-center px-[16px] py-[8px] relative size-full">
        <Icon9 />
        <Text9 />
      </div>
    </div>
  );
}

function Icon10() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-[20px]" data-name="Icon">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <div className="absolute inset-[12.44%_8.34%_12.5%_8.26%]" data-name="Vector">
          <div className="absolute inset-[-5.55%_-5%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.3466 16.6783">
              <path d={svgPaths.p31b4080} id="Vector" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
            </svg>
          </div>
        </div>
        <div className="absolute bottom-[45.83%] left-1/2 right-1/2 top-[37.5%]" data-name="Vector">
          <div className="absolute inset-[-25%_-0.83px]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.66667 5">
              <path d="M0.833333 0.833333V4.16667" id="Vector" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
            </svg>
          </div>
        </div>
        <div className="absolute bottom-[29.17%] left-1/2 right-[49.96%] top-[70.83%]" data-name="Vector">
          <div className="absolute inset-[-0.83px]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.675 1.66667">
              <path d="M0.833333 0.833333H0.841667" id="Vector" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Text10() {
  return (
    <div className="h-[16px] relative shrink-0 w-[51.797px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Medium',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#717182] text-[12px] text-center whitespace-nowrap">Warnung</p>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="h-[56px] relative rounded-[10px] shrink-0 w-[83.797px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-center px-[16px] py-[8px] relative size-full">
        <Icon10 />
        <Text10 />
      </div>
    </div>
  );
}

function Icon11() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-[20px]" data-name="Icon">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <div className="absolute inset-[8.33%_12.43%]" data-name="Vector">
          <div className="absolute inset-[-5%_-5.54%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.696 18.3333">
              <path d={svgPaths.p1f3cfb80} id="Vector" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
            </svg>
          </div>
        </div>
        <div className="absolute inset-[37.5%]" data-name="Vector">
          <div className="absolute inset-[-16.67%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.66667 6.66667">
              <path d={svgPaths.p2314a170} id="Vector" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Text11() {
  return (
    <div className="h-[16px] relative shrink-0 w-[77.797px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Medium',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#717182] text-[12px] text-center whitespace-nowrap">Einstellungen</p>
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="h-[56px] relative rounded-[10px] shrink-0 w-[109.797px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-center px-[16px] py-[8px] relative size-full">
        <Icon11 />
        <Text11 />
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="h-[72px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pl-[29.984px] pr-[30.031px] py-[8px] relative size-full">
          <Button2 />
          <Button3 />
          <Button4 />
          <Button5 />
        </div>
      </div>
    </div>
  );
}

function Navigation() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[73px] items-start left-[7px] pt-px top-[1294px] w-[531px]" data-name="Navigation">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0.1)] border-solid border-t inset-0 pointer-events-none" />
      <Container48 />
    </div>
  );
}

function App() {
  return (
    <div className="bg-white h-[1408px] relative shrink-0 w-full" data-name="App">
      <MainContent />
      <Navigation />
    </div>
  );
}

function Body() {
  return (
    <div className="content-stretch flex flex-col h-[1328px] items-start relative shrink-0 w-full" data-name="Body">
      <App />
    </div>
  );
}

function DesignReviewAndFeedback() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[1408px] items-start left-0 top-0 w-[531px]" data-name="Design Review and Feedback">
      <Body />
    </div>
  );
}

export default function Group() {
  return (
    <div className="relative size-full">
      <DesignReviewAndFeedback />
      <div className="absolute inset-[24.08%_41.05%_68.68%_39.74%]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 102 102">
          <path d={svgPaths.p1aca0680} fill="var(--fill-0, white)" id="Vector" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Bold',sans-serif] inset-[26.56%_41.24%_70.31%_39.92%] leading-[normal] not-italic text-[#222] text-[36px] text-center">1</p>
      <div className="absolute flex inset-[20.7%_19.88%_67.81%_63.41%] items-center justify-center" style={{ containerType: "size" }}>
        <div className="flex-none h-[hypot(26.8302cqw,-93.6963cqh)] rotate-[-171.07deg] w-[hypot(-73.1698cqw,-6.30372cqh)]">
          <div className="relative size-full" data-name="Vector">
            <div className="absolute inset-[-15.64%_-36.52%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 113.744 201.475">
                <path d={svgPaths.p2e6df610} id="Vector" stroke="var(--stroke-0, #FF6A48)" strokeLinecap="round" strokeWidth="48" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] leading-[normal] left-[261.5px] not-italic text-[12px] text-black text-center top-[357px] whitespace-nowrap">6:35 pm</p>
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] leading-[normal] left-[261.5px] not-italic text-[12px] text-black text-center top-[418px] whitespace-nowrap">Niedrig</p>
    </div>
  );
}