interface MarketSVGProps {
  level: number;
}

export default function MarketSVG({ level }: MarketSVGProps) {
  // Determine scale and position shift based on level
  const getTransform = () => {
    switch (level) {
      case 1:
        return 'translate(48, 55) scale(0.4)'; // Tiny
      case 2:
        return 'translate(32, 38) scale(0.6)'; // Medium-tiny
      case 3:
        return 'translate(16, 20) scale(0.8)'; // Medium
      case 4:
        return 'translate(4, 5) scale(0.95)'; // Large
      case 5:
      default:
        return 'translate(-12, -15) scale(1.15)'; // Massive
    }
  };

  return (
    <svg viewBox="0 0 160 160" className="w-full h-full overflow-visible">
      <defs>
        <linearGradient id="marketGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE875" />
          <stop offset="50%" stopColor="#D9A822" />
          <stop offset="100%" stopColor="#967005" />
        </linearGradient>
        {/* Purple/Violet gradient */}
        <linearGradient id="canopyPurple" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9b5de5" />
          <stop offset="100%" stopColor="#5c3b8c" />
        </linearGradient>
        {/* Pink gradient */}
        <linearGradient id="canopyPink" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f15bb5" />
          <stop offset="100%" stopColor="#c22588" />
        </linearGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="80" cy="115" rx={15 + level * 9} ry={7 + level * 4} fill="#050B17" opacity="0.75" />

      {/* Main Market Group */}
      <g transform={getTransform()} style={{ transition: 'all 0.5s ease' }}>
        {/* Wooden Stall Frame */}
        {/* Support columns / posts (thickened wood/gold) */}
        <line x1="45" y1="105" x2="45" y2="72.5" stroke={level >= 4 ? 'url(#marketGold)' : '#8C7355'} strokeWidth="3.5" />
        <line x1="75" y1="120" x2="75" y2="87.5" stroke={level >= 4 ? 'url(#marketGold)' : '#8C7355'} strokeWidth="3.5" />
        <line x1="105" y1="105" x2="105" y2="72.5" stroke={level >= 4 ? 'url(#marketGold)' : '#8C7355'} strokeWidth="3.5" />
        <line x1="75" y1="90" x2="75" y2="57.5" stroke={level >= 4 ? 'url(#marketGold)' : '#6B4D36'} strokeWidth="2.5" />

        {/* Counter Display Table */}
        <polygon points="43,90 75,106 107,90 75,74" fill="#6B4D36" />
        <polygon points="43,90 75,106 75,114 43,98" fill="#523B27" />
        <polygon points="75,106 107,90 107,98 75,114" fill="#3D2B1D" />
        {/* Gold Trim around Counter */}
        {level >= 3 && (
          <polygon points="43,90 75,106 107,90 75,74" fill="none" stroke="url(#marketGold)" strokeWidth="1.5" />
        )}

        {/* Display items on the table (Merchandise) */}
        {level >= 2 && (
          <g>
            {/* Small box */}
            <polygon points="55,88 65,93 72,90 62,85" fill="#FFE875" stroke="#967005" strokeWidth="1" />
            <polygon points="55,88 65,93 65,96 55,91" fill="#D9A822" />
            
            {/* Fruit / coins pile */}
            <circle cx="85" cy="88" r="2.5" fill="#FF8A00" />
            <circle cx="89" cy="87" r="2" fill="#FF8A00" />
            <circle cx="86" cy="85" r="2" fill="#FF8A00" />
          </g>
        )}

        {/* Slanted canopy with Purple & Pink stripes */}
        <g>
          {/* Main Canopy roof polygon */}
          <polygon points="40,72.5 75,90 110,72.5 75,55" fill="none" />

          {/* Stripe 1 (Left): Purple */}
          <polygon points="40,72.5 57.5,81.25 64,68.75 48.75,61.25" fill="url(#canopyPurple)" />

          {/* Stripe 2: Pink */}
          <polygon points="57.5,81.25 75,90 75,77.5 64,68.75" fill="url(#canopyPink)" />

          {/* Stripe 3: Purple */}
          <polygon points="75,90 92.5,81.25 86,68.75 75,77.5" fill="url(#canopyPurple)" />

          {/* Stripe 4 (Right): Pink */}
          <polygon points="92.5,81.25 110,72.5 98.75,61.25 86,68.75" fill="url(#canopyPink)" />

          {/* Overhanging front trim (flaps) */}
          <polygon points="40,72.5 57.5,81.25 57.5,86.25 40,77.5" fill="#5c3b8c" />
          <polygon points="57.5,81.25 75,90 75,95 57.5,86.25" fill="#c22588" />
          <polygon points="75,90 92.5,81.25 92.5,86.25 75,95" fill="#5c3b8c" />
          <polygon points="92.5,81.25 110,72.5 110,77.5 92.5,86.25" fill="#c22588" />
        </g>

        {/* Level 5 features: Gold Columns, Glowing Lantern, and flags */}
        {level === 5 && (
          <g>
            {/* Crown shield emblem at the front of canopy */}
            <polygon points="71,83 79,83 75,87" fill="url(#marketGold)" />
            
            {/* Hanging lantern on right post */}
            <line x1="105" y1="78" x2="112" y2="78" stroke="url(#marketGold)" strokeWidth="1.5" />
            <circle cx="112" cy="85" r="4.5" fill="#FFE875" opacity="0.9" className="animate-pulse" />
            <circle cx="112" cy="85" r="2.5" fill="#FF8A00" />
            
            {/* Floating sparkles */}
            <circle cx="48" cy="55" r="1.5" fill="#FFE875" className="animate-ping" />
            <circle cx="102" cy="50" r="1.5" fill="#FFE875" className="animate-ping" />
          </g>
        )}
      </g>
    </svg>
  );
}
