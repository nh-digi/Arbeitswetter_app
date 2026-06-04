import svgPaths from "./svg-r76z2mhgu1";

function WeatherTitleDiscreetTitleOnly() {
  return (
    <div className="content-stretch flex flex-col items-start py-[12px] relative shrink-0 w-full" data-name="Weather Title Discreet Title only">
      <p className="font-['Inter:Semi_Bold',sans-serif] h-[20px] leading-[1.35] not-italic overflow-hidden relative shrink-0 text-[15px] text-ellipsis text-white w-[361px] whitespace-nowrap">10-Day Forecast</p>
    </div>
  );
}

function Sun() {
  return (
    <div className="relative shrink-0 size-[48px]" data-name="Sun">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 48">
        <g clipPath="url(#clip0_40_154)" id="Sun">
          <path clipRule="evenodd" d={svgPaths.p2507ffc0} fill="var(--fill-0, white)" fillRule="evenodd" id="Icon" />
        </g>
        <defs>
          <clipPath id="clip0_40_154">
            <rect fill="white" height="48" width="48" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[64px]" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] leading-[1.3] overflow-hidden relative shrink-0 text-[22px] text-ellipsis text-right text-white tracking-[-0.22px]">20°C</p>
      <p className="font-['Inter:Regular',sans-serif] leading-[1.35] overflow-hidden relative shrink-0 text-[17px] text-[rgba(255,255,255,0.4)] text-center text-ellipsis w-[20px]">/</p>
      <p className="font-['Inter:Regular',sans-serif] leading-[1.35] overflow-hidden relative shrink-0 text-[17px] text-[rgba(255,255,255,0.4)] text-ellipsis">30°C</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start not-italic relative shrink-0 w-full whitespace-nowrap" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] leading-[normal] min-w-full overflow-hidden relative shrink-0 text-[13px] text-[rgba(255,255,255,0.7)] text-ellipsis w-[min-content]">Mon</p>
      <Frame3 />
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col gap-[48px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <Sun />
      <Frame2 />
    </div>
  );
}

function WeatherDayForecastCell01Fixed() {
  return (
    <div className="bg-[rgba(255,255,255,0.08)] flex-[1_0_0] min-w-[130px] relative rounded-[8px]" data-name="Weather Day Forecast Cell 01  [fixed]">
      <div className="content-stretch flex flex-col items-start min-w-[inherit] pb-[12px] pt-[16px] px-[12px] relative size-full">
        <Container />
      </div>
    </div>
  );
}

function CloudSun() {
  return (
    <div className="relative shrink-0 size-[48px]" data-name="Cloud Sun">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 48">
        <g id="Cloud Sun">
          <g id="Icon">
            <path d={svgPaths.p200ba800} fill="var(--fill-0, white)" />
            <path clipRule="evenodd" d={svgPaths.pec67ef2} fill="var(--fill-0, white)" fillRule="evenodd" />
            <path d={svgPaths.p2bee2a00} fill="var(--fill-0, white)" />
            <path d={svgPaths.p3accd80} fill="var(--fill-0, white)" />
            <path d={svgPaths.p25ed4480} fill="var(--fill-0, white)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[64px]" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] leading-[1.3] overflow-hidden relative shrink-0 text-[22px] text-ellipsis text-right text-white tracking-[-0.22px]">19°C</p>
      <p className="font-['Inter:Regular',sans-serif] leading-[1.35] overflow-hidden relative shrink-0 text-[17px] text-[rgba(255,255,255,0.4)] text-center text-ellipsis w-[20px]">/</p>
      <p className="font-['Inter:Regular',sans-serif] leading-[1.35] overflow-hidden relative shrink-0 text-[17px] text-[rgba(255,255,255,0.4)] text-ellipsis">29°C</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start not-italic relative shrink-0 w-full whitespace-nowrap" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] leading-[normal] min-w-full overflow-hidden relative shrink-0 text-[13px] text-[rgba(255,255,255,0.7)] text-ellipsis w-[min-content]">Tue</p>
      <Frame5 />
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col gap-[48px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <CloudSun />
      <Frame4 />
    </div>
  );
}

function WeatherDayForecastCell() {
  return (
    <div className="bg-[rgba(255,255,255,0.08)] flex-[1_0_0] min-w-[130px] relative rounded-[8px]" data-name="Weather Day Forecast Cell 02">
      <div className="content-stretch flex flex-col items-start min-w-[inherit] pb-[12px] pt-[16px] px-[12px] relative size-full">
        <Container1 />
      </div>
    </div>
  );
}

function CloudSun1() {
  return (
    <div className="relative shrink-0 size-[48px]" data-name="Cloud Sun">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 48">
        <g id="Cloud Sun">
          <g id="Icon">
            <path d={svgPaths.p200ba800} fill="var(--fill-0, white)" />
            <path clipRule="evenodd" d={svgPaths.pec67ef2} fill="var(--fill-0, white)" fillRule="evenodd" />
            <path d={svgPaths.p2bee2a00} fill="var(--fill-0, white)" />
            <path d={svgPaths.p3accd80} fill="var(--fill-0, white)" />
            <path d={svgPaths.p25ed4480} fill="var(--fill-0, white)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[64px]" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] leading-[1.3] overflow-hidden relative shrink-0 text-[22px] text-ellipsis text-right text-white tracking-[-0.22px]">18°C</p>
      <p className="font-['Inter:Regular',sans-serif] leading-[1.35] overflow-hidden relative shrink-0 text-[17px] text-[rgba(255,255,255,0.4)] text-center text-ellipsis w-[20px]">/</p>
      <p className="font-['Inter:Regular',sans-serif] leading-[1.35] overflow-hidden relative shrink-0 text-[17px] text-[rgba(255,255,255,0.4)] text-ellipsis">28°C</p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start not-italic relative shrink-0 w-full whitespace-nowrap" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] leading-[normal] min-w-full overflow-hidden relative shrink-0 text-[13px] text-[rgba(255,255,255,0.7)] text-ellipsis w-[min-content]">Wed</p>
      <Frame7 />
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col gap-[48px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <CloudSun1 />
      <Frame6 />
    </div>
  );
}

function WeatherDayForecastCell1() {
  return (
    <div className="bg-[rgba(255,255,255,0.08)] flex-[1_0_0] min-w-[130px] relative rounded-[8px]" data-name="Weather Day Forecast Cell 03">
      <div className="content-stretch flex flex-col items-start min-w-[inherit] pb-[12px] pt-[16px] px-[12px] relative size-full">
        <Container2 />
      </div>
    </div>
  );
}

function Rain() {
  return (
    <div className="relative shrink-0 size-[48px]" data-name="Rain">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 48">
        <g id="Rain">
          <path clipRule="evenodd" d={svgPaths.pd0d1780} fill="var(--fill-0, white)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[64px]" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] leading-[1.3] overflow-hidden relative shrink-0 text-[22px] text-ellipsis text-right text-white tracking-[-0.22px]">17°C</p>
      <p className="font-['Inter:Regular',sans-serif] leading-[1.35] overflow-hidden relative shrink-0 text-[17px] text-[rgba(255,255,255,0.4)] text-center text-ellipsis w-[20px]">/</p>
      <p className="font-['Inter:Regular',sans-serif] leading-[1.35] overflow-hidden relative shrink-0 text-[17px] text-[rgba(255,255,255,0.4)] text-ellipsis">27°C</p>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start not-italic relative shrink-0 w-full whitespace-nowrap" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] leading-[normal] min-w-full overflow-hidden relative shrink-0 text-[13px] text-[rgba(255,255,255,0.7)] text-ellipsis w-[min-content]">Thu</p>
      <Frame9 />
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col gap-[48px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <Rain />
      <Frame8 />
    </div>
  );
}

function WeatherDayForecastCell2() {
  return (
    <div className="bg-[rgba(255,255,255,0.08)] flex-[1_0_0] min-w-[130px] relative rounded-[8px]" data-name="Weather Day Forecast Cell 04">
      <div className="content-stretch flex flex-col items-start min-w-[inherit] pb-[12px] pt-[16px] px-[12px] relative size-full">
        <Container3 />
      </div>
    </div>
  );
}

function LightningWeather() {
  return (
    <div className="relative shrink-0 size-[48px]" data-name="Lightning Weather">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 48">
        <g id="Lightning Weather">
          <path clipRule="evenodd" d={svgPaths.p15234b00} fill="var(--fill-0, white)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[64px]" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] leading-[1.3] overflow-hidden relative shrink-0 text-[22px] text-ellipsis text-right text-white tracking-[-0.22px]">16°C</p>
      <p className="font-['Inter:Regular',sans-serif] leading-[1.35] overflow-hidden relative shrink-0 text-[17px] text-[rgba(255,255,255,0.4)] text-center text-ellipsis w-[20px]">/</p>
      <p className="font-['Inter:Regular',sans-serif] leading-[1.35] overflow-hidden relative shrink-0 text-[17px] text-[rgba(255,255,255,0.4)] text-ellipsis">26°C</p>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start not-italic relative shrink-0 w-full whitespace-nowrap" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] leading-[normal] min-w-full overflow-hidden relative shrink-0 text-[13px] text-[rgba(255,255,255,0.7)] text-ellipsis w-[min-content]">Fri</p>
      <Frame11 />
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col gap-[48px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <LightningWeather />
      <Frame10 />
    </div>
  );
}

function WeatherDayForecastCell3() {
  return (
    <div className="bg-[rgba(255,255,255,0.08)] flex-[1_0_0] min-w-[130px] relative rounded-[8px]" data-name="Weather Day Forecast Cell 05">
      <div className="content-stretch flex flex-col items-start min-w-[inherit] pb-[12px] pt-[16px] px-[12px] relative size-full">
        <Container4 />
      </div>
    </div>
  );
}

function Sun1() {
  return (
    <div className="relative shrink-0 size-[48px]" data-name="Sun">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 48">
        <g clipPath="url(#clip0_40_154)" id="Sun">
          <path clipRule="evenodd" d={svgPaths.p2507ffc0} fill="var(--fill-0, white)" fillRule="evenodd" id="Icon" />
        </g>
        <defs>
          <clipPath id="clip0_40_154">
            <rect fill="white" height="48" width="48" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[64px]" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] leading-[1.3] overflow-hidden relative shrink-0 text-[22px] text-ellipsis text-right text-white tracking-[-0.22px]">15°C</p>
      <p className="font-['Inter:Regular',sans-serif] leading-[1.35] overflow-hidden relative shrink-0 text-[17px] text-[rgba(255,255,255,0.4)] text-center text-ellipsis w-[20px]">/</p>
      <p className="font-['Inter:Regular',sans-serif] leading-[1.35] overflow-hidden relative shrink-0 text-[17px] text-[rgba(255,255,255,0.4)] text-ellipsis">25°C</p>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start not-italic relative shrink-0 w-full whitespace-nowrap" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] leading-[normal] min-w-full overflow-hidden relative shrink-0 text-[13px] text-[rgba(255,255,255,0.7)] text-ellipsis w-[min-content]">Sat</p>
      <Frame13 />
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col gap-[48px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <Sun1 />
      <Frame12 />
    </div>
  );
}

function WeatherDayForecastCell4() {
  return (
    <div className="bg-[rgba(255,255,255,0.08)] flex-[1_0_0] min-w-[130px] relative rounded-[8px]" data-name="Weather Day Forecast Cell 06">
      <div className="content-stretch flex flex-col items-start min-w-[inherit] pb-[12px] pt-[16px] px-[12px] relative size-full">
        <Container5 />
      </div>
    </div>
  );
}

function Sun2() {
  return (
    <div className="relative shrink-0 size-[48px]" data-name="Sun">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 48">
        <g clipPath="url(#clip0_40_154)" id="Sun">
          <path clipRule="evenodd" d={svgPaths.p2507ffc0} fill="var(--fill-0, white)" fillRule="evenodd" id="Icon" />
        </g>
        <defs>
          <clipPath id="clip0_40_154">
            <rect fill="white" height="48" width="48" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[64px]" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] leading-[1.3] overflow-hidden relative shrink-0 text-[22px] text-ellipsis text-right text-white tracking-[-0.22px]">14°C</p>
      <p className="font-['Inter:Regular',sans-serif] leading-[1.35] overflow-hidden relative shrink-0 text-[17px] text-[rgba(255,255,255,0.4)] text-center text-ellipsis w-[20px]">/</p>
      <p className="font-['Inter:Regular',sans-serif] leading-[1.35] overflow-hidden relative shrink-0 text-[17px] text-[rgba(255,255,255,0.4)] text-ellipsis">24°C</p>
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start not-italic relative shrink-0 w-full whitespace-nowrap" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] leading-[normal] min-w-full overflow-hidden relative shrink-0 text-[13px] text-[rgba(255,255,255,0.7)] text-ellipsis w-[min-content]">Sun</p>
      <Frame15 />
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col gap-[48px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <Sun2 />
      <Frame14 />
    </div>
  );
}

function WeatherDayForecastCell5() {
  return (
    <div className="bg-[rgba(255,255,255,0.08)] flex-[1_0_0] min-w-[130px] relative rounded-[8px]" data-name="Weather Day Forecast Cell 07">
      <div className="content-stretch flex flex-col items-start min-w-[inherit] pb-[12px] pt-[16px] px-[12px] relative size-full">
        <Container6 />
      </div>
    </div>
  );
}

function Sun3() {
  return (
    <div className="relative shrink-0 size-[48px]" data-name="Sun">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 48">
        <g clipPath="url(#clip0_40_154)" id="Sun">
          <path clipRule="evenodd" d={svgPaths.p2507ffc0} fill="var(--fill-0, white)" fillRule="evenodd" id="Icon" />
        </g>
        <defs>
          <clipPath id="clip0_40_154">
            <rect fill="white" height="48" width="48" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[64px]" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] leading-[1.3] overflow-hidden relative shrink-0 text-[22px] text-ellipsis text-right text-white tracking-[-0.22px]">13°C</p>
      <p className="font-['Inter:Regular',sans-serif] leading-[1.35] overflow-hidden relative shrink-0 text-[17px] text-[rgba(255,255,255,0.4)] text-center text-ellipsis w-[20px]">/</p>
      <p className="font-['Inter:Regular',sans-serif] leading-[1.35] overflow-hidden relative shrink-0 text-[17px] text-[rgba(255,255,255,0.4)] text-ellipsis">23°C</p>
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start not-italic relative shrink-0 w-full whitespace-nowrap" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] leading-[normal] min-w-full overflow-hidden relative shrink-0 text-[13px] text-[rgba(255,255,255,0.7)] text-ellipsis w-[min-content]">Mon</p>
      <Frame17 />
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-col gap-[48px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <Sun3 />
      <Frame16 />
    </div>
  );
}

function WeatherDayForecastCell6() {
  return (
    <div className="bg-[rgba(255,255,255,0.08)] flex-[1_0_0] min-w-[130px] relative rounded-[8px]" data-name="Weather Day Forecast Cell 08">
      <div className="content-stretch flex flex-col items-start min-w-[inherit] pb-[12px] pt-[16px] px-[12px] relative size-full">
        <Container7 />
      </div>
    </div>
  );
}

function Sun4() {
  return (
    <div className="relative shrink-0 size-[48px]" data-name="Sun">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 48">
        <g clipPath="url(#clip0_40_154)" id="Sun">
          <path clipRule="evenodd" d={svgPaths.p2507ffc0} fill="var(--fill-0, white)" fillRule="evenodd" id="Icon" />
        </g>
        <defs>
          <clipPath id="clip0_40_154">
            <rect fill="white" height="48" width="48" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[64px]" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] leading-[1.3] overflow-hidden relative shrink-0 text-[22px] text-ellipsis text-right text-white tracking-[-0.22px]">12°C</p>
      <p className="font-['Inter:Regular',sans-serif] leading-[1.35] overflow-hidden relative shrink-0 text-[17px] text-[rgba(255,255,255,0.4)] text-center text-ellipsis w-[20px]">/</p>
      <p className="font-['Inter:Regular',sans-serif] leading-[1.35] overflow-hidden relative shrink-0 text-[17px] text-[rgba(255,255,255,0.4)] text-ellipsis">22°C</p>
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start not-italic relative shrink-0 w-full whitespace-nowrap" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] leading-[normal] min-w-full overflow-hidden relative shrink-0 text-[13px] text-[rgba(255,255,255,0.7)] text-ellipsis w-[min-content]">Tue</p>
      <Frame19 />
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col gap-[48px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <Sun4 />
      <Frame18 />
    </div>
  );
}

function WeatherDayForecastCell7() {
  return (
    <div className="bg-[rgba(255,255,255,0.08)] flex-[1_0_0] min-w-[130px] relative rounded-[8px]" data-name="Weather Day Forecast Cell 09">
      <div className="content-stretch flex flex-col items-start min-w-[inherit] pb-[12px] pt-[16px] px-[12px] relative size-full">
        <Container8 />
      </div>
    </div>
  );
}

function Sun5() {
  return (
    <div className="relative shrink-0 size-[48px]" data-name="Sun">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 48">
        <g clipPath="url(#clip0_40_154)" id="Sun">
          <path clipRule="evenodd" d={svgPaths.p2507ffc0} fill="var(--fill-0, white)" fillRule="evenodd" id="Icon" />
        </g>
        <defs>
          <clipPath id="clip0_40_154">
            <rect fill="white" height="48" width="48" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[64px]" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] leading-[1.3] overflow-hidden relative shrink-0 text-[22px] text-ellipsis text-right text-white tracking-[-0.22px]">11°C</p>
      <p className="font-['Inter:Regular',sans-serif] leading-[1.35] overflow-hidden relative shrink-0 text-[17px] text-[rgba(255,255,255,0.4)] text-center text-ellipsis w-[20px]">/</p>
      <p className="font-['Inter:Regular',sans-serif] leading-[1.35] overflow-hidden relative shrink-0 text-[17px] text-[rgba(255,255,255,0.4)] text-ellipsis">21°C</p>
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start not-italic relative shrink-0 w-full whitespace-nowrap" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] leading-[normal] min-w-full overflow-hidden relative shrink-0 text-[13px] text-[rgba(255,255,255,0.7)] text-ellipsis w-[min-content]">Wed</p>
      <Frame21 />
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col gap-[48px] items-start justify-center relative shrink-0 w-[106px]" data-name="Container">
      <Sun5 />
      <Frame20 />
    </div>
  );
}

function WeatherDayForecastCell8() {
  return (
    <div className="bg-[rgba(255,255,255,0.08)] flex-[1_0_0] min-w-[130px] relative rounded-[8px]" data-name="Weather Day Forecast Cell 10">
      <div className="content-stretch flex flex-col items-start min-w-[inherit] pb-[12px] pt-[16px] px-[12px] relative size-full">
        <Container9 />
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Frame">
      <div className="overflow-x-auto overflow-y-clip size-full">
        <div className="content-stretch flex gap-[8px] items-start pr-[16px] relative size-full">
          <WeatherDayForecastCell01Fixed />
          <WeatherDayForecastCell />
          <WeatherDayForecastCell1 />
          <WeatherDayForecastCell2 />
          <WeatherDayForecastCell3 />
          <WeatherDayForecastCell4 />
          <WeatherDayForecastCell5 />
          <WeatherDayForecastCell6 />
          <WeatherDayForecastCell7 />
          <WeatherDayForecastCell8 />
        </div>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative rounded-[16px]" data-name="Frame">
      <WeatherTitleDiscreetTitleOnly />
      <Frame1 />
    </div>
  );
}

export default function Weather10DayForecastHorizontal() {
  return (
    <div className="bg-black content-stretch flex items-start pl-[16px] py-[16px] relative size-full" data-name="Weather 10 Day Forecast horizontal">
      <Frame />
    </div>
  );
}