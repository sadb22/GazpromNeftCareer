import React from 'react';

const BLUE = '#0067B1';

/**
 * Gazprom Neft logo — accurate G-symbol (SVG) + HTML text.
 * HTML text avoids Cyrillic rendering bugs in SVG.
 *
 * G symbol geometry (viewBox 0 0 56 56):
 *   center (28, 32), outer r=24, inner r=15.5
 *   gap from 23° to 107° (84° opening, upper-right area)
 */
export default function GazpromNeftLogo({ iconSize = 38 }) {
  const fontSize    = Math.round(iconSize * 0.34);
  const subFontSize = Math.round(iconSize * 0.25);
  const subPadV     = Math.round(iconSize * 0.055);
  const subPadH     = Math.round(iconSize * 0.09);
  const gap         = Math.round(iconSize * 0.24);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap }}>

      {/* ── G symbol ─────────────────────────────────── */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        {/*
         * Ring arc
         *   Outer gap-top  @23°: (28+24·sin23, 32−24·cos23) = (37.4, 9.9)
         *   Outer gap-bot @107°: (28+24·sin107,32−24·cos107) = (50.9, 39.0)
         *   Inner gap-top  @23°: (28+15.5·sin23,32−15.5·cos23) = (34.1, 17.7)
         *   Inner gap-bot @107°: (28+15.5·sin107,32−15.5·cos107) = (42.8, 36.5)
         *
         *  CW large-arc outer → L inner → CCW large-arc inner → Z
         */}
        <path
          d="M37.4,9.9 A24,24 0 1,1 50.9,39 L42.8,36.5 A15.5,15.5 0 1,0 34.1,17.7 Z"
          fill={BLUE}
        />

        {/* G-bar: shelf from inner-right toward center */}
        <path d="M28,36.5 H42.8 V45 H28 Z" fill={BLUE} />

        {/*
         * Flame — two leaf teardrops at upper gap, pointing up.
         * Outer leaf (blue), inner leaf (white) for the "double flame" look.
         * Positioned around x=40, from y=0 (tip) to y=12 (base overlapping arc).
         */}
        <path
          d="M40,12 C35,5.5 35.5,0.5 40,0 C44.5,0.5 45,5.5 40,12 Z"
          fill={BLUE}
        />
        <path
          d="M40,10 C37.5,5 38,2 40,1.5 C42,2 42.5,5 40,10 Z"
          fill="white"
        />
      </svg>

      {/* ── Text block ───────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, lineHeight: 1 }}>
        <div style={{
          fontFamily : 'Arial, Helvetica, sans-serif',
          fontWeight : 900,
          fontSize,
          color      : BLUE,
          letterSpacing: '0.5px',
        }}>
          ГАЗПРОМ
        </div>
        <div style={{
          backgroundColor : BLUE,
          borderRadius    : 2,
          padding         : `${subPadV}px ${subPadH}px`,
          fontFamily      : 'Arial, Helvetica, sans-serif',
          fontWeight      : 900,
          fontSize        : subFontSize,
          color           : 'white',
          letterSpacing   : '3.5px',
        }}>
          НЕФТЬ
        </div>
      </div>

    </div>
  );
}
