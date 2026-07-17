interface BankSVGProps {
  level: number;
}

export default function BankSVG({ level }: BankSVGProps) {
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
        {/* Gold gradients */}
        <linearGradient id="bankGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE875" />
          <stop offset="50%" stopColor="#D9A822" />
          <stop offset="100%" stopColor="#967005" />
        </linearGradient>
        <linearGradient id="vaultBlue" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#253F6B" />
          <stop offset="100%" stopColor="#12213D" />
        </linearGradient>
      </defs>

      {/* Ground shadow - dynamic scale */}
      <ellipse cx="80" cy="115" rx={15 + level * 9} ry={7 + level * 4} fill="#050B17" opacity="0.75" />

      {/* Main Vault Group */}
      <g transform={getTransform()} style={{ transition: 'all 0.5s ease' }}>
        {/* Outer Safe Box Structure */}
        {/* Left wall: deep indigo-blue */}
        <polygon points="35,72.5 80,95 80,135 35,112.5" fill="#172A4B" />
        {/* Right wall: darker deep blue */}
        <polygon points="80,95 125,72.5 125,112.5 80,135" fill="#0D1A30" />
        {/* Top wall: medium blue */}
        <polygon points="80,95 125,72.5 80,50 35,72.5" fill="#203864" />

        {/* Thick Gold Borders (along all visible edges) */}
        {/* Vertical front border */}
        <line x1="80" y1="95" x2="80" y2="135" stroke="url(#bankGold)" strokeWidth="4.5" strokeLinecap="round" />
        {/* Left vertical border */}
        <line x1="35" y1="72.5" x2="35" y2="112.5" stroke="url(#bankGold)" strokeWidth="3" />
        {/* Right vertical border */}
        <line x1="125" y1="72.5" x2="125" y2="112.5" stroke="url(#bankGold)" strokeWidth="3" />

        {/* Bottom borders */}
        <line x1="35" y1="112.5" x2="80" y2="135" stroke="url(#bankGold)" strokeWidth="4.5" />
        <line x1="80" y1="135" x2="125" y2="112.5" stroke="url(#bankGold)" strokeWidth="4.5" />

        {/* Top face borders */}
        <polygon points="80,95 125,72.5 80,50 35,72.5" fill="none" stroke="url(#bankGold)" strokeWidth="4.5" strokeLinejoin="round" />

        {/* Level-based details */}
        {level >= 2 && (
          <g>
            {/* Safe dial / vault lock on Left Face */}
            <ellipse cx="57" cy="92.5" rx="10" ry="6" fill="#0D1A30" stroke="url(#bankGold)" strokeWidth="1.5" />
            <circle cx="57" cy="92.5" r="3" fill="url(#bankGold)" />
            {/* Dial notches */}
            <line x1="57" y1="88" x2="57" y2="89.5" stroke="url(#bankGold)" strokeWidth="1" />
            <line x1="57" y1="95.5" x2="57" y2="97" stroke="url(#bankGold)" strokeWidth="1" />
          </g>
        )}

        {level >= 3 && (
          <g>
            {/* Spinning/Glow dial lock on Right Face */}
            <ellipse cx="102" cy="92.5" rx="10" ry="6" fill="#172A4B" stroke="url(#bankGold)" strokeWidth="1.5" />
            {/* Vault handle cogs */}
            <path
              d="M 102 88 L 102 97 M 97 92.5 L 107 92.5"
              stroke="url(#bankGold)"
              strokeWidth="2"
              className={level >= 4 ? "animate-spin" : ""}
              style={{ transformOrigin: '102px 92.5px', animationDuration: '8s' }}
            />
            <circle cx="102" cy="92.5" r="4.5" fill="url(#bankGold)" />
          </g>
        )}

        {level >= 4 && (
          <g>
            {/* Security Corner Rivets */}
            <circle cx="39" cy="76" r="1.5" fill="url(#bankGold)" />
            <circle cx="39" cy="108" r="1.5" fill="url(#bankGold)" />
            <circle cx="121" cy="76" r="1.5" fill="url(#bankGold)" />
            <circle cx="121" cy="108" r="1.5" fill="url(#bankGold)" />
            
            {/* Digital lights on Top face */}
            <ellipse cx="80" cy="72.5" rx="5" ry="2.5" fill="#10B981" opacity="0.8" className="animate-pulse" />
          </g>
        )}

        {level === 5 && (
          <g>
            {/* Massive Level 5 Accents: Glowing neon details and top golden coin */}
            {/* Floating golden coin in bounce motion */}
            <g className="animate-bounce" style={{ transformOrigin: '80px 25px' }}>
              <ellipse cx="80" cy="28" rx="10" ry="5" fill="#000" opacity="0.35" />
              
              <circle cx="80" cy="15" r="10" fill="#FFE875" stroke="#967005" strokeWidth="1.5" />
              <circle cx="80" cy="15" r="8" fill="#D9A822" />
              {/* Geometric crown/star inside coin */}
              <polygon points="80,10 82,14 86,15 82,16 80,20 78,16 74,15 78,14" fill="#FFE875" />
            </g>
            
            {/* Golden shield plate at front corner */}
            <polygon points="73,98.5 87,98.5 80,105" fill="url(#bankGold)" />
            
            {/* Magic sparkles */}
            <circle cx="50" cy="55" r="1.5" fill="#FFE875" className="animate-ping" />
            <circle cx="110" cy="55" r="1.5" fill="#FFE875" className="animate-ping" />
          </g>
        )}
      </g>
    </svg>
  );
}
