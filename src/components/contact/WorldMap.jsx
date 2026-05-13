import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WORLD_PATHS } from './worldPaths';

const OFFICES = [
  {
    id: 'india',
    label: 'New Delhi',
    type: 'Headquarters',
    country: 'India',
    lat: 27.5,
    lon: 76.0,
    color: '#5B45C6',
    glowColor: 'rgba(91,69,198,0.4)',
    offset: { x: 0, y: -52 },
  },
  {
    id: 'uae',
    label: 'Sharjah',
    type: 'Branch Office',
    country: 'UAE',
    lat: 25.3463,
    lon: 55.4209,
    color: '#2A68C8',
    glowColor: 'rgba(42,104,200,0.4)',
    offset: { x: -60, y: -48 },
  },
  {
    id: 'nepal',
    label: 'Pokhara',
    type: 'Branch Office',
    country: 'Nepal',
    lat: 29.5,
    lon: 85.5,
    color: '#E8521A',
    glowColor: 'rgba(232,82,26,0.4)',
    offset: { x: 12, y: -52 },
  },
];

/* Cropped viewBox: removes empty Arctic/Antarctic space */
const VIEW_X = 0;
const VIEW_Y = 105;
const VIEW_W = 1010;
const VIEW_H = 370;

/* Convert lat/lon to SVG coordinates */
function toSvg(lat, lon) {
  return {
    cx: ((lon + 180) / 360) * 1010,
    cy: 333 - (lat * (1010 / 360)),
  };
}

