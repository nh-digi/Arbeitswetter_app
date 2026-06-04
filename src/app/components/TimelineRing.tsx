interface TimelineRingProps {
  currentHour: number;
}

export default function TimelineRing({ currentHour }: TimelineRingProps) {
  const size = 340;
  const center = size / 2;
  const outerRadius = 140;
  const innerRadius = 105;
  const clockFaceRadius = 95;
  const numberRadius = 75;

  // Convert hour (0-23) to angle (0° = 12 o'clock/midnight, clockwise)
  const hourToAngle = (hour24: number) => {
    // Map 24h to 360°: 0h at top, going clockwise
    return (hour24 / 24) * 360;
  };

  const createArc = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(center, center, outerRadius, startAngle);
    const end = polarToCartesian(center, center, outerRadius, endAngle);
    const innerStart = polarToCartesian(center, center, innerRadius, startAngle);
    const innerEnd = polarToCartesian(center, center, innerRadius, endAngle);

    const largeArcFlag = endAngle - startAngle > 180 ? '1' : '0';

    return [
      'M', start.x, start.y,
      'A', outerRadius, outerRadius, 0, largeArcFlag, 1, end.x, end.y,
      'L', innerEnd.x, innerEnd.y,
      'A', innerRadius, innerRadius, 0, largeArcFlag, 0, innerStart.x, innerStart.y,
      'Z'
    ].join(' ');
  };

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  // 24-hour clock positions (0, 6, 12, 18)
  const clockNumbers = [
    { hour: 0, angle: 0, label: '0' },
    { hour: 6, angle: 90, label: '6' },
    { hour: 12, angle: 180, label: '12' },
    { hour: 18, angle: 270, label: '18' },
  ];

  // Hour tick marks for 24 hours
  const hourTicks = Array.from({ length: 24 }, (_, i) => i);

  // Full circle background (neutral)
  const fullCircleArc = createArc(0, 360);

  // Critical period: 14:00-16:00
  const criticalStart = hourToAngle(14);
  const criticalEnd = hourToAngle(16);
  const criticalArc = createArc(criticalStart, criticalEnd);

  // Current time marker
  const currentAngle = hourToAngle(currentHour);
  const markerOuter = polarToCartesian(center, center, outerRadius + 12, currentAngle);
  const markerInner = polarToCartesian(center, center, innerRadius - 5, currentAngle);

  // Position for critical time label
  const criticalMidAngle = (criticalStart + criticalEnd) / 2;
  const criticalLabelPos = polarToCartesian(center, center, outerRadius + 25, criticalMidAngle);

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="24-Stunden Entscheidungsuhr mit kritischem Zeitfenster">
        {/* Full background ring (neutral) */}
        <path
          d={fullCircleArc}
          fill="#E5E7EB"
          stroke="#fff"
          strokeWidth="3"
        />

        {/* Critical period highlight */}
        <path
          d={criticalArc}
          fill="#C62828"
          stroke="#fff"
          strokeWidth="3"
          aria-label="Kritisches Zeitfenster 14:00-16:00 Uhr"
        />

        {/* Clock face background */}
        <circle cx={center} cy={center} r={clockFaceRadius} fill="#F8F9FA" stroke="#E5E7EB" strokeWidth="1.5" />

        {/* Hour tick marks (24h) */}
        {hourTicks.map((hour) => {
          const angle = hourToAngle(hour);
          const isMajorHour = hour % 6 === 0;
          const tickLength = isMajorHour ? 10 : 5;
          const tickStart = polarToCartesian(center, center, clockFaceRadius - tickLength, angle);
          const tickEnd = polarToCartesian(center, center, clockFaceRadius, angle);

          return (
            <line
              key={`tick-${hour}`}
              x1={tickStart.x}
              y1={tickStart.y}
              x2={tickEnd.x}
              y2={tickEnd.y}
              stroke="#9CA3AF"
              strokeWidth={isMajorHour ? 2.5 : 1.5}
            />
          );
        })}

        {/* Clock numbers (0, 6, 12, 18) */}
        {clockNumbers.map((num) => {
          const pos = polarToCartesian(center, center, numberRadius, num.angle);

          return (
            <text
              key={`number-${num.hour}`}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-foreground"
              style={{ fontSize: '16px', fontWeight: 600 }}
            >
              {num.label}
            </text>
          );
        })}

        {/* Current time marker ("Jetzt") */}
        <line
          x1={markerInner.x}
          y1={markerInner.y}
          x2={markerOuter.x}
          y2={markerOuter.y}
          stroke="#030213"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx={markerOuter.x} cy={markerOuter.y} r="6" fill="#030213" />

        {/* Center content */}
        <text
          x={center}
          y={center - 8}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-muted-foreground"
          style={{ fontSize: '12px', fontWeight: 500 }}
        >
          Jetzt
        </text>
        <text
          x={center}
          y={center + 12}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-foreground"
          style={{ fontSize: '26px', fontWeight: 600 }}
        >
          15:30
        </text>

        {/* Critical time label outside ring */}
        <text
          x={criticalLabelPos.x}
          y={criticalLabelPos.y}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-[#C62828]"
          style={{ fontSize: '13px', fontWeight: 600 }}
        >
          Kritisch
        </text>
        <text
          x={criticalLabelPos.x}
          y={criticalLabelPos.y + 14}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-[#C62828]"
          style={{ fontSize: '12px', fontWeight: 500 }}
        >
          14–16h
        </text>
      </svg>

      {/* Time explanation below */}
      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          Kritische Phase in 30 Minuten
        </p>
      </div>
    </div>
  );
}
