import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WORLD_PATHS } from './worldPaths';
import { OFFICE_LOCATIONS } from '../../data/officeLocations';

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

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getTooltipMetrics(office, isMobile) {
  const label = (office.mapType || office.type).toUpperCase();
  const widthEstimate = Math.max(
    label.length * (isMobile ? 3.4 : 4.2),
    office.title.length * (isMobile ? 4.4 : 5.1),
    office.country.length * (isMobile ? 4.0 : 4.8)
  );

  return {
    width: clamp(widthEstimate + (isMobile ? 20 : 24), isMobile ? 92 : 106, isMobile ? 156 : 182),
    height: isMobile ? 30 : 36,
    labelFont: isMobile ? 4.8 : 5.8,
    titleFont: isMobile ? 7.4 : 8.9,
    countryFont: isMobile ? 5.6 : 6.8,
  };
}

function getCountryPathKey(country, index) {
  return country.id ? `${country.id}-${index}` : `path-${index}`;
}

export default function WorldMap({ activeOfficeId, onOfficeChange }) {
  const [hovered, setHovered] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const hubOffice = OFFICE_LOCATIONS[0];
  const branchOffices = OFFICE_LOCATIONS.slice(1);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handlePinInteraction = useCallback(
    (id) => {
      onOfficeChange(id);
    },
    [onOfficeChange]
  );

  const PIN_R_ACTIVE = isMobile ? 6 : 8;
  const PIN_R_IDLE = isMobile ? 4.5 : 6;
  const PIN_STROKE = isMobile ? 2 : 2.5;

  return (
    <div className="relative w-full select-none overflow-hidden rounded-2xl border border-[#D0D5E8]/70 bg-gradient-to-br from-[#F0F2FA] via-[#E9EDF8] to-[#F5F3FF] shadow-[0_16px_48px_rgba(20,14,45,0.09)] sm:rounded-[24px] dark:border-white/10 dark:from-[#0D0B1E] dark:via-[#110E24] dark:to-[#0F0B20]">
      <svg
        viewBox={`${VIEW_X} ${VIEW_Y} ${VIEW_W} ${VIEW_H}`}
        className="w-full"
        preserveAspectRatio="xMidYMid slice"
        aria-label="World map showing The Global Avenues office locations"
        role="img"
        style={{ display: 'block' }}
      >
        <defs>
          <pattern id="landDots" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle
              cx="1.2"
              cy="1.2"
              r="1"
              className="fill-[rgba(45,27,105,0.25)] dark:fill-[rgba(91,69,198,0.20)]"
            />
          </pattern>

          {OFFICE_LOCATIONS.map((office) => (
            <filter
              key={`glow-${office.id}`}
              id={`pinGlow-${office.id}`}
              x="-150%"
              y="-150%"
              width="400%"
              height="400%"
            >
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
            </filter>
          ))}

          <filter id="tooltipShadow" x="-25%" y="-30%" width="150%" height="180%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(20,14,45,0.16)" />
          </filter>

          <filter id="pinShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="rgba(20,14,45,0.25)" />
          </filter>
        </defs>

        <rect x={VIEW_X} y={VIEW_Y} width={VIEW_W} height={VIEW_H} fill="transparent" />

        <g>
          {WORLD_PATHS.map((country, index) => (
            <path
              key={`base-${getCountryPathKey(country, index)}`}
              d={country.d}
              className="fill-[rgba(180,195,230,0.30)] dark:fill-[rgba(35,50,85,0.35)]"
            />
          ))}
        </g>

        <g>
          {WORLD_PATHS.map((country, index) => (
            <path
              key={`dot-${getCountryPathKey(country, index)}`}
              d={country.d}
              fill="url(#landDots)"
              stroke="none"
            />
          ))}
        </g>

        <g>
          {WORLD_PATHS.map((country, index) => (
            <path
              key={`stroke-${getCountryPathKey(country, index)}`}
              d={country.d}
              className="stroke-[rgba(255,255,255,0.45)] dark:stroke-[rgba(255,255,255,0.07)]"
              fill="none"
              strokeWidth="0.5"
            />
          ))}
        </g>

        <g>
          {branchOffices.map((office) => {
            const hubCoords = toSvg(hubOffice.lat, hubOffice.lon);
            const officeCoords = toSvg(office.lat, office.lon);

            return (
              <line
                key={`line-${hubOffice.id}-${office.id}`}
                x1={hubCoords.cx}
                y1={hubCoords.cy}
                x2={officeCoords.cx}
                y2={officeCoords.cy}
                className="stroke-[rgba(45,27,105,0.10)] dark:stroke-[rgba(91,69,198,0.12)]"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            );
          })}
        </g>

        {OFFICE_LOCATIONS.map((office) => {
          const isActive = activeOfficeId === office.id;
          const isHovered = hovered === office.id;
          const show = isActive || isHovered;
          const { cx, cy } = toSvg(office.lat, office.lon);
          const tooltipMetrics = getTooltipMetrics(office, isMobile);
          const TT_W = tooltipMetrics.width;
          const TT_H = tooltipMetrics.height;
          const ox = office.offset?.x || 0;
          const oy = office.offset?.y || 0;
          const prefersLeft = ox < -10;
          const prefersRight = ox > 10;
          const tooltipX = clamp(
            prefersLeft
              ? cx - TT_W + ox
              : prefersRight
                ? cx + ox
                : cx - TT_W / 2 + ox,
            VIEW_X + 8,
            VIEW_X + VIEW_W - TT_W - 8
          );
          const tooltipY = clamp(cy + oy, VIEW_Y + 8, VIEW_Y + VIEW_H - TT_H - 8);
          const connectorX = prefersLeft
            ? tooltipX + TT_W - 12
            : prefersRight
              ? tooltipX + 12
              : tooltipX + TT_W / 2;
          const contentX = tooltipX + 12;
          const connectorEndY = tooltipY + TT_H - 2;

          return (
            <g
              key={office.id}
              style={{ cursor: 'pointer' }}
              className="outline-none"
              onClick={() => handlePinInteraction(office.id)}
              onMouseEnter={() => {
                setHovered(office.id);
                onOfficeChange(office.id);
              }}
              onMouseLeave={() => setHovered(null)}
              onTouchStart={() => handlePinInteraction(office.id)}
              aria-label={`${office.country} office — ${office.title}`}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  handlePinInteraction(office.id);
                }
              }}
            >
              <circle cx={cx} cy={cy} r="20" fill="transparent" />

              <circle
                cx={cx}
                cy={cy}
                r="24"
                fill={office.mapColor}
                opacity={isActive ? 0.14 : 0.05}
                filter={`url(#pinGlow-${office.id})`}
                style={{ transition: 'opacity 300ms ease' }}
              />

              <AnimatePresence>
                {isActive && (
                  <motion.circle
                    cx={cx}
                    cy={cy}
                    r={PIN_R_ACTIVE + 4}
                    fill="none"
                    stroke={office.mapColor}
                    strokeWidth="1.5"
                    initial={{ scale: 1, opacity: 0.6 }}
                    animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeOut' }}
                    style={{ transformOrigin: `${cx}px ${cy}px` }}
                  />
                )}
              </AnimatePresence>

              <circle
                cx={cx}
                cy={cy}
                r={isActive ? PIN_R_ACTIVE + 5 : PIN_R_IDLE + 4}
                fill={office.mapColor}
                opacity={isActive ? 0.15 : 0.08}
                style={{ transition: 'all 300ms ease' }}
              />

              <circle
                cx={cx}
                cy={cy}
                r={isActive ? PIN_R_ACTIVE : PIN_R_IDLE}
                fill={office.mapColor}
                stroke="white"
                strokeWidth={PIN_STROKE}
                filter="url(#pinShadow)"
                style={{ transition: 'all 250ms ease' }}
              />

              <circle
                cx={cx}
                cy={cy}
                r={isActive ? 2.5 : 1.8}
                fill="white"
                opacity="0.9"
                style={{ transition: 'all 250ms ease' }}
              />

              <AnimatePresence>
                {show && (
                  <motion.g
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 3 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                  >
                    <line
                      x1={cx}
                      y1={cy - (isActive ? PIN_R_ACTIVE : PIN_R_IDLE) - PIN_STROKE}
                      x2={connectorX}
                      y2={connectorEndY}
                      stroke={office.mapColor}
                      strokeWidth="1"
                      strokeDasharray="2.5 2.5"
                      opacity="0.45"
                    />

                    <rect
                      x={tooltipX}
                      y={tooltipY}
                      width={TT_W}
                      height={TT_H}
                      rx="7"
                      fill="white"
                      className="dark:fill-[#1A1533]"
                      stroke={office.mapColor}
                      strokeWidth="0.9"
                      opacity="0.97"
                      filter="url(#tooltipShadow)"
                    />

                    <rect
                      x={tooltipX}
                      y={tooltipY + 3}
                      width="2"
                      height={TT_H - 6}
                      rx="1"
                      fill={office.mapColor}
                    />

                    <text
                      x={contentX + 4}
                      y={tooltipY + (isMobile ? 8.8 : 10)}
                      textAnchor="start"
                      fontSize={tooltipMetrics.labelFont}
                      fontWeight="700"
                      fill={office.mapColor}
                      fontFamily="Inter, system-ui, sans-serif"
                      letterSpacing="0.08em"
                    >
                      {(office.mapType || office.type).toUpperCase()}
                    </text>

                    <text
                      x={contentX}
                      y={tooltipY + (isMobile ? 19 : 22)}
                      textAnchor="start"
                      fontSize={tooltipMetrics.titleFont}
                      fontWeight="700"
                      className="fill-[#1A1033] dark:fill-white"
                      fontFamily="Inter, system-ui, sans-serif"
                    >
                      {office.title}
                    </text>

                    <text
                      x={contentX}
                      y={tooltipY + (isMobile ? 26.5 : 31)}
                      textAnchor="start"
                      fontSize={tooltipMetrics.countryFont}
                      fontWeight="600"
                      fill="#6F63A8"
                      fontFamily="Inter, system-ui, sans-serif"
                    >
                      {office.country}
                    </text>
                  </motion.g>
                )}
              </AnimatePresence>
            </g>
          );
        })}
      </svg>

      <div className="grid grid-cols-1 gap-2 border-t border-[#D0D5E8]/50 bg-white/45 px-3 py-3 backdrop-blur-md min-[460px]:grid-cols-2 sm:gap-3 sm:px-5 lg:grid-cols-4 lg:px-6 lg:py-3 dark:border-white/6 dark:bg-white/[0.03]">
        {OFFICE_LOCATIONS.map((office) => {
          const isActive = activeOfficeId === office.id;

          return (
            <button
              key={office.id}
              type="button"
              onClick={() => handlePinInteraction(office.id)}
              className={`group flex min-w-0 items-start gap-2 rounded-2xl px-3 py-2 text-left transition-all duration-200 sm:px-3.5 sm:py-2.5 ${
                isActive
                  ? 'bg-white/90 text-foreground shadow-sm ring-1 ring-black/[0.06] dark:bg-[linear-gradient(135deg,rgba(91,69,198,0.28)_0%,rgba(232,82,26,0.16)_100%)] dark:ring-brand-orange-light/35'
                  : 'text-muted-foreground hover:bg-white/55 hover:text-foreground dark:hover:bg-white/[0.06]'
              }`}
            >
              <span className="relative mt-1 flex h-2.5 w-2.5 flex-shrink-0">
                {isActive && (
                  <span
                    className="absolute inset-0 animate-ping rounded-full opacity-40"
                    style={{ backgroundColor: office.mapColor }}
                  />
                )}
                <span
                  className="relative inline-flex h-full w-full rounded-full"
                  style={{
                    backgroundColor: office.mapColor,
                    boxShadow: isActive ? `0 0 6px ${office.glowColor}` : 'none',
                  }}
                />
              </span>
              <span className="min-w-0">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-foreground/85 sm:text-[11px]">
                  {office.country}
                </span>
                <span className="mt-0.5 block text-[11px] leading-tight text-muted-foreground sm:text-xs">
                  {office.title}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
