import React from 'react';

interface PipPalLogoProps {
  className?: string;
  size?: number | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textClassName?: string;
}

export const PipPalLogo: React.FC<PipPalLogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
  textClassName = '',
}) => {
  const pixelSize =
    typeof size === 'number'
      ? size
      : size === 'sm'
      ? 28
      : size === 'md'
      ? 36
      : size === 'lg'
      ? 44
      : 56;

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Heart with Uptrend Market SVG */}
      <div
        style={{ width: pixelSize, height: pixelSize }}
        className="relative shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 p-1.5 shadow-md shadow-emerald-500/25 transition-transform duration-200 group-hover:scale-105 group-hover:shadow-emerald-500/35"
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs"
        >
          <defs>
            {/* Heart Gradient */}
            <linearGradient id="heartFillGrad" x1="8" y1="6" x2="40" y2="42" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.06" />
            </linearGradient>

            {/* Uptrend Line Gradient */}
            <linearGradient id="trendLineGrad" x1="12" y1="34" x2="36" y2="12" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#ecfdf5" />
            </linearGradient>

            {/* Candlestick Gradient */}
            <linearGradient id="candleGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#d1fae5" stopOpacity="0.8" />
            </linearGradient>

            {/* Subtle glow underneath trendline */}
            <linearGradient id="trendAreaGrad" x1="24" y1="14" x2="24" y2="36" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Heart Outline & Soft Silhouette */}
          <path
            d="M24 41.5 C22.8 40.5 7 28.5 7 17.5 C7 11 12.2 6.5 18.5 6.5 C21.6 6.5 23.3 7.8 24 8.7 C24.7 7.8 26.4 6.5 29.5 6.5 C35.8 6.5 41 11 41 17.5 C41 28.5 25.2 40.5 24 41.5 Z"
            fill="url(#heartFillGrad)"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Uptrend Area Glow inside heart */}
          <path
            d="M13 32 L19 26 L24 28 L30 19 L35 14 L35 34 C31 37 27 39 24 40.5 C20 38 16 35 13 32 Z"
            fill="url(#trendAreaGrad)"
          />

          {/* Candlestick 1 (Bottom Left - Start of trend) */}
          <line x1="14.5" y1="27" x2="14.5" y2="35" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.8" />
          <rect x="13.2" y="29" width="2.6" height="4.5" rx="0.8" fill="url(#candleGrad)" stroke="#ffffff" strokeWidth="0.6" />

          {/* Candlestick 2 (Middle Left - Pullback / Higher Low) */}
          <line x1="20" y1="21.5" x2="20" y2="30" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.8" />
          <rect x="18.7" y="24" width="2.6" height="4" rx="0.8" fill="url(#candleGrad)" stroke="#ffffff" strokeWidth="0.6" />

          {/* Candlestick 3 (Middle Right - Bullish impulse bar) */}
          <line x1="26" y1="16" x2="26" y2="25" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.8" />
          <rect x="24.7" y="18.5" width="2.6" height="5" rx="0.8" fill="url(#candleGrad)" stroke="#ffffff" strokeWidth="0.6" />

          {/* Candlestick 4 (Top Right - Breakout bar) */}
          <line x1="32" y1="11.5" x2="32" y2="20" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.8" />
          <rect x="30.7" y="13.5" width="2.6" height="5" rx="0.8" fill="url(#candleGrad)" stroke="#ffffff" strokeWidth="0.6" />

          {/* Dynamic Uptrend Chart Line */}
          <path
            d="M12.5 32.5 L18 26 L23.5 28 L31 17.5 L36 12.5"
            stroke="url(#trendLineGrad)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Breakout Arrowhead */}
          <path
            d="M32 12.5 H36 V16.5"
            stroke="#ffffff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Sparkle at the peak of the uptrend */}
          <circle cx="36" cy="12.5" r="1.5" fill="#ffffff" />
        </svg>
      </div>

      {showText && (
        <span
          className={`text-xl font-bold tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors duration-200 ${textClassName}`}
        >
          PipPal
        </span>
      )}
    </div>
  );
};
