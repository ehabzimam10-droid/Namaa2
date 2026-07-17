import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function TierGroup({ active, children, yOffset = 0 }: { active: boolean, children: React.ReactNode, yOffset?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const state = useRef({ scale: active ? 1 : 0, velocity: 0 });
  
  useFrame((_, delta) => {
    const target = active ? 1 : 0;
    const dt = Math.min(delta, 0.1);
    const tension = active ? 150 : 200;
    const friction = active ? 12 : 20;
    
    const displacement = target - state.current.scale;
    const springForce = displacement * tension;
    const dampingForce = -state.current.velocity * friction;
    
    state.current.velocity += (springForce + dampingForce) * dt;
    state.current.scale += state.current.velocity * dt;
    
    if (groupRef.current) {
      const s = Math.max(0, state.current.scale);
      groupRef.current.scale.setScalar(s);
      groupRef.current.visible = s > 0.01;
      groupRef.current.position.y = yOffset + (1 - s) * -0.5;
    }
  });

  return <group ref={groupRef} visible={active}>{children}</group>;
}

export function ParticleBurst({ trigger, color }: { trigger: number; color: string }) {
  const group = useRef<THREE.Group>(null);
  const particles = useMemo(() => Array.from({ length: 15 }).map(() => ({
    pos: new THREE.Vector3((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2),
    vel: new THREE.Vector3((Math.random() - 0.5) * 5, Math.random() * 5 + 2, (Math.random() - 0.5) * 5),
  })), []);
  
  const [active, setActive] = useState(false);
  const time = useRef(0);
  const prevTrigger = useRef(trigger);

  useEffect(() => {
    if (trigger > prevTrigger.current) {
      setActive(true);
      time.current = 0;
      if (group.current) {
        group.current.children.forEach((c, i) => {
          c.position.set(0, 0, 0);
          particles[i].vel.set((Math.random() - 0.5) * 5, Math.random() * 5 + 2, (Math.random() - 0.5) * 5);
        });
      }
    }
    prevTrigger.current = trigger;
  }, [trigger, particles]);

  useFrame((_, delta) => {
    if (!active) return;
    time.current += delta;
    if (time.current > 1) {
      setActive(false);
      return;
    }
    if (group.current) {
      group.current.children.forEach((c, i) => {
        const p = particles[i];
        p.vel.y -= 10 * delta; 
        c.position.addScaledVector(p.vel, delta);
        c.scale.setScalar(Math.max(0, 1 - time.current));
      });
    }
  });

  if (!active) return null;

  return (
    <group ref={group}>
      {particles.map((_, i) => (
        <mesh key={i}>
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

export function Floating({ children, speed = 2, height = 0.2, yOffset = 0 }: { children: React.ReactNode, speed?: number, height?: number, yOffset?: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = yOffset + Math.sin(state.clock.elapsedTime * speed) * height;
      ref.current.rotation.y += 0.02;
    }
  });
  return <group ref={ref}>{children}</group>;
}

export function useHoverLift(hovered: boolean) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.position.y = THREE.MathUtils.damp(ref.current.position.y, hovered ? 0.4 : 0, 10, delta);
    }
  });
  return ref;
}