export default function WorldMap({ activeOfficeId, onOfficeChange }) {
  const [hovered, setHovered] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  /* Track viewport width for responsive adjustments */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handlePinInteraction = useCallback((id) => {
    onOfficeChange(id);
  }, [onOfficeChange]);

  /* Responsive tooltip dimensions */
  const TT_W = isMobile ? 78 : 100;
  const TT_H = isMobile ? 26 : 32;
  const TT_FONT_LABEL = isMobile ? 5.5 : 7;
  const TT_FONT_CITY = isMobile ? 8 : 11;
  const PIN_R_ACTIVE = isMobile ? 6 : 8;
  const PIN_R_IDLE = isMobile ? 4.5 : 6;
  const PIN_STROKE = isMobile ? 2 : 2.5;

  return (
    <div className="relative w-full select-none overflow-hidden rounded-2xl border border-[#D0D5E8]/70 bg-gradient-to-br from-[#F0F2FA] via-[#E9EDF8] to-[#F5F3FF] shadow-[0_16px_48px_rgba(20,14,45,0.09)] sm:rounded-[24px] dark:border-white/10 dark:from-[#0D0B1E] dark:via-[#110E24] dark:to-[#0F0B20]">

      {/* SVG Map */}
      <svg
        viewBox={`${VIEW_X} ${VIEW_Y} ${VIEW_W} ${VIEW_H}`}
        className="w-full"
        preserveAspectRatio="xMidYMid slice"
        aria-label="World map showing The Global Avenues office locations"
        role="img"
        style={{ display: 'block' }}
      >
        <defs>
          {/* Land dot pattern */}
          <pattern id="landDots" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="1.2" cy="1.2" r="1" className="fill-[rgba(45,27,105,0.25)] dark:fill-[rgba(91,69,198,0.20)]" />
          </pattern>

          {/* Pin glow filters */}
          {OFFICES.map((office) => (
            <filter key={`glow-${office.id}`} id={`pinGlow-${office.id}`} x="-150%" y="-150%" width="400%" height="400%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
            </filter>
          ))}

          {/* Tooltip shadow */}
          <filter id="tooltipShadow" x="-25%" y="-30%" width="150%" height="180%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(20,14,45,0.16)" />
          </filter>

          {/* Pin drop shadow */}
          <filter id="pinShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="rgba(20,14,45,0.25)" />
          </filter>
        </defs>

        {/* Ocean background */}
        <rect x={VIEW_X} y={VIEW_Y} width={VIEW_W} height={VIEW_H} fill="transparent" />

        {/* Country base fills */}
        <g>
          {WORLD_PATHS.map((country) => (
            <path
              key={`base-${country.id}`}
              d={country.d}
              className="fill-[rgba(180,195,230,0.30)] dark:fill-[rgba(35,50,85,0.35)]"
            />
          ))}
        </g>

        {/* Country dot pattern overlay */}
        <g>
          {WORLD_PATHS.map((country) => (
            <path
              key={`dot-${country.id}`}
              d={country.d}
              fill="url(#landDots)"
              stroke="none"
            />
          ))}
        </g>

        {/* Country borders */}
        <g>
          {WORLD_PATHS.map((country) => (
            <path
              key={`stroke-${country.id}`}
              d={country.d}
              className="stroke-[rgba(255,255,255,0.45)] dark:stroke-[rgba(255,255,255,0.07)]"
              fill="none"
              strokeWidth="0.5"
            />
          ))}
        </g>

        {/* Connection lines between offices */}
        {(() => {
          const coords = OFFICES.map((o) => toSvg(o.lat, o.lon));
          return (
            <g>
              <line
                x1={coords[1].cx} y1={coords[1].cy}
                x2={coords[0].cx} y2={coords[0].cy}
                className="stroke-[rgba(91,69,198,0.10)] dark:stroke-[rgba(91,69,198,0.12)]"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <line
                x1={coords[0].cx} y1={coords[0].cy}
                x2={coords[2].cx} y2={coords[2].cy}
                className="stroke-[rgba(232,82,26,0.10)] dark:stroke-[rgba(232,82,26,0.12)]"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            </g>
          );
        })()}

        {/* Office pins */}
        {OFFICES.map((office) => {
          const isActive = activeOfficeId === office.id;
          const isHovered = hovered === office.id;
          const show = isActive || isHovered;
          const { cx, cy } = toSvg(office.lat, office.lon);

          const ox = office.offset?.x || 0;
          const oy = office.offset?.y || 0;

          return (
            <g
              key={office.id}
              style={{ cursor: 'pointer' }}
              className="outline-none"
              onClick={() => handlePinInteraction(office.id)}
              onMouseEnter={() => { setHovered(office.id); onOfficeChange(office.id); }}
              onMouseLeave={() => setHovered(null)}
              onTouchStart={() => handlePinInteraction(office.id)}
              aria-label={`${office.country} office — ${office.label}`}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  handlePinInteraction(office.id);
                }
              }}
            >
              {/* Invisible touch/click target — larger hit area for mobile */}
              <circle cx={cx} cy={cy} r="20" fill="transparent" />

              {/* Ambient glow */}
              <circle
                cx={cx} cy={cy} r="24"
                fill={office.color}
                opacity={isActive ? 0.14 : 0.05}
                filter={`url(#pinGlow-${office.id})`}
                style={{ transition: 'opacity 300ms ease' }}
              />

              {/* Animated pulse ring (active) */}
              <AnimatePresence>
                {isActive && (
                  <motion.circle
                    cx={cx}
                    cy={cy}
                    r={PIN_R_ACTIVE + 4}
                    fill="none"
                    stroke={office.color}
                    strokeWidth="1.5"
                    initial={{ scale: 1, opacity: 0.6 }}
                    animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeOut' }}
                    style={{ transformOrigin: `${cx}px ${cy}px` }}
                  />
                )}
              </AnimatePresence>

              {/* Outer glow ring */}
              <circle
                cx={cx} cy={cy}
                r={isActive ? PIN_R_ACTIVE + 5 : PIN_R_IDLE + 4}
                fill={office.color}
                opacity={isActive ? 0.15 : 0.08}
                style={{ transition: 'all 300ms ease' }}
              />

              {/* Pin body — gradient-filled circle with white border */}
              <circle
                cx={cx}
                cy={cy}
                r={isActive ? PIN_R_ACTIVE : PIN_R_IDLE}
                fill={office.color}
                stroke="white"
                strokeWidth={PIN_STROKE}
                filter="url(#pinShadow)"
                style={{ transition: 'all 250ms ease' }}
              />

              {/* Inner white dot */}
              <circle
                cx={cx} cy={cy}
                r={isActive ? 2.5 : 1.8}
                fill="white"
                opacity="0.9"
                style={{ transition: 'all 250ms ease' }}
              />

              {/* Tooltip */}
              <AnimatePresence>
                {show && (
                  <motion.g
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 3 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                  >
                    {/* Connector line from pin to tooltip */}
                    <line
                      x1={cx}
                      y1={cy - (isActive ? PIN_R_ACTIVE : PIN_R_IDLE) - PIN_STROKE}
                      x2={cx + ox}
                      y2={cy + oy + TT_H + 2}
                      stroke={office.color}
                      strokeWidth="1"
                      strokeDasharray="2 2"
                      opacity="0.4"
                    />

                    {/* Tooltip background */}
                    <rect
                      x={cx - TT_W / 2 + ox}
                      y={cy + oy}
                      width={TT_W}
                      height={TT_H}
                      rx="6"
                      fill="white"
                      className="dark:fill-[#1A1533]"
                      stroke={office.color}
                      strokeWidth="0.8"
                      opacity="0.96"
                      filter="url(#tooltipShadow)"
                    />

                    {/* Left accent bar */}
                    <rect
                      x={cx - TT_W / 2 + ox}
                      y={cy + oy + 3}
                      width="2.5"
                      height={TT_H - 6}
                      rx="1.5"
                      fill={office.color}
                    />

                    {/* Type label */}
                    <text
                      x={cx + ox + 2}
                      y={cy + oy + (isMobile ? 9 : 11)}
                      textAnchor="middle"
                      fontSize={TT_FONT_LABEL}
                      fontWeight="700"
                      fill={office.color}
                      fontFamily="Inter, system-ui, sans-serif"
                      letterSpacing="0.1em"
                    >
                      {office.type.toUpperCase()}
                    </text>

                    {/* City + country name */}
                    <text
                      x={cx + ox + 2}
                      y={cy + oy + (isMobile ? 20 : 24)}
                      textAnchor="middle"
                      fontSize={TT_FONT_CITY}
                      fontWeight="600"
                      className="fill-[#1A1033] dark:fill-white"
                      fontFamily="Inter, system-ui, sans-serif"
                    >
                      {office.label}, {office.country}
                    </text>
                  </motion.g>
                )}
              </AnimatePresence>
            </g>
          );
        })}
      </svg>

      {/* Bottom legend bar — responsive */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-t border-[#D0D5E8]/50 bg-white/45 px-3 py-2 backdrop-blur-md sm:gap-5 sm:px-6 sm:py-2.5 dark:border-white/6 dark:bg-white/[0.03]">
        {OFFICES.map((office) => {
          const isActive = activeOfficeId === office.id;
          return (
            <button
              key={office.id}
              type="button"
              onClick={() => handlePinInteraction(office.id)}
              className={`group flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-semibold tracking-wide transition-all duration-200 sm:gap-2 sm:px-3 sm:py-1.5 sm:text-xs ${
                isActive
                  ? 'bg-white/90 text-foreground shadow-sm ring-1 ring-black/[0.06] dark:bg-white/10 dark:ring-white/10'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
                {isActive && (
                  <span
                    className="absolute inset-0 animate-ping rounded-full opacity-40"
                    style={{ backgroundColor: office.color }}
                  />
                )}
                <span
                  className="relative inline-flex h-full w-full rounded-full"
                  style={{
                    backgroundColor: office.color,
                    boxShadow: isActive ? `0 0 6px ${office.glowColor}` : 'none',
                  }}
                />
              </span>
              <span className="whitespace-nowrap">
                {office.country}
                <span className="ml-0.5 text-muted-foreground/60 sm:ml-1">({office.label})</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
