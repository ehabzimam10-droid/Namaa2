interface FortressWallProps {
  level: number;
}

export default function FortressWall({ level }: FortressWallProps) {
  // Styles for the perimeter wall depending on level
  const getWallStyles = () => {
    switch (level) {
      case 1:
        return {
          stroke: '#8C7355',
          strokeWidth: '3',
          strokeDasharray: '6 6',
          opacity: 0.6,
        };
      case 2:
        return {
          stroke: '#5C4533', // Wood fence
          strokeWidth: '5',
          strokeDasharray: 'none',
          opacity: 0.8,
        };
      case 3:
        return {
          stroke: '#5F6C7D', // Stone wall
          strokeWidth: '7',
          strokeDasharray: 'none',
          opacity: 0.9,
        };
      case 4:
        return {
          stroke: '#4B5666', // Double stone wall
          strokeWidth: '9',
          strokeDasharray: 'none',
          opacity: 1,
        };
      case 5:
      default:
        return {
          stroke: '#FFE875', // Golden Empire Wall
          strokeWidth: '11',
          strokeDasharray: 'none',
          opacity: 1,
        };
    }
  };

  const w = getWallStyles();

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
      {/* Surrounding perimeter line (lies flat on the board floor) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <ellipse
          cx="180"
          cy="95"
          rx="170"
          ry="87"
          fill="none"
          stroke={w.stroke}
          strokeWidth={w.strokeWidth}
          strokeDasharray={w.strokeDasharray}
          opacity={w.opacity}
          style={{ transition: 'all 0.5s ease' }}
        />
        
        {/* Extra gold inner trim for Level 5 */}
        {level === 5 && (
          <ellipse
            cx="180"
            cy="95"
            rx="160"
            ry="79"
            fill="none"
            stroke="#FFF4B8"
            strokeWidth="2"
            opacity="0.8"
          />
        )}
      </svg>

      {/* Upright Corner Turret Towers (Flat 2D overlay) */}
      {level >= 2 && (
        <>
          {/* Top Corner Post */}
          <div className="absolute left-[160px] top-[-10px] w-10 h-10 z-10">
            <TurretSVG level={level} />
          </div>

          {/* Bottom Corner Post */}
          <div className="absolute left-[160px] bottom-[-5px] w-10 h-10 z-30">
            <TurretSVG level={level} />
          </div>

          {/* Left Corner Post */}
          <div className="absolute left-[-5px] top-[75px] w-10 h-10 z-20">
            <TurretSVG level={level} />
          </div>

          {/* Right Corner Post */}
          <div className="absolute right-[-5px] top-[75px] w-10 h-10 z-20">
            <TurretSVG level={level} />
          </div>
        </>
      )}
    </div>
  );
}

// Corner Guard Turret SVG helper
function TurretSVG({ level }: { level: number }) {
  const getTurretColors = () => {
    switch (level) {
      case 2:
        return { walls: '#5C4533', top: '#8C7355' };
      case 3:
        return { walls: '#4B5666', top: '#E57A44' };
      case 4:
        return { walls: '#3D4D6B', top: '#FFE552' };
      case 5:
      default:
        return { walls: '#FFD700', top: '#C22588' }; // Matches purple roofs
    }
  };

  const tc = getTurretColors();

  return (
    <svg viewBox="0 0 40 40" className="w-full h-full overflow-visible">
      {/* Shadow */}
      <ellipse cx="20" cy="35" rx="8" ry="4" fill="#000" opacity="0.4" />
      {/* Main post */}
      <rect x="14" y="10" width="12" height="25" fill={tc.walls} rx="1" stroke="#967005" strokeWidth={level === 5 ? '1' : '0'} />
      {/* Top cap */}
      <polygon points="10,10 20,0 30,10" fill={tc.top} stroke={level === 5 ? '#FFE552' : 'none'} strokeWidth="1" />
      {/* Glowing light for L5 */}
      {level === 5 && (
        <circle cx="20" cy="18" r="2.5" fill="#FFF4B8" className="animate-pulse" />
      )}
    </svg>
  );
}
