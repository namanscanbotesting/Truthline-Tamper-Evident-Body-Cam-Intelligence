'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { motionTokens } from '@/lib/styles/tokens';

/**
 * VerificationSeal3D - The signature 3D element for Truthline.
 * 
 * An abstract, low-poly rotating "verification seal/shield" made of 
 * hash-chain visual (small connected blocks/links forming a ring).
 * 
 * Used in:
 * - Hero section (slow rotation)
 * - /trust page (exploded view on scroll)
 * 
 * Performance notes:
 * - Low-poly geometry only (no heavy GLTF imports)
 * - Lazy-loaded via dynamic import in pages
 * - Respects prefers-reduced-motion
 */

interface VerificationSealProps {
  autoRotate?: boolean;
  exploded?: boolean;
  progress?: number; // 0-1, for exploded view animation
}

export function VerificationSeal({ 
  autoRotate = true, 
  exploded = false,
  progress = 0 
}: VerificationSealProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  // Create hash chain links (blocks arranged in a circle)
  const linkCount = 12;
  const radius = 2;
  
  const linkPositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    for (let i = 0; i < linkCount; i++) {
      const angle = (i / linkCount) * Math.PI * 2;
      positions.push([
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        0,
      ]);
    }
    return positions;
  }, []);

  return (
    <Canvas
      className="w-full h-full"
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 8]} />
      
      {/* Lighting - subtle, not dramatic */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#38bdf8" />
      <directionalLight position={[-5, -5, -5]} intensity={0.3} color="#64748b" />
      
      <group ref={groupRef} rotation={[0, 0, prefersReducedMotion ? 0 : Math.PI / 8]}>
        {/* Central hub */}
        <mesh position={[0, 0, exploded ? progress * 0.5 : 0]}>
          <icosahedronGeometry args={[0.8, 0]} />
          <meshStandardMaterial 
            color="#0f172a" 
            emissive="#1e293b"
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        
        {/* Hash chain links */}
        {linkPositions.map((pos, i) => {
          const explodeOffset = exploded ? progress * 0.8 : 0;
          const direction = new THREE.Vector3(...pos).normalize();
          const explodePos = direction.multiplyScalar(explodeOffset);
          
          return (
            <mesh 
              key={i}
              position={[
                pos[0] + (explodePos?.x || 0),
                pos[1] + (explodePos?.y || 0),
                pos[2] + (explodePos?.z || 0),
              ]}
              rotation={[0, 0, (i / linkCount) * Math.PI * 2 + Math.PI / 2]}
            >
              <boxGeometry args={[0.4, 0.25, 0.15]} />
              <meshStandardMaterial 
                color="#38bdf8"
                emissive="#0ea5e9"
                emissiveIntensity={0.4}
                metalness={0.6}
                roughness={0.3}
              />
            </mesh>
          );
        })}
        
        {/* Connection rings (subtle) */}
        {!exploded && (
          <>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[radius, 0.02, 8, 32]} />
              <meshStandardMaterial 
                color="#1e293b" 
                transparent 
                opacity={0.5}
              />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.3]}>
              <torusGeometry args={[radius * 0.85, 0.01, 8, 32]} />
              <meshStandardMaterial 
                color="#334155" 
                transparent 
                opacity={0.3}
              />
            </mesh>
          </>
        )}
      </group>
      
      {/* Slow auto-rotation (disabled for reduced motion) */}
      {autoRotate && !prefersReducedMotion && (
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      )}
    </Canvas>
  );
}

/**
 * Lightweight version for hero background use
 */
export function VerificationSealHero() {
  return (
    <div className="absolute inset-0 opacity-20 pointer-events-none">
      <VerificationSeal autoRotate={!prefersReducedMotion()} />
    </div>
  );
}

// Helper to check reduced motion preference
function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
