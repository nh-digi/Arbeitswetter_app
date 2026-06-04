import svgPaths from "./svg-j0uddx46n9";

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

function Frame1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[64px]" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] leading-[1.3] overflow-hidden relative shrink-0 text-[22px] text-black text-ellipsis text-right tracking-[-0.22px]">20°C</p>
      <p className="font-['Inter:Regular',sans-serif] leading-[1.35] overflow-hidden relative shrink-0 text-[17px] text-[rgba(0,0,0,0.4)] text-center text-ellipsis w-[20px]">/</p>
      <p className="font-['Inter:Regular',sans-serif] leading-[1.35] overflow-hidden relative shrink-0 text-[17px] text-[rgba(0,0,0,0.4)] text-ellipsis">30°C</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start not-italic relative shrink-0 w-full whitespace-nowrap" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] leading-[normal] min-w-full overflow-hidden relative shrink-0 text-[13px] text-[rgba(0,0,0,0.7)] text-ellipsis w-[min-content]">Mon</p>
      <Frame1 />
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col gap-[27px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <Container1 />
      <Frame />
    </div>
  );
}

export default function WeatherDayForecastCell01Fixed() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start pb-[12px] pt-[16px] px-[12px] relative rounded-[8px] size-full" data-name="Weather Day Forecast Cell 01  [fixed]">
      <Container />
    </div>
  );
}