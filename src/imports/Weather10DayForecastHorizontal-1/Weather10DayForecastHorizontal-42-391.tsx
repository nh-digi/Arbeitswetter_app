import svgPaths from "./svg-obbl72rr4r";

function WeatherTitleDiscreetTitleOnly() {
  return (
    <div className="content-stretch flex flex-col items-start py-[12px] relative shrink-0 w-full" data-name="Weather Title Discreet Title only">
      <p className="font-['Inter:Semi_Bold',sans-serif] h-[20px] leading-[1.35] not-italic overflow-hidden relative shrink-0 text-[15px] text-ellipsis text-white w-[361px] whitespace-nowrap">10-Day Forecast</p>
    </div>
  );
}

function Icon() {
  return (
    <div className="h-[30.857px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[12.44%_8.34%_12.5%_8.26%]" data-name="Vector">
        <div className="absolute inset-[-5.55%_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28.3062 25.7323">
            <path d={svgPaths.p11537880} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.57143" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[45.83%] left-1/2 right-1/2 top-[37.5%]" data-name="Vector">
        <div className="absolute inset-[-25%_-1.29px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.57143 7.71429">
            <path d="M1.28571 1.28571V6.42857" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.57143" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[29.17%] left-1/2 right-[49.96%] top-[70.83%]" data-name="Vector">
        <div className="absolute inset-[-1.29px_-10188.45%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.58405 2.57143">
            <path d="M1.28571 1.28571H1.29833" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.57143" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="bg-[#ff6a48] content-stretch flex flex-col items-start pt-[11.571px] px-[11.571px] relative rounded-[32356030px] shrink-0 size-[54px]" data-name="Container">
      <Icon />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[64px]" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] leading-[1.3] overflow-hidden relative shrink-0 text-[22px] text-black text-ellipsis text-right tracking-[-0.22px]">20°C</p>
      <p className="font-['Inter:Regular',sans-serif] leading-[1.35] overflow-hidden relative shrink-0 text-[17px] text-[rgba(0,0,0,0.4)] text-center text-ellipsis w-[20px]">/</p>
      <p className="font-['Inter:Regular',sans-serif] leading-[1.35] overflow-hidden relative shrink-0 text-[17px] text-[rgba(0,0,0,0.4)] text-ellipsis">30°C</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start not-italic relative shrink-0 w-full whitespace-nowrap" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] leading-[normal] min-w-full overflow-hidden relative shrink-0 text-[13px] text-[rgba(0,0,0,0.7)] text-ellipsis w-[min-content]">Mon</p>
      <Frame3 />
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col gap-[27px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <Container1 />
      <Frame2 />
    </div>
  );
}

function WeatherDayForecastCell01Fixed() {
  return (
    <div className="bg-white flex-[1_0_0] min-w-[130px] relative rounded-[8px]" data-name="Weather Day Forecast Cell 01  [fixed]">
      <div className="content-stretch flex flex-col items-start min-w-[inherit] pb-[12px] pt-[16px] px-[12px] relative size-full">
        <Container />
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="h-[30.857px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[12.44%_8.34%_12.5%_8.26%]" data-name="Vector">
        <div className="absolute inset-[-5.55%_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28.3062 25.7323">
            <path d={svgPaths.p11537880} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.57143" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[45.83%] left-1/2 right-1/2 top-[37.5%]" data-name="Vector">
        <div className="absolute inset-[-25%_-1.29px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.57143 7.71429">
            <path d="M1.28571 1.28571V6.42857" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.57143" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[29.17%] left-1/2 right-[49.96%] top-[70.83%]" data-name="Vector">
        <div className="absolute inset-[-1.29px_-10188.45%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.58405 2.57143">
            <path d="M1.28571 1.28571H1.29833" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.57143" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="bg-[#ff6a48] content-stretch flex flex-col items-start pt-[11.571px] px-[11.571px] relative rounded-[32356030px] shrink-0 size-[54px]" data-name="Container">
      <Icon1 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[64px]" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] leading-[1.3] overflow-hidden relative shrink-0 text-[22px] text-ellipsis text-right text-white tracking-[-0.22px]">20°C</p>
      <p className="font-['Inter:Regular',sans-serif] leading-[1.35] overflow-hidden relative shrink-0 text-[17px] text-[rgba(255,255,255,0.4)] text-center text-ellipsis w-[20px]">/</p>
      <p className="font-['Inter:Regular',sans-serif] leading-[1.35] overflow-hidden relative shrink-0 text-[17px] text-[rgba(255,255,255,0.4)] text-ellipsis">30°C</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start not-italic relative shrink-0 w-full whitespace-nowrap" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] leading-[normal] min-w-full overflow-hidden relative shrink-0 text-[13px] text-[rgba(255,255,255,0.7)] text-ellipsis w-[min-content]">Mi</p>
      <Frame5 />
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col gap-[27px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <Container3 />
      <Frame4 />
    </div>
  );
}

function WeatherDayForecastCell01Fixed1() {
  return (
    <div className="bg-[rgba(255,255,255,0.08)] flex-[1_0_0] min-w-[130px] relative rounded-[8px]" data-name="Weather Day Forecast Cell 01  [fixed]">
      <div className="content-stretch flex flex-col items-start min-w-[inherit] pb-[12px] pt-[16px] px-[12px] relative size-full">
        <Container2 />
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="h-[30.857px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[12.44%_8.34%_12.5%_8.26%]" data-name="Vector">
        <div className="absolute inset-[-5.55%_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28.3062 25.7323">
            <path d={svgPaths.p11537880} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.57143" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[45.83%] left-1/2 right-1/2 top-[37.5%]" data-name="Vector">
        <div className="absolute inset-[-25%_-1.29px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.57143 7.71429">
            <path d="M1.28571 1.28571V6.42857" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.57143" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[29.17%] left-1/2 right-[49.96%] top-[70.83%]" data-name="Vector">
        <div className="absolute inset-[-1.29px_-10188.45%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.58405 2.57143">
            <path d="M1.28571 1.28571H1.29833" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.57143" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="bg-[#ff6a48] content-stretch flex flex-col items-start pt-[11.571px] px-[11.571px] relative rounded-[32356030px] shrink-0 size-[54px]" data-name="Container">
      <Icon2 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[64px]" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] leading-[1.3] overflow-hidden relative shrink-0 text-[22px] text-ellipsis text-right text-white tracking-[-0.22px]">20°C</p>
      <p className="font-['Inter:Regular',sans-serif] leading-[1.35] overflow-hidden relative shrink-0 text-[17px] text-[rgba(255,255,255,0.4)] text-center text-ellipsis w-[20px]">/</p>
      <p className="font-['Inter:Regular',sans-serif] leading-[1.35] overflow-hidden relative shrink-0 text-[17px] text-[rgba(255,255,255,0.4)] text-ellipsis">30°C</p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start not-italic relative shrink-0 w-full whitespace-nowrap" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] leading-[normal] min-w-full overflow-hidden relative shrink-0 text-[13px] text-[rgba(255,255,255,0.7)] text-ellipsis w-[min-content]">Do</p>
      <Frame7 />
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col gap-[27px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <Container5 />
      <Frame6 />
    </div>
  );
}

function WeatherDayForecastCell01Fixed2() {
  return (
    <div className="bg-[rgba(255,255,255,0.08)] flex-[1_0_0] min-w-[130px] relative rounded-[8px]" data-name="Weather Day Forecast Cell 01  [fixed]">
      <div className="content-stretch flex flex-col items-start min-w-[inherit] pb-[12px] pt-[16px] px-[12px] relative size-full">
        <Container4 />
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="h-[30.857px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[12.44%_8.34%_12.5%_8.26%]" data-name="Vector">
        <div className="absolute inset-[-5.55%_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28.3062 25.7323">
            <path d={svgPaths.p11537880} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.57143" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[45.83%] left-1/2 right-1/2 top-[37.5%]" data-name="Vector">
        <div className="absolute inset-[-25%_-1.29px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.57143 7.71429">
            <path d="M1.28571 1.28571V6.42857" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.57143" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[29.17%] left-1/2 right-[49.96%] top-[70.83%]" data-name="Vector">
        <div className="absolute inset-[-1.29px_-10188.45%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.58405 2.57143">
            <path d="M1.28571 1.28571H1.29833" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.57143" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="bg-[#ff6a48] content-stretch flex flex-col items-start pt-[11.571px] px-[11.571px] relative rounded-[32356030px] shrink-0 size-[54px]" data-name="Container">
      <Icon3 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[64px]" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] leading-[1.3] overflow-hidden relative shrink-0 text-[22px] text-ellipsis text-right text-white tracking-[-0.22px]">20°C</p>
      <p className="font-['Inter:Regular',sans-serif] leading-[1.35] overflow-hidden relative shrink-0 text-[17px] text-[rgba(255,255,255,0.4)] text-center text-ellipsis w-[20px]">/</p>
      <p className="font-['Inter:Regular',sans-serif] leading-[1.35] overflow-hidden relative shrink-0 text-[17px] text-[rgba(255,255,255,0.4)] text-ellipsis">30°C</p>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start not-italic relative shrink-0 w-full whitespace-nowrap" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] leading-[normal] min-w-full overflow-hidden relative shrink-0 text-[13px] text-[rgba(255,255,255,0.7)] text-ellipsis w-[min-content]">FR</p>
      <Frame9 />
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col gap-[27px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <Container7 />
      <Frame8 />
    </div>
  );
}

function WeatherDayForecastCell01Fixed3() {
  return (
    <div className="bg-[rgba(255,255,255,0.08)] flex-[1_0_0] min-w-[130px] relative rounded-[8px]" data-name="Weather Day Forecast Cell 01  [fixed]">
      <div className="content-stretch flex flex-col items-start min-w-[inherit] pb-[12px] pt-[16px] px-[12px] relative size-full">
        <Container6 />
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="h-[30.857px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[12.44%_8.34%_12.5%_8.26%]" data-name="Vector">
        <div className="absolute inset-[-5.55%_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28.3062 25.7323">
            <path d={svgPaths.p11537880} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.57143" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[45.83%] left-1/2 right-1/2 top-[37.5%]" data-name="Vector">
        <div className="absolute inset-[-25%_-1.29px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.57143 7.71429">
            <path d="M1.28571 1.28571V6.42857" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.57143" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[29.17%] left-1/2 right-[49.96%] top-[70.83%]" data-name="Vector">
        <div className="absolute inset-[-1.29px_-10188.45%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.58405 2.57143">
            <path d="M1.28571 1.28571H1.29833" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.57143" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="bg-[#ff6a48] content-stretch flex flex-col items-start pt-[11.571px] px-[11.571px] relative rounded-[32356030px] shrink-0 size-[54px]" data-name="Container">
      <Icon4 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[64px]" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] leading-[1.3] overflow-hidden relative shrink-0 text-[22px] text-ellipsis text-right text-white tracking-[-0.22px]">20°C</p>
      <p className="font-['Inter:Regular',sans-serif] leading-[1.35] overflow-hidden relative shrink-0 text-[17px] text-[rgba(255,255,255,0.4)] text-center text-ellipsis w-[20px]">/</p>
      <p className="font-['Inter:Regular',sans-serif] leading-[1.35] overflow-hidden relative shrink-0 text-[17px] text-[rgba(255,255,255,0.4)] text-ellipsis">30°C</p>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start not-italic relative shrink-0 w-full whitespace-nowrap" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] leading-[normal] min-w-full overflow-hidden relative shrink-0 text-[13px] text-[rgba(255,255,255,0.7)] text-ellipsis w-[min-content]">Sa</p>
      <Frame11 />
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col gap-[27px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <Container9 />
      <Frame10 />
    </div>
  );
}

function WeatherDayForecastCell01Fixed4() {
  return (
    <div className="bg-[rgba(255,255,255,0.08)] flex-[1_0_0] min-w-[130px] relative rounded-[8px]" data-name="Weather Day Forecast Cell 01  [fixed]">
      <div className="content-stretch flex flex-col items-start min-w-[inherit] pb-[12px] pt-[16px] px-[12px] relative size-full">
        <Container8 />
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
          <WeatherDayForecastCell01Fixed1 />
          <WeatherDayForecastCell01Fixed2 />
          <WeatherDayForecastCell01Fixed3 />
          <WeatherDayForecastCell01Fixed4 />
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