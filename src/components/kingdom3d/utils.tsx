import React, { useRef, useState, useMemo } from 'react';
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
  const particlesRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const count = 30;
  
  const particleData = useMemo(() => {
    return Array.from({ length: count }, () => ({
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 15,
        Math.random() * 15 + 5,
        (Math.random() - 0.5) * 15
      ),
      position: new THREE.Vector3(0, 0, 0),
      life: 0,
      maxLife: Math.random() * 0.5 + 0.5
    }));
  }, []);
  
  const lastTrigger = useRef(trigger);
  const [active, setActive] = useState(false);
  
  useFrame((_, delta) => {
    if (trigger !== lastTrigger.current) {
      lastTrigger.current = trigger;
      setActive(true);
      particleData.forEach(p => {
        p.life = p.maxLife;
        p.position.set(0, 0, 0);
        p.velocity.set(
          (Math.random() - 0.5) * 15,
          Math.random() * 15 + 5,
          (Math.random() - 0.5) * 15
        );
      });
    }
    
    if (active && particlesRef.current) {
      let alive = false;
      particleData.forEach((p, i) => {
        if (p.life > 0) {
          alive = true;
          p.life -= delta;
          p.velocity.y -= 25 * delta; // gravity
          p.position.addScaledVector(p.velocity, delta);
          const scale = Math.max(0, p.life / p.maxLife);
          dummy.position.copy(p.position);
          dummy.scale.setScalar(scale);
          dummy.updateMatrix();
          particlesRef.current!.setMatrixAt(i, dummy.matrix);
        } else {
          dummy.scale.setScalar(0);
          dummy.updateMatrix();
          particlesRef.current!.setMatrixAt(i, dummy.matrix);
        }
      });
      particlesRef.current.instanceMatrix.needsUpdate = true;
      if (!alive) setActive(false);
    }
  });
  
  return (
    <instancedMesh ref={particlesRef} args={[undefined, undefined, count]} visible={active}>
      <sphereGeometry args={[0.2, 4, 4]} />
      <meshBasicMaterial color={color} />
    </instancedMesh>
  );
}

export function Floating({ children, speed = 2, height = 0.2, yOffset = 0 }: { children: React.ReactNode, speed?: number, height?: number, yOffset?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = yOffset + Math.sin(state.clock.elapsedTime * speed) * height;
    }
  });
  
  return <group ref={groupRef}>{children}</group>;
}

export function useHoverLift(hovered: boolean) {
  const groupRef = useRef<THREE.Group>(null);
  const state = useRef({ scale: 1, velocity: 0 });
  
  useFrame((_, delta) => {
    const target = hovered ? 1.05 : 1.0;
    const dt = Math.min(delta, 0.1);
    const tension = 200;
    const friction = 20;
    const displacement = target - state.current.scale;
    const springForce = displacement * tension;
    const dampingForce = -state.current.velocity * friction;
    state.current.velocity += (springForce + dampingForce) * dt;
    state.current.scale += state.current.velocity * dt;
    
    if (groupRef.current) {
      groupRef.current.scale.setScalar(state.current.scale);
    }
  });
  
  return groupRef;
}
