import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { type Tier } from './villageLogic';
import { NAMAA } from './palette';
import { TierGroup, ParticleBurst, Floating } from './utils';

/* ─── palette ─── */
const ST  = '#9aa3b5';
const STD = '#6b7485';
const STL = '#c4ccd8';
const ROOF  = NAMAA.purpleDeep;
const GOLD  = NAMAA.gold;
const GOLDL = NAMAA.goldLight;

/* ═══════════════════════════════════
   SHARED HELPERS
   ═══════════════════════════════════ */

/** Merlon row along X, centered at origin */
function Merlons({
  len, count = 6, mH = 0.34, mW = 0.28, depth = 0.28, color = ST,
}: {
  len: number; count?: number; mH?: number; mW?: number; depth?: number; color?: string;
}) {
  const step = len / count;
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        if (i % 2 !== 0) return null;
        return (
          <mesh key={i} castShadow position={[-len / 2 + (i + 0.5) * step, mH / 2, 0]}>
            <boxGeometry args={[mW, mH, depth]} />
            <meshStandardMaterial color={color} roughness={0.88} />
          </mesh>
        );
      })}
    </>
  );
}

/** Circular merlon crown around a round tower top */
function TowerCrown({
  r, y, n = 12, mH = 0.34, color = ST,
}: {
  r: number; y: number; n?: number; mH?: number; color?: string;
}) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        if (i % 2 !== 0) return null;
        const a = (i / n) * Math.PI * 2;
        return (
          <mesh key={i} castShadow
            position={[Math.cos(a) * r, y + mH / 2, Math.sin(a) * r]}>
            <boxGeometry args={[0.26, mH, 0.26]} />
            <meshStandardMaterial color={color} roughness={0.88} />
          </mesh>
        );
      })}
    </>
  );
}

/** Round tower with corbel, crown and pointed cap */
function RoundTower({
  x = 0, z = 0, r, h, capH,
  color = ST, capColor = ROOF, crownMerlons = 10,
}: {
  x?: number; z?: number; r: number; h: number; capH: number;
  color?: string; capColor?: string; crownMerlons?: number;
}) {
  const cr = r + 0.11;
  return (
    <group position={[x, 0, z]}>
      <mesh castShadow receiveShadow position={[0, h / 2, 0]}>
        <cylinderGeometry args={[r, r * 1.08, h, 12]} />
        <meshStandardMaterial color={color} roughness={0.83} />
      </mesh>
      {/* Corbel band */}
      <mesh castShadow position={[0, h + 0.09, 0]}>
        <cylinderGeometry args={[cr, r, 0.24, 12]} />
        <meshStandardMaterial color={STD} roughness={0.86} />
      </mesh>
      {/* Walk ring */}
      <mesh castShadow position={[0, h + 0.24, 0]}>
        <cylinderGeometry args={[cr + 0.03, cr + 0.03, 0.14, 12]} />
        <meshStandardMaterial color={color} roughness={0.84} />
      </mesh>
      <TowerCrown r={cr} y={h + 0.32} n={crownMerlons} color={color} mH={0.34} />
      {/* Conical cap */}
      <mesh castShadow position={[0, h + 0.7, 0]}>
        <coneGeometry args={[cr + 0.04, capH, 12]} />
        <meshStandardMaterial color={capColor} roughness={0.76} />
      </mesh>
      {/* Arrow slit */}
      <mesh position={[0, h * 0.55, r + 0.01]}>
        <boxGeometry args={[0.1, 0.4, 0.15]} />
        <meshStandardMaterial color="#181c26" roughness={1} />
      </mesh>
    </group>
  );
}

/** Waving flag on a pole */
function Flag({
  x = 0, y = 0, z = 0, poleH = 1.2, color = NAMAA.purpleBright,
}: {
  x?: number; y?: number; z?: number; poleH?: number; color?: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (ref.current) ref.current.rotation.y = Math.sin(s.clock.elapsedTime * 1.8) * 0.18;
  });
  return (
    <group position={[x, y, z]}>
      <mesh castShadow position={[0, poleH / 2, 0]}>
        <cylinderGeometry args={[0.035, 0.035, poleH, 7]} />
        <meshStandardMaterial color={GOLD} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh ref={ref} castShadow position={[0.22, poleH - 0.15, 0]}>
        <boxGeometry args={[0.44, 0.28, 0.03]} />
        <meshStandardMaterial color={color} roughness={0.7} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, poleH + 0.09, 0]}>
        <sphereGeometry args={[0.055, 7, 7]} />
        <meshStandardMaterial color={GOLD} metalness={0.75} roughness={0.25} />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════
   TIER 1 — الحصن الصغير
   برج مركزي + برجان أماميان + شرفات + علم
   حجم: ~3×2.5، ارتفاع أقصى: ~4.2
   ═══════════════════════════════════════════ */
