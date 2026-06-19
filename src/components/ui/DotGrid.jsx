import React from 'react';

/**
 * Simple DotGrid background component.
 * Renders an absolute‑positioned SVG that fills its parent and displays
 * a repeating dot pattern. The component accepts an optional `id`
 * prop which is forwarded to the root SVG element for styling or
 * targeting by tests.
 */
export default function DotGrid({ id }) {
  return (
    <svg
      id={id}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="dotPattern"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1" cy="1" r="1" fill="currentColor" className="text-muted-foreground/20" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dotPattern)" />
    </svg>
  );
}
