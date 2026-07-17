export interface CastleVisualProps {
  level: number; // 1 to 5
  parts: {
    savings: 'thriving' | 'average' | 'damaged';
    spending: 'thriving' | 'average' | 'damaged';
    donation: 'thriving' | 'average' | 'damaged';
    investment: 'thriving' | 'average' | 'damaged';
    tasks: 'thriving' | 'average' | 'damaged';
  };
}

export default function CastleVisual({ level, parts }: CastleVisualProps) {
  const { savings, spending, donation, investment, tasks } = parts;

  // Sky background gradient based on level
  const getSkyGradient = () => {
    switch (level) {
      case 1:
        return 'from-[#0B1527] to-[#162544]'; // Dark night
      case 2:
        return 'from-[#0F1E36] to-[#24355A]'; // Dawn
      case 3:
        return 'from-[#11223F] to-[#2D3E6B]'; // Daylight
      case 4:
        return 'from-[#182B4F] to-[#453A68]'; // Sunset glow
      case 5:
      default:
        return 'from-[#1A2E40] to-[#E57A44]/35'; // Golden Hour / Magical Sunset
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative bg-slate-950">
      {/* Level Banner */}
      <div className="absolute top-4 right-4 z-10 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5 font-sans">
        <span className="text-[10px] text-slate-350">مستوى القرية:</span>
        <span className="text-xs font-black text-orange-400">{level} / 5</span>
      </div>

      <svg
        viewBox="0 0 600 400"
        className={`w-full h-auto bg-gradient-to-b ${getSkyGradient()} transition-all duration-1000`}
      >
        {/* Sky Elements - Stars or Sun depending on level */}
        {level <= 2 && (
          <>
            <circle cx="80" cy="70" r="1.5" fill="#fff" opacity="0.8" />
            <circle cx="180" cy="50" r="1" fill="#fff" opacity="0.6" />
            <circle cx="280" cy="90" r="2" fill="#fff" opacity="0.9" />
            <circle cx="380" cy="60" r="1" fill="#fff" opacity="0.5" />
            <circle cx="480" cy="80" r="1.5" fill="#fff" opacity="0.7" />
          </>
        )}
        {level >= 3 && (
          <circle cx="100" cy="90" r="25" fill="#E57A44" opacity="0.25" filter="blur(4px)" />
        )}
        {level >= 3 && (
          <circle cx="100" cy="90" r="20" fill="#FAD1A7" opacity="0.8" />
        )}

        {/* Clouds */}
        <path d="M 50 140 Q 70 120 90 140 Q 110 120 130 140 L 130 150 L 50 150 Z" fill="#ffffff" opacity="0.15" />
        <path d="M 400 100 Q 415 85 430 100 Q 445 85 460 100 L 460 110 L 400 110 Z" fill="#ffffff" opacity="0.1" />

        {/* GROUND (Hill sides) */}
        <path d="M -50 330 Q 150 280 350 330 T 650 340 L 650 400 L -50 400 Z" fill="#14213B" />
        <path d="M 150 360 Q 350 320 650 360 L 650 400 L 150 400 Z" fill="#0C1527" />

        {/* -------------------- 5 PILLARS -------------------- */}

        {/* PILLAR 1: SPENDING (Walls) */}
        {spending === 'thriving' && (
          <g>
            {/* Left Wall Solid */}
            <rect x="150" y="220" width="80" height="90" fill="#24355A" rx="4" />
            <rect x="145" y="210" width="90" height="15" fill="#E57A44" rx="2" />
            {/* Battlements */}
            <rect x="150" y="195" width="15" height="15" fill="#E57A44" />
            <rect x="175" y="195" width="15" height="15" fill="#E57A44" />
            <rect x="200" y="195" width="15" height="15" fill="#E57A44" />
            <rect x="225" y="195" width="15" height="15" fill="#E57A44" />
            {/* Banner */}
            <path d="M 180 230 L 200 230 L 200 270 L 190 260 L 180 270 Z" fill="#009639" />
            
            {/* Right Wall Solid */}
            <rect x="370" y="220" width="80" height="90" fill="#24355A" rx="4" />
            <rect x="365" y="210" width="90" height="15" fill="#E57A44" rx="2" />
            {/* Battlements */}
            <rect x="370" y="195" width="15" height="15" fill="#E57A44" />
            <rect x="395" y="195" width="15" height="15" fill="#E57A44" />
            <rect x="420" y="195" width="15" height="15" fill="#E57A44" />
            <rect x="445" y="195" width="15" height="15" fill="#E57A44" />
          </g>
        )}

        {spending === 'average' && (
          <g>
            {/* Left Wall Normal */}
            <rect x="155" y="235" width="75" height="75" fill="#2C3D5E" rx="3" />
            <rect x="150" y="225" width="85" height="10" fill="#7588A6" rx="2" />
            <rect x="155" y="215" width="12" height="10" fill="#7588A6" />
            <rect x="175" y="215" width="12" height="10" fill="#7588A6" />
            <rect x="195" y="215" width="12" height="10" fill="#7588A6" />
            <rect x="215" y="215" width="12" height="10" fill="#7588A6" />

            {/* Right Wall Normal */}
            <rect x="370" y="235" width="75" height="75" fill="#2C3D5E" rx="3" />
            <rect x="365" y="225" width="85" height="10" fill="#7588A6" rx="2" />
            <rect x="370" y="215" width="12" height="10" fill="#7588A6" />
            <rect x="390" y="215" width="12" height="10" fill="#7588A6" />
            <rect x="410" y="215" width="12" height="10" fill="#7588A6" />
            <rect x="430" y="215" width="12" height="10" fill="#7588A6" />
          </g>
        )}

        {spending === 'damaged' && (
          <g>
            {/* Left Wall Cracked/Broken */}
            <path d="M 160 310 L 160 250 L 180 250 L 185 270 L 195 270 L 200 260 L 210 260 L 215 310 Z" fill="#1C2638" />
            <line x1="170" y1="260" x2="175" y2="290" stroke="#000" strokeWidth="2" strokeDasharray="3" />
            <line x1="205" y1="270" x2="202" y2="295" stroke="#000" strokeWidth="1.5" />

            {/* Right Wall Cracked/Broken */}
            <path d="M 370 310 L 370 270 L 385 270 L 390 255 L 405 255 L 410 280 L 430 280 L 435 310 Z" fill="#1C2638" />
            <line x1="380" y1="280" x2="382" y2="305" stroke="#000" strokeWidth="2" strokeDasharray="2" />
            <line x1="420" y1="290" x2="425" y2="310" stroke="#000" strokeWidth="1.5" />
          </g>
        )}


        {/* PILLAR 2: WINDMILL (Tasks) - Rendered behind on top-right */}
        <g>
          {/* Windmill Body */}
          <path d="M 470 290 L 480 180 L 510 180 L 520 290 Z" fill="#3D291F" />
          <path d="M 475 180 L 495 140 L 515 180 Z" fill="#E57A44" />

          {/* Windmill Sails */}
          {tasks === 'thriving' && (
            <g className="animate-spin" style={{ transformOrigin: '495px 180px', animationDuration: '6s' }}>
              <line x1="495" y1="180" x2="495" y2="120" stroke="#D3C2B0" strokeWidth="4" />
              <line x1="495" y1="180" x2="495" y2="240" stroke="#D3C2B0" strokeWidth="4" />
              <line x1="495" y1="180" x2="435" y2="180" stroke="#D3C2B0" strokeWidth="4" />
              <line x1="495" y1="180" x2="555" y2="180" stroke="#D3C2B0" strokeWidth="4" />
              {/* Sail cloths */}
              <rect x="498" y="125" width="12" height="40" fill="#fff" opacity="0.9" rx="1" />
              <rect x="485" y="215" width="12" height="40" fill="#fff" opacity="0.9" rx="1" />
              <rect x="440" y="166" width="40" height="12" fill="#fff" opacity="0.9" rx="1" />
              <rect x="515" y="182" width="40" height="12" fill="#fff" opacity="0.9" rx="1" />
            </g>
          )}

          {tasks === 'average' && (
            <g>
              <line x1="495" y1="180" x2="495" y2="130" stroke="#B3A290" strokeWidth="3" />
              <line x1="495" y1="180" x2="495" y2="230" stroke="#B3A290" strokeWidth="3" />
              <line x1="495" y1="180" x2="445" y2="180" stroke="#B3A290" strokeWidth="3" />
              <line x1="495" y1="180" x2="545" y2="180" stroke="#B3A290" strokeWidth="3" />
              {/* Sail cloths */}
              <rect x="497" y="135" width="8" height="30" fill="#E8E2D9" rx="1" />
              <rect x="490" y="215" width="8" height="30" fill="#E8E2D9" rx="1" />
            </g>
          )}

          {tasks === 'damaged' && (
            <g>
              {/* Crooked, broken sails */}
              <line x1="495" y1="180" x2="475" y2="145" stroke="#7A5B4C" strokeWidth="2.5" />
              <line x1="495" y1="180" x2="510" y2="225" stroke="#7A5B4C" strokeWidth="2.5" />
              {/* Hanging cloth */}
              <path d="M 475 145 Q 470 165 480 170 Z" fill="#8C7355" opacity="0.5" />
            </g>
          )}
        </g>


        {/* PILLAR 3: SAVINGS (Central Tower) - Prominent center */}
        {savings === 'thriving' && (
          <g>
            {/* Base */}
            <rect x="250" y="150" width="100" height="180" fill="url(#goldGrad)" rx="6" />
            
            {/* Accents / Pillars */}
            <rect x="245" y="140" width="110" height="15" fill="#E57A44" rx="3" />
            <rect x="260" y="155" width="8" height="175" fill="#9C5230" />
            <rect x="332" y="155" width="8" height="175" fill="#9C5230" />
            
            {/* Battlements */}
            <rect x="250" y="125" width="16" height="15" fill="#E57A44" />
            <rect x="278" y="125" width="16" height="15" fill="#E57A44" />
            <rect x="306" y="125" width="16" height="15" fill="#E57A44" />
            <rect x="334" y="125" width="16" height="15" fill="#E57A44" />

            {/* Arched Window */}
            <path d="M 285 200 A 15 15 0 0 1 315 200 L 315 230 L 285 230 Z" fill="#111C2E" />
            <line x1="300" y1="185" x2="300" y2="230" stroke="#E57A44" strokeWidth="1.5" />
            
            {/* Flagpole and Waving Flag */}
            <line x1="300" y1="125" x2="300" y2="80" stroke="#fff" strokeWidth="2.5" />
            <path d="M 300 80 Q 320 70 340 80 Q 320 90 300 100 Z" fill="#009639" />
          </g>
        )}

        {savings === 'average' && (
          <g>
            {/* Base */}
            <rect x="255" y="170" width="90" height="160" fill="#4B5E7D" rx="4" />
            
            {/* Accents */}
            <rect x="250" y="160" width="100" height="12" fill="#7588A6" rx="2" />
            
            {/* Battlements */}
            <rect x="255" y="148" width="14" height="12" fill="#7588A6" />
            <rect x="280" y="148" width="14" height="12" fill="#7588A6" />
            <rect x="305" y="148" width="14" height="12" fill="#7588A6" />
            <rect x="330" y="148" width="14" height="12" fill="#7588A6" />

            {/* Window */}
            <path d="M 290 215 A 10 10 0 0 1 310 215 L 310 240 L 290 240 Z" fill="#0B131F" />
          </g>
        )}

        {savings === 'damaged' && (
          <g>
            {/* Short Mud Tower */}
            <path d="M 260 330 L 265 240 C 275 245 285 235 300 245 C 315 235 325 240 335 240 L 340 330 Z" fill="#5C4538" />
            {/* Cracks */}
            <path d="M 285 245 L 290 270 L 285 290" stroke="#2B1A0F" strokeWidth="3" fill="none" />
            <path d="M 320 250 L 315 280" stroke="#2B1A0F" strokeWidth="2" fill="none" />
          </g>
        )}


        {/* PILLAR 4: DONATION (Farm/Oasis) - Front-left foreground */}
        {donation === 'thriving' && (
          <g>
            {/* Lush green patch */}
            <ellipse cx="120" cy="350" rx="70" ry="25" fill="#009639" />
            <ellipse cx="150" cy="355" rx="50" ry="18" fill="#13A84D" />
            {/* Sparkling Blue Pond */}
            <ellipse cx="110" cy="355" rx="30" ry="12" fill="#00A8F3" />
            <ellipse cx="105" cy="355" rx="20" ry="8" fill="#E8F9FF" opacity="0.6" />
            {/* Tiny Plants/Flowers */}
            <circle cx="70" cy="345" r="3" fill="#E57A44" />
            <circle cx="74" cy="348" r="2.5" fill="#FFC90E" />
            <circle cx="160" cy="352" r="3" fill="#fff" />
          </g>
        )}

        {donation === 'average' && (
          <g>
            {/* Normal grass patch */}
            <ellipse cx="120" cy="350" rx="60" ry="20" fill="#758A63" />
            <ellipse cx="110" cy="352" rx="20" ry="8" fill="#4C8561" opacity="0.3" />
          </g>
        )}

        {donation === 'damaged' && (
          <g>
            {/* Dry sand patch */}
            <ellipse cx="120" cy="350" rx="55" ry="18" fill="#BFA786" />
            <ellipse cx="100" cy="348" rx="25" ry="8" fill="#9C815B" opacity="0.4" />
          </g>
        )}


        {/* PILLAR 5: INVESTMENT (Market) - Front-right foreground */}
        {investment === 'thriving' && (
          <g>
            {/* Ground patch */}
            <ellipse cx="480" cy="350" rx="70" ry="25" fill="#8C7355" opacity="0.4" />
            
            {/* Tent 1: Red/White Stripes */}
            <path d="M 430 360 L 430 330 L 460 300 L 490 330 L 490 360 Z" fill="#C23B22" />
            {/* Stripes */}
            <path d="M 445 360 L 445 315 L 460 300 L 475 315 L 475 360 Z" fill="#FFF" />
            <polygon points="460,300 440,310 480,310" fill="#C23B22" />
            
            {/* Tent 2: Blue/Yellow Stripes */}
            <path d="M 480 365 L 480 335 L 505 310 L 530 335 L 530 365 Z" fill="#FAD1A7" />
            <path d="M 492 365 L 492 322 L 505 310 L 518 322 L 518 365 Z" fill="#1C3E75" />
            <polygon points="505,310 490,320 520,320" fill="#E57A44" />
          </g>
        )}

        {investment === 'average' && (
          <g>
            {/* Ground patch */}
            <ellipse cx="480" cy="350" rx="60" ry="20" fill="#695A49" opacity="0.3" />
            
            {/* Simple Wooden Market Stalls */}
            <rect x="440" y="325" width="35" height="30" fill="#6B4D36" rx="2" />
            <polygon points="435,325 457,315 480,325" fill="#B08D71" />
            
            <rect x="485" y="330" width="30" height="25" fill="#6B4D36" rx="2" />
            <polygon points="480,330 500,322 520,330" fill="#B08D71" />
          </g>
        )}

        {investment === 'damaged' && (
          <g>
            {/* Empty dirt ground */}
            <ellipse cx="480" cy="350" rx="50" ry="15" fill="#524338" opacity="0.5" />
            {/* A broken box/stick */}
            <line x1="470" y1="345" x2="490" y2="352" stroke="#382216" strokeWidth="3" />
            <line x1="475" y1="355" x2="483" y2="348" stroke="#382216" strokeWidth="2" />
          </g>
        )}
      </svg>

      {/* Gradients definition inside SVG (rendered off-screen or inline) */}
      <svg className="hidden">
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="50%" stopColor="#DFAD12" />
            <stop offset="100%" stopColor="#A87A04" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
