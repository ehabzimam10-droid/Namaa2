interface CenterSVGProps {
  level: number;
}

export default function CenterSVG({ level }: CenterSVGProps) {
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
        <linearGradient id="centerGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE875" />
          <stop offset="50%" stopColor="#D9A822" />
          <stop offset="100%" stopColor="#967005" />
        </linearGradient>
        {/* Deep blue brick color */}
        <linearGradient id="wallBlueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2A4D8C" />
          <stop offset="100%" stopColor="#15284F" />
        </linearGradient>
        {/* Purple/Violet roof */}
        <linearGradient id="roofPurpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8A4FFF" />
          <stop offset="100%" stopColor="#4A258C" />
        </linearGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="80" cy="115" rx={15 + level * 9} ry={7 + level * 4} fill="#050B17" opacity="0.75" />

      {/* Main Building Group */}
      <g transform={getTransform()} style={{ transition: 'all 0.5s ease' }}>
        {level === 1 ? (
          // Level 1: Simple campfire tent
          <g>
            <polygon points="50,110 80,125 110,110 80,95" fill="#8C7355" stroke="#523B27" strokeWidth="1.5" />
            <polygon points="80,125 80,95 110,110" fill="#735E45" />
            <circle cx="80" cy="120" r="3" fill="#FF4500" className="animate-pulse" />
          </g>
        ) : (
          // Levels 2 to 5: 2-Story Blue/Gold House with Purple Slanted Roof
          <g>
            {/* 1st Story Walls */}
            {/* Left Wall (isometric face) */}
            <polygon points="35,102.5 80,125 80,95 35,72.5" fill="url(#wallBlueGrad)" />
            {/* Right Wall */}
            <polygon points="80,125 125,102.5 125,72.5 80,95" fill="#0E1B38" />

            {/* 2nd Story Walls (recessed slightly or solid brick) */}
            <polygon points="35,72.5 80,95 80,65 35,42.5" fill="url(#wallBlueGrad)" />
            <polygon points="80,95 125,72.5 125,42.5 80,65" fill="#0E1B38" />

            {/* Gold Corner Pillars and Floor Trim */}
            <line x1="80" y1="125" x2="80" y2="42.5" stroke="url(#centerGold)" strokeWidth="3" />
            <line x1="35" y1="102.5" x2="35" y2="42.5" stroke="url(#centerGold)" strokeWidth="2" />
            <line x1="125" y1="102.5" x2="125" y2="42.5" stroke="url(#centerGold)" strokeWidth="2" />
            
            {/* Floor divider gold line */}
            <line x1="35" y1="72.5" x2="80" y2="95" stroke="url(#centerGold)" strokeWidth="2" />
            <line x1="80" y1="95" x2="125" y2="72.5" stroke="url(#centerGold)" strokeWidth="2" />

            {/* Arched Wood Door (at Center-Bottom) */}
            <path d="M 72,121 C 72,107 88,107 88,121 Z" fill="#5C4027" stroke="url(#centerGold)" strokeWidth="1.5" />
            {/* Door seam */}
            <line x1="80" y1="112" x2="80" y2="125" stroke="#3D2918" strokeWidth="1" />

            {/* Windows (blue glass, glowing for Level >= 4) */}
            {/* Left Windows */}
            <polygon points="45,85 55,90 55,80 45,75" fill={level >= 4 ? '#FFE875' : '#4AA1FF'} opacity="0.9" />
            <polygon points="45,55 55,60 55,50 45,45" fill={level >= 4 ? '#FFE875' : '#4AA1FF'} opacity="0.9" />
            {/* Right Windows */}
            <polygon points="105,85 115,80 115,70 105,75" fill={level >= 4 ? '#FFE875' : '#4AA1FF'} opacity="0.9" />
            <polygon points="105,55 115,50 115,40 105,45" fill={level >= 4 ? '#FFE875' : '#4AA1FF'} opacity="0.9" />

            {/* Golden Shield Emblem with Crown at the center-front wall (2nd Story) */}
            {level >= 3 && (
              <g>
                {/* Shield Base */}
                <polygon points="74,54 86,54 80,62" fill="url(#centerGold)" />
                {/* Tiny crown outline inside/above shield */}
                <path d="M 77,50 L 83,50 L 85,46 L 82,48 L 80,44 L 78,48 L 75,46 Z" fill="url(#centerGold)" />
              </g>
            )}

            {/* Slanted Purple Gable Roof */}
            {/* Left Roof Face */}
            <polygon points="30,42.5 80,67.5 80,60 30,35" fill="none" /> {/* Anchor */}
            <polygon points="30,42.5 80,67.5 80,50 30,25" fill="url(#roofPurpleGrad)" stroke="url(#centerGold)" strokeWidth="1" />
            {/* Right Roof Face */}
            <polygon points="80,67.5 130,42.5 130,25 80,50" fill="#3B1C73" stroke="url(#centerGold)" strokeWidth="1" />

            {/* Level 5 extras: Spire and magic aura lights */}
            {level === 5 && (
              <g>
                {/* Tall Gold Spire at the top */}
                <line x1="80" y1="25" x2="80" y2="5" stroke="url(#centerGold)" strokeWidth="2.5" />
                <polygon points="80,5 92,10 80,15" fill="#C22588" />

                {/* Floating sparkles */}
                <circle cx="50" cy="30" r="1.5" fill="#FFE875" className="animate-ping" />
                <circle cx="110" cy="30" r="1.5" fill="#FFE875" className="animate-ping" />
              </g>
            )}
          </g>
        )}
      </g>
    </svg>
  );
}
