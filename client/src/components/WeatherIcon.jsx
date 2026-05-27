/**
 * WeatherIcon — custom animated SVG icons keyed to OpenWeatherMap icon codes.
 *
 * OWM codes: 01d/n (clear), 02d/n (few clouds), 03d/n (scattered clouds),
 *            04d/n (broken clouds), 09d/n (shower rain), 10d/n (rain),
 *            11d/n (thunderstorm), 13d/n (snow), 50d/n (mist)
 *
 * All icons use a 64×64 viewBox and scale via width/height props.
 */

// ── Palette ────────────────────────────────────────────────
const C = {
  sunCore:    '#FBBF24',
  sunRay:     '#FDE68A',
  moon:       '#E2E8F0',
  star:       '#FDE68A',
  cloudLight: '#CBD5E1',
  cloudDark:  '#94A3B8',
  rain:       '#7DD3FC',
  lightning:  '#FDE047',
  snow:       '#BAE6FD',
  mist:       '#94A3B8',
};

// ── Reusable pieces ────────────────────────────────────────

/** Classic bumpy cloud silhouette. All circles share the same fill so they merge. */
function Cloud({ x = 32, y = 36, color = C.cloudLight, scale = 1 }) {
  const s = scale;
  const t = `translate(${x - 32 * s} ${y - 36 * s}) scale(${s})`;
  return (
    <g transform={t}>
      <ellipse cx="32" cy="46" rx="20" ry="11" fill={color} />
      <circle  cx="20" cy="42" r="11"           fill={color} />
      <circle  cx="34" cy="34" r="14"           fill={color} />
      <circle  cx="46" cy="40" r="9"            fill={color} />
    </g>
  );
}

/** Animated rain lines dropping below a cloud. */
function Rain({ drops = 3, baseX = 32, baseY = 50, color = C.rain }) {
  const spacing = 12;
  const startX = baseX - ((drops - 1) * spacing) / 2;
  return (
    <>
      {Array.from({ length: drops }, (_, i) => {
        const cx = startX + i * spacing;
        return (
          <line
            key={i}
            x1={cx}     y1={baseY}
            x2={cx - 3} y2={baseY + 10}
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ animation: `wi-rain 1s ${(i * 0.22).toFixed(2)}s ease-in infinite` }}
          />
        );
      })}
    </>
  );
}

/** Snowflake cross at a given position. */
function Snowflake({ x, y, delay = 0 }) {
  return (
    <g style={{ animation: `wi-snow 2s ${delay}s ease-in infinite` }}>
      <line x1={x}   y1={y - 6} x2={x}   y2={y + 6} stroke={C.snow} strokeWidth="2" strokeLinecap="round" />
      <line x1={x - 5} y1={y - 3} x2={x + 5} y2={y + 3} stroke={C.snow} strokeWidth="2" strokeLinecap="round" />
      <line x1={x + 5} y1={y - 3} x2={x - 5} y2={y + 3} stroke={C.snow} strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

/** Rotating sun at a given center. */
function Sun({ cx = 32, cy = 32, coreR = 12, rayInner = 16, rayOuter = 24, rays = 8 }) {
  return (
    <>
      <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: 'wi-spin 12s linear infinite' }}>
        {Array.from({ length: rays }, (_, i) => {
          const a = (i * 360) / rays * (Math.PI / 180);
          return (
            <line
              key={i}
              x1={cx + rayInner * Math.cos(a)} y1={cy + rayInner * Math.sin(a)}
              x2={cx + rayOuter * Math.cos(a)} y2={cy + rayOuter * Math.sin(a)}
              stroke={C.sunRay} strokeWidth="3" strokeLinecap="round"
            />
          );
        })}
      </g>
      <circle cx={cx} cy={cy} r={coreR} fill={C.sunCore} />
    </>
  );
}

/** Crescent moon at a given center. */
function Moon({ cx = 32, cy = 32, r = 14 }) {
  // Crescent: full circle minus an offset circle
  return (
    <path
      d={`M ${cx} ${cy - r} A ${r} ${r} 0 1 0 ${cx} ${cy + r} A ${r * 0.75} ${r * 0.75} 0 1 1 ${cx} ${cy - r} Z`}
      fill={C.moon}
    />
  );
}

// ── Icon components ────────────────────────────────────────

function ClearDay() {
  return <Sun cx={32} cy={32} coreR={13} rayInner={17} rayOuter={28} rays={8} />;
}