function SmallFort() {
  const KW = 2.4, KD = 2.2, KH = 3.2;
  return (
    <group>
      {/* قاعدة حجرية */}
      <mesh receiveShadow castShadow position={[0, 0.14, 0]}>
        <boxGeometry args={[KW + 0.7, 0.28, KD + 0.7]} />
        <meshStandardMaterial color={STD} roughness={0.9} />
      </mesh>

      {/* جسم البرج الرئيسي */}
      <mesh castShadow receiveShadow position={[0, KH / 2 + 0.28, 0]}>
        <boxGeometry args={[KW, KH, KD]} />
        <meshStandardMaterial color={ST} roughness={0.84} />
      </mesh>
      {/* حزام الإكليل */}
      <mesh castShadow position={[0, KH + 0.36, 0]}>
        <boxGeometry args={[KW + 0.14, 0.2, KD + 0.14]} />
        <meshStandardMaterial color={STD} roughness={0.86} />
      </mesh>

      {/* شرفات — الأمام / الخلف */}
      {([-1, 1] as const).map((s, i) => (
        <group key={i} position={[0, KH + 0.56, s * (KD / 2 + 0.07)]}>
          <Merlons len={KW + 0.14} count={6} />
        </group>
      ))}
      {/* شرفات — الجانبان */}
      {([-1, 1] as const).map((s, i) => (
        <group key={i} position={[s * (KW / 2 + 0.07), KH + 0.56, 0]}
               rotation={[0, Math.PI / 2, 0]}>
          <Merlons len={KD + 0.14} count={5} />
        </group>
      ))}

      {/* فتحات سهام */}
      {([-0.65, 0.65] as const).map((x, i) => (
        <mesh key={i} position={[x, KH * 0.52 + 0.28, KD / 2 + 0.01]}>
          <boxGeometry args={[0.11, 0.42, 0.15]} />
          <meshStandardMaterial color="#181c26" roughness={1} />
        </mesh>
      ))}
      {/* نافذة */}
      <mesh position={[0, KH * 0.7 + 0.28, KD / 2 + 0.01]}>
        <boxGeometry args={[0.38, 0.42, 0.12]} />
        <meshStandardMaterial color="#aad4f5" transparent opacity={0.62} roughness={0.1} />
      </mesh>

      {/* بوابة */}
      <mesh position={[0, KH * 0.26 + 0.28, KD / 2 + 0.02]}>
        <boxGeometry args={[0.56, KH * 0.52, 0.1]} />
        <meshStandardMaterial color={STD} roughness={0.88} />
      </mesh>
      <mesh position={[0, KH * 0.26 + 0.06, KD / 2 + 0.08]}>
        <boxGeometry args={[0.44, KH * 0.46, 0.07]} />
        <meshStandardMaterial color="#0e1018" roughness={1} />
      </mesh>
      {/* قوس البوابة */}
      <mesh position={[0, KH * 0.54 + 0.28, KD / 2 + 0.05]}
            rotation={[-Math.PI / 2, Math.PI / 2, 0]}>
        <torusGeometry args={[0.28, 0.065, 7, 14, Math.PI]} />
        <meshStandardMaterial color={STD} roughness={0.86} />
      </mesh>

      {/* برجان أماميان */}
      <RoundTower x={-(KW / 2 + 0.1)} z={ KD / 2 + 0.1} r={0.42} h={KH + 0.9} capH={0.9} />
      <RoundTower x={  KW / 2 + 0.1}  z={ KD / 2 + 0.1} r={0.42} h={KH + 0.9} capH={0.9} />

      {/* علم */}
      <Flag y={KH + 0.58} poleH={1.2} />
    </group>
  );
}

/* ═══════════════════════════════════════════
   TIER 2 — القلعة المتوسطة
   4 أبراج زاوية + سور ستارة + قلعة داخلية + بوابة
   حجم: ~5×5، ارتفاع أقصى: ~6.5
   ═══════════════════════════════════════════ */
