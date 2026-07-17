interface FarmSVGProps {
  level: number;
}

export default function FarmSVG({ level }: FarmSVGProps) {
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
        <linearGradient id="farmGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE875" />
          <stop offset="50%" stopColor="#D9A822" />
          <stop offset="100%" stopColor="#967005" />
        </linearGradient>
        <linearGradient id="grassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#05B344" />
          <stop offset="100%" stopColor="#006322" />
        </linearGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="80" cy="115" rx={15 + level * 9} ry={7 + level * 4} fill="#050B17" opacity="0.75" />

      {/* Main Farm Group */}
      <g transform={getTransform()} style={{ transition: 'all 0.5s ease' }}>
        {level === 1 ? (
          // Level 1: A single tiny brown soil plot
          <g>
            <polygon points="50,95 80,110 110,95 80,80" fill="#78593E" stroke="#523B27" strokeWidth="2" />
            <line x1="60" y1="92" x2="100" y2="92" stroke="#523B27" strokeWidth="1.5" />
          </g>
        ) : (
          // Levels 2 to 5: Two rectangular agricultural plots placed side by side
          <g>
            {/* Plot 1 (Left side) */}
            {/* Base grass/soil */}
            <polygon points="35,92.5 68,109 68,99 35,82.5" fill="#203E26" />
            <polygon points="68,109 78,104 78,94 68,99" fill="#142819" />
            <polygon points="68,99 78,94 45,77.5 35,82.5" fill={level >= 3 ? 'url(#grassGrad)' : '#3E5C3B'} />

            {/* Plot 2 (Right side) */}
            <polygon points="82,94 92,99 92,89 82,84" fill="#203E26" />
            <polygon points="92,99 125,82.5 125,72.5 92,89" fill="#142819" />
            <polygon points="92,89 125,72.5 115,67.5 82,84" fill={level >= 3 ? 'url(#grassGrad)' : '#3E5C3B'} />

            {/* Gilded Gold Borders (Level >= 3 gets shiny borders) */}
            {level >= 3 && (
              <g>
                {/* Border 1 */}
                <polygon points="68,99 78,94 45,77.5 35,82.5" fill="none" stroke="url(#farmGold)" strokeWidth="2.5" strokeLinejoin="round" />
                {/* Border 2 */}
                <polygon points="92,89 125,72.5 115,67.5 82,84" fill="none" stroke="url(#farmGold)" strokeWidth="2.5" strokeLinejoin="round" />
              </g>
            )}

            {/* Crop Rows (Wheat/Plants) */}
            {/* Plot 1 Crops */}
            <g stroke={level >= 5 ? '#FFE875' : '#05B344'} strokeWidth="2" strokeLinecap="round">
              <line x1="43" y1="84.5" x2="60" y2="93" />
              <line x1="50" y1="88" x2="67" y2="96.5" />
              {level >= 4 && <line x1="57" y1="91.5" x2="74" y2="100" />}
            </g>

            {/* Plot 2 Crops */}
            <g stroke={level >= 5 ? '#FFE875' : '#05B344'} strokeWidth="2" strokeLinecap="round">
              <line x1="90" y1="76" x2="107" y2="84.5" />
              <line x1="97" y1="79.5" x2="114" y2="88" />
              {level >= 4 && <line x1="104" y1="83" x2="121" y2="91.5" />}
            </g>

            {/* Level 5 extra glowing features */}
            {level === 5 && (
              <g>
                {/* Sparkling magical floaters */}
                <circle cx="55" cy="70" r="1.5" fill="#FFE875" className="animate-ping" />
                <circle cx="105" cy="60" r="1.5" fill="#FFE875" className="animate-ping" />
                
                {/* Gold floral decorations */}
                <circle cx="52" cy="88" r="2.5" fill="#FFE875" />
                <circle cx="106" cy="79" r="2.5" fill="#FFE875" />
              </g>
            )}
          </g>
        )}
      </g>
    </svg>
  );
}