function ClearNight() {
  return (
    <>
      <Moon cx={28} cy={32} r={14} />
      <circle cx="50" cy="16" r="2"   fill={C.star} style={{ animation: 'wi-twinkle 2s 0.0s ease-in-out infinite' }} />
      <circle cx="56" cy="32" r="1.5" fill={C.star} style={{ animation: 'wi-twinkle 2s 0.7s ease-in-out infinite' }} />
      <circle cx="50" cy="48" r="1.5" fill={C.star} style={{ animation: 'wi-twinkle 2s 1.4s ease-in-out infinite' }} />
    </>
  );
}

function FewCloudsDay() {
  return (
    <>
      <Sun cx={44} cy={20} coreR={9} rayInner={12} rayOuter={19} rays={6} />
      <Cloud x={28} y={40} />
    </>
  );
}

function FewCloudsNight() {
  return (
    <>
      <Moon cx={44} cy={20} r={10} />
      <Cloud x={28} y={40} />
    </>
  );
}

function ScatteredClouds() {
  return <Cloud x={32} y={36} />;
}

function BrokenClouds() {
  return (
    <>
      <Cloud x={36} y={30} color={C.cloudDark} scale={0.85} />
      <Cloud x={26} y={42} />
    </>
  );
}

function ShowerRain() {
  return (
    <>
      <Cloud x={32} y={32} color={C.cloudDark} />
      <Rain drops={4} baseX={32} baseY={50} />
    </>
  );
}

function RainDay() {
  return (
    <>
      <Sun cx={46} cy={18} coreR={8} rayInner={11} rayOuter={17} rays={6} />
      <Cloud x={28} y={36} />
      <Rain drops={3} baseX={28} baseY={50} />
    </>
  );
}

function RainNight() {
  return (
    <>
      <Moon cx={46} cy={18} r={9} />
      <Cloud x={28} y={36} />
      <Rain drops={3} baseX={28} baseY={50} />
    </>
  );
}

function Thunderstorm() {
  return (
    <>
      <Cloud x={32} y={28} color={C.cloudDark} />
      {/* Lightning bolt */}
      <path
        d="M 36 38 L 27 52 L 33 52 L 24 64 L 40 48 L 34 48 Z"
        fill={C.lightning}
        style={{ animation: 'wi-lightning 2.8s ease-in-out infinite' }}
      />
      <Rain drops={2} baseX={20} baseY={46} />
    </>
  );
}

function Snow() {
  return (
    <>
      <Cloud x={32} y={28} />
      <Snowflake x={18} y={50} delay={0.0} />
      <Snowflake x={32} y={50} delay={0.4} />
      <Snowflake x={46} y={50} delay={0.8} />
    </>
  );
}

function Mist() {
  return (
    <>
      {[18, 27, 36, 45, 54].map((y, i) => (
        <line
          key={i}
          x1={i % 2 === 0 ? 8  : 14}
          y1={y}
          x2={i % 2 === 0 ? 56 : 50}
          y2={y}
          stroke={C.mist}
          strokeWidth="3.5"
          strokeLinecap="round"
          style={{
            opacity: 0.35 + i * 0.13,
            animation: `wi-mist ${1.6 + i * 0.15}s ${(i * 0.12).toFixed(2)}s ease-in-out infinite alternate`,
          }}
        />
      ))}
    </>
  );
}

// ── Map OWM code → component ───────────────────────────────

const ICON_MAP = {
  '01d': ClearDay,
  '01n': ClearNight,
  '02d': FewCloudsDay,
  '02n': FewCloudsNight,
  '03d': ScatteredClouds,
  '03n': ScatteredClouds,
  '04d': BrokenClouds,
  '04n': BrokenClouds,
  '09d': ShowerRain,
  '09n': ShowerRain,
  '10d': RainDay,
  '10n': RainNight,
  '11d': Thunderstorm,
  '11n': Thunderstorm,
  '13d': Snow,
  '13n': Snow,
  '50d': Mist,
  '50n': Mist,
};

// ── Public component ───────────────────────────────────────

export default function WeatherIcon({ icon = '01d', size = 64 }) {
  const IconComponent = ICON_MAP[icon] ?? ICON_MAP[icon?.slice(0, 3)] ?? ScatteredClouds;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      style={{ overflow: 'visible', flexShrink: 0 }}
    >
      <IconComponent />
    </svg>
  );
}