function MediumCastle() {
  const TR = 2.4;  // مسافة الأبراج من المركز
  const TH = 5.2;  // ارتفاع الأبراج
  const WH = 2.4;  // ارتفاع السور
  const IH = 4.6;  // ارتفاع البرج الداخلي

  return (
    <group>
      {/* قاعدة */}
      <mesh receiveShadow position={[0, 0.18, 0]}>
        <boxGeometry args={[TR * 2 + 1.8, 0.36, TR * 2 + 1.8]} />
        <meshStandardMaterial color={STD} roughness={0.9} />
      </mesh>

      {/* ═ البرج الداخلي ═ */}
      <mesh castShadow receiveShadow position={[0, IH / 2 + 0.36, 0]}>
        <boxGeometry args={[2.0, IH, 2.0]} />
        <meshStandardMaterial color={STL} roughness={0.8} />
      </mesh>
      <mesh castShadow position={[0, IH + 0.44, 0]}>
        <boxGeometry args={[2.16, 0.22, 2.16]} />
        <meshStandardMaterial color={STD} roughness={0.84} />
      </mesh>
      {/* شرفات البرج الداخلي */}
      {([-1, 1] as const).map((s, i) => (
        <group key={i} position={[0, IH + 0.66, s * 1.1]}
               rotation={[0, i === 0 ? 0 : Math.PI, 0]}>
          <Merlons len={2.16} count={5} color={STL} />
        </group>
      ))}
      {([-1, 1] as const).map((s, i) => (
        <group key={i} position={[s * 1.1, IH + 0.66, 0]}
               rotation={[0, Math.PI / 2, 0]}>
          <Merlons len={2.16} count={5} color={STL} />
        </group>
      ))}
      {/* نوافذ البرج الداخلي */}
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((a, i) => (
        <mesh key={i} position={[Math.sin(a) * 1.01, IH * 0.62 + 0.36, Math.cos(a) * 1.01]}>
          <boxGeometry args={[0.11, 0.46, 0.14]} />
          <meshStandardMaterial color="#181c26" roughness={1} />
        </mesh>
      ))}

      {/* ═ أسوار الستارة ═ */}
      {/* أمام وخلف */}
      {([-1, 1] as const).map((s, i) => (
        <group key={i} position={[0, 0, s * TR]} rotation={[0, Math.PI / 2, 0]}>
          <mesh castShadow receiveShadow position={[0, WH / 2, 0]}>
            <boxGeometry args={[TR * 2, WH, 0.44]} />
            <meshStandardMaterial color={ST} roughness={0.85} />
          </mesh>
          <mesh castShadow position={[0, WH + 0.12, 0]}>
            <boxGeometry args={[TR * 2, 0.2, 0.52]} />
            <meshStandardMaterial color={STD} roughness={0.86} />
          </mesh>
          <group position={[0, WH + 0.32, 0]}>
            <Merlons len={TR * 2} count={8} />
          </group>
        </group>
      ))}
      {/* يمين ويسار */}
      {([-1, 1] as const).map((s, i) => (
        <group key={i} position={[s * TR, 0, 0]}>
          <mesh castShadow receiveShadow position={[0, WH / 2, 0]}>
            <boxGeometry args={[0.44, WH, TR * 2]} />
            <meshStandardMaterial color={ST} roughness={0.85} />
          </mesh>
          <mesh castShadow position={[0, WH + 0.12, 0]}>
            <boxGeometry args={[0.52, 0.2, TR * 2]} />
            <meshStandardMaterial color={STD} roughness={0.86} />
          </mesh>
          <group position={[0, WH + 0.32, 0]} rotation={[0, Math.PI / 2, 0]}>
            <Merlons len={TR * 2} count={8} />
          </group>
        </group>
      ))}

      {/* ═ 4 أبراج الزوايا ═ */}
      {([[-1, -1], [1, -1], [1, 1], [-1, 1]] as const).map(([sx, sz], i) => (
        <RoundTower key={i}
          x={sx * TR} z={sz * TR}
          r={0.6} h={TH} capH={1.1}
          crownMerlons={10}
        />
      ))}

      {/* ═ بوابة أمامية ═ */}
      <group position={[0, 0, TR]}>
        <mesh castShadow receiveShadow position={[0, WH + 0.52, 0]}>
          <boxGeometry args={[1.5, WH * 0.7, 0.88]} />
          <meshStandardMaterial color={STD} roughness={0.84} />
        </mesh>
        <group position={[0, WH + 1.0, 0]}>
          <Merlons len={1.5} count={5} color={STD} />
        </group>
        {/* فتحة البوابة */}
        <mesh position={[0, WH * 0.44, 0.46]}>
          <boxGeometry args={[0.7, WH * 0.88, 0.22]} />
          <meshStandardMaterial color="#0e1018" roughness={1} />
        </mesh>
        {/* قوس ذهبي */}
        <mesh position={[0, WH * 0.58, 0.44]}
              rotation={[-Math.PI / 2, Math.PI / 2, 0]}>
          <torusGeometry args={[0.36, 0.07, 7, 16, Math.PI]} />
          <meshStandardMaterial color={GOLD} metalness={0.6} roughness={0.35} />
        </mesh>
        {/* فتحات سهام على السور الأمامي */}
        {([-0.7, 0.7] as const).map((x, i) => (
          <mesh key={i} position={[x, WH * 0.52, 0.24]}>
            <boxGeometry args={[0.1, 0.38, 0.18]} />
            <meshStandardMaterial color="#181c26" roughness={1} />
          </mesh>
        ))}
      </group>

      {/* أعلام */}
      {([[-1, -1], [1, -1], [1, 1], [-1, 1]] as const).map(([sx, sz], i) => (
        <Flag key={i} x={sx * TR} y={TH + 0.72} z={sz * TR}
              poleH={1.3} color={i % 2 === 0 ? NAMAA.purpleBright : GOLD} />
      ))}
      <Flag y={IH + 0.66} poleH={1.4} />
    </group>
  );
}

/* ═══════════════════════════════════════════
   TIER 3 — القصر الكبير
   سور خارجي + 4 أبراج داخلية بقمم ذهبية + برج مركزي بقبة
   حجم: ~6×6، ارتفاع أقصى: ~9
   ═══════════════════════════════════════════ */
function GrandPalace() {
  const OTR = 3.0;  // مسافة أبراج السور الخارجي
  const OWH = 1.9;  // ارتفاع السور الخارجي
  const ITR = 1.9;  // مسافة الأبراج الداخلية
  const ITH = 6.2;  // ارتفاع الأبراج الداخلية
  const CKH = 5.8;  // ارتفاع البرج المركزي

  return (
    <group>
      {/* قاعدة خارجية */}
      <mesh receiveShadow position={[0, 0.2, 0]}>
        <boxGeometry args={[OTR * 2 + 1.8, 0.4, OTR * 2 + 1.8]} />
        <meshStandardMaterial color={STD} roughness={0.92} />
      </mesh>

      {/* ═ السور الخارجي ═ */}
      {([-1, 1] as const).map((s, i) => (
        <group key={i} position={[0, 0, s * OTR]} rotation={[0, Math.PI / 2, 0]}>
          <mesh castShadow receiveShadow position={[0, OWH / 2, 0]}>
            <boxGeometry args={[OTR * 2, OWH, 0.4]} />
            <meshStandardMaterial color={STD} roughness={0.86} />
          </mesh>
          <mesh castShadow position={[0, OWH + 0.1, 0]}>
            <boxGeometry args={[OTR * 2, 0.18, 0.48]} />
            <meshStandardMaterial color={STD} roughness={0.88} />
          </mesh>
          <group position={[0, OWH + 0.28, 0]}>
            <Merlons len={OTR * 2} count={10} color={STD} />
          </group>
        </group>
      ))}
      {([-1, 1] as const).map((s, i) => (
        <group key={i} position={[s * OTR, 0, 0]}>
          <mesh castShadow receiveShadow position={[0, OWH / 2, 0]}>
            <boxGeometry args={[0.4, OWH, OTR * 2]} />
            <meshStandardMaterial color={STD} roughness={0.86} />
          </mesh>
          <mesh castShadow position={[0, OWH + 0.1, 0]}>
            <boxGeometry args={[0.48, 0.18, OTR * 2]} />
            <meshStandardMaterial color={STD} roughness={0.88} />
          </mesh>
          <group position={[0, OWH + 0.28, 0]} rotation={[0, Math.PI / 2, 0]}>
            <Merlons len={OTR * 2} count={10} color={STD} />
          </group>
        </group>
      ))}

      {/* ═ أبراج زوايا السور الخارجي ═ */}
      {([[-1, -1], [1, -1], [1, 1], [-1, 1]] as const).map(([sx, sz], i) => (
        <RoundTower key={i}
          x={sx * OTR} z={sz * OTR}
          r={0.52} h={OWH + 1.8} capH={0.9}
          color={STD} crownMerlons={8}
        />
      ))}

      {/* ═ بوابة السور الخارجي ═ */}
      <group position={[0, 0, OTR]}>
        <mesh castShadow receiveShadow position={[0, OWH + 0.46, 0]}>
          <boxGeometry args={[2.0, OWH + 0.5, 0.8]} />
          <meshStandardMaterial color={STD} roughness={0.84} />
        </mesh>
        <group position={[0, OWH + 1.0, 0]}>
          <Merlons len={2.0} count={6} color={STD} />
        </group>
        <mesh position={[0, OWH * 0.5, 0.42]}>
          <boxGeometry args={[0.78, OWH, 0.24]} />
          <meshStandardMaterial color="#0e1018" roughness={1} />
        </mesh>
        <mesh position={[0, OWH * 0.7, 0.42]}
              rotation={[-Math.PI / 2, Math.PI / 2, 0]}>
          <torusGeometry args={[0.4, 0.072, 7, 16, Math.PI]} />
          <meshStandardMaterial color={GOLD} metalness={0.65} roughness={0.32} />
        </mesh>
        {/* أبراج البوابة المصغّرة */}
        {([-1, 1] as const).map((s, j) => (
          <RoundTower key={j} x={s * 1.12} z={0}
            r={0.38} h={OWH + 1.2} capH={0.8}
            color={STD} crownMerlons={8} />
        ))}
      </group>

      {/* ═ قاعدة داخلية مرتفعة ═ */}
      <mesh castShadow receiveShadow position={[0, OWH + 0.5, 0]}>
        <boxGeometry args={[ITR * 2 + 0.5, 0.36, ITR * 2 + 0.5]} />
        <meshStandardMaterial color={ST} roughness={0.85} />
      </mesh>

      {/* ═ البرج المركزي (ثماني) ═ */}
      <mesh castShadow receiveShadow position={[0, OWH + 0.68 + CKH / 2, 0]}>
        <cylinderGeometry args={[1.18, 1.35, CKH, 8]} />
        <meshStandardMaterial color={STL} roughness={0.78} />
      </mesh>
      {/* أحزمة حجرية */}
      {[1.4, 2.9, 4.4].map((dy, i) => (
        <mesh key={i} position={[0, OWH + 0.68 + dy, 0]}>
          <cylinderGeometry args={[1.37, 1.37, 0.16, 8]} />
          <meshStandardMaterial color={STD} roughness={0.84} />
        </mesh>
      ))}
      {/* نوافذ */}
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((a, i) => (
        <mesh key={i}
          position={[Math.sin(a) * 1.26, OWH + 0.68 + CKH * 0.52, Math.cos(a) * 1.26]}>
          <boxGeometry args={[0.38, 0.5, 0.14]} />
          <meshStandardMaterial color="#aad4f5" transparent opacity={0.65} roughness={0.1} />
        </mesh>
      ))}
      {/* إكليل + شرفات */}
      <mesh castShadow position={[0, OWH + 0.68 + CKH + 0.12, 0]}>
        <cylinderGeometry args={[1.32, 1.22, 0.26, 8]} />
        <meshStandardMaterial color={STD} roughness={0.84} />
      </mesh>
      <TowerCrown r={1.28} y={OWH + 0.68 + CKH + 0.3} n={16} color={STL} />

      {/* قبة ذهبية */}
      <mesh castShadow position={[0, OWH + 0.68 + CKH + 0.72, 0]}>
        <cylinderGeometry args={[1.05, 1.18, 0.52, 10]} />
        <meshStandardMaterial color={STL} roughness={0.76} />
      </mesh>
      <mesh castShadow position={[0, OWH + 0.68 + CKH + 1.22, 0]}>
        <sphereGeometry args={[1.12, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshStandardMaterial color={GOLD} metalness={0.76} roughness={0.2} />
      </mesh>
      {/* شريط ذهبي */}
      <mesh position={[0, OWH + 0.68 + CKH + 0.72, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 0.09, 10]} />
        <meshStandardMaterial color={GOLD} metalness={0.68} roughness={0.3} />
      </mesh>
      {/* مئذنة */}
      <mesh castShadow position={[0, OWH + 0.68 + CKH + 2.36, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.72, 7]} />
        <meshStandardMaterial color={GOLD} metalness={0.82} roughness={0.2} />
      </mesh>
      <mesh position={[0, OWH + 0.68 + CKH + 2.76, 0]}>
        <sphereGeometry args={[0.13, 9, 9]} />
        <meshStandardMaterial color={GOLDL} metalness={0.9} roughness={0.13} />
      </mesh>

      {/* ═ 4 أبراج داخلية ذهبية الرأس ═ */}
      {([[-1, -1], [1, -1], [1, 1], [-1, 1]] as const).map(([sx, sz], i) => (
        <group key={i} position={[sx * ITR, OWH + 0.68, sz * ITR]}>
          {/* جسم البرج */}
          <mesh castShadow receiveShadow position={[0, ITH / 2, 0]}>
            <cylinderGeometry args={[0.72, 0.82, ITH, 12]} />
            <meshStandardMaterial color={ST} roughness={0.82} />
          </mesh>
          {/* أحزمة حجرية */}
          {[2.0, 4.0].map((dy, j) => (
            <mesh key={j} position={[0, dy, 0]}>
              <cylinderGeometry args={[0.84, 0.84, 0.14, 12]} />
              <meshStandardMaterial color={STD} roughness={0.85} />
            </mesh>
          ))}
          {/* كوربيل + إكليل */}
          <mesh castShadow position={[0, ITH + 0.12, 0]}>
            <cylinderGeometry args={[0.86, 0.74, 0.24, 12]} />
            <meshStandardMaterial color={STD} roughness={0.84} />
          </mesh>
          <mesh castShadow position={[0, ITH + 0.28, 0]}>
            <cylinderGeometry args={[0.9, 0.9, 0.14, 12]} />
            <meshStandardMaterial color={ST} roughness={0.83} />
          </mesh>
          <TowerCrown r={0.86} y={ITH + 0.36} n={12} color={ST} />
          {/* قمة مخروطية ذهبية */}
          <mesh castShadow position={[0, ITH + 0.72, 0]}>
            <coneGeometry args={[0.92, ITH * 0.26, 12]} />
            <meshStandardMaterial color={GOLD} metalness={0.72} roughness={0.24} />
          </mesh>
          <mesh position={[0, ITH + 0.72, 0]}>
            <cylinderGeometry args={[0.94, 0.94, 0.09, 12]} />
            <meshStandardMaterial color={GOLD} metalness={0.66} roughness={0.3} />
          </mesh>
          <mesh position={[0, ITH + 0.72 + ITH * 0.26 + 0.2, 0]}>
            <sphereGeometry args={[0.09, 8, 8]} />
            <meshStandardMaterial color={GOLDL} metalness={0.88} roughness={0.14} />
          </mesh>
          {/* فتحة سهام */}
          <mesh position={[0, ITH * 0.5, 0.76]}>
            <boxGeometry args={[0.1, 0.45, 0.16]} />
            <meshStandardMaterial color="#181c26" roughness={1} />
          </mesh>
          {/* علم */}
          <Flag y={ITH + 0.72 + ITH * 0.26 + 0.38} poleH={1.0}
                color={i % 2 === 0 ? NAMAA.purpleBright : NAMAA.amber} />
        </group>
      ))}

      {/* ═ أعلام السور الخارجي ═ */}
      {([[-1, -1], [1, -1], [1, 1], [-1, 1]] as const).map(([sx, sz], i) => (
        <Flag key={i}
          x={sx * OTR} z={sz * OTR} y={OWH + 2.16}
          poleH={1.1} color={i % 2 === 0 ? NAMAA.purpleBright : GOLD} />
      ))}

      {/* ═ كرات ذهبية تحوم فوق القبة ═ */}
      {[0, 1, 2].map(i => (
        <Floating key={i}
          height={0.2} speed={1.3 + i * 0.45}
          yOffset={OWH + 0.68 + CKH + 3.2 + i * 0.55}>
          <mesh>
            <sphereGeometry args={[0.13 - i * 0.02, 9, 9]} />
            <meshStandardMaterial
              color={GOLDL} emissive={GOLD}
              emissiveIntensity={0.65} metalness={0.82} roughness={0.16} />
          </mesh>
        </Floating>
      ))}
    </group>
  );
}

/* ═══════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════ */
export function Palace({ tier, level, position }: {
  tier: Tier; level: number; position: [number, number, number];
}) {
  return (
    <group position={position}>
      <ParticleBurst trigger={level} color={NAMAA.gold} />
      <TierGroup active={tier === 1}><SmallFort /></TierGroup>
      <TierGroup active={tier === 2}><MediumCastle /></TierGroup>
      <TierGroup active={tier === 3}><GrandPalace /></TierGroup>
    </group>
  );
}
