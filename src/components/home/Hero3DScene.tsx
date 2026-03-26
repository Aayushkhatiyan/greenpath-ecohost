import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const GlowingSphere = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2, 1]} />
        <MeshDistortMaterial
          color="#059669"
          envMapIntensity={0.6}
          clearcoat={1}
          clearcoatRoughness={0}
          metalness={0.4}
          roughness={0.15}
          distort={0.2}
          speed={1.5}
          transparent
          opacity={0.5}
        />
      </mesh>
    </Float>
  );
};

const OrbitingRing = ({ radius, speed, color, thickness }: { radius: number; speed: number; color: string; thickness: number }) => {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = state.clock.elapsedTime * speed;
      ringRef.current.rotation.y = state.clock.elapsedTime * speed * 0.6;
    }
  });

  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[radius, thickness, 16, 100]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        transparent
        opacity={0.35}
        wireframe
      />
    </mesh>
  );
};

const FloatingGem = ({ position, color, scale }: { position: [number, number, number]; color: string; scale: number }) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.5;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.7) * 0.3;
    }
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <octahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.4}
        transparent
        opacity={0.7}
        metalness={0.6}
        roughness={0.2}
      />
    </mesh>
  );
};

const ParticleField = () => {
  const points = useMemo(() => {
    const positions = new Float32Array(150 * 3);
    for (let i = 0; i < 150; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    return positions;
  }, []);

  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.015;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={150} array={points} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#059669" size={0.025} transparent opacity={0.5} sizeAttenuation />
    </points>
  );
};

const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.25} />
      <pointLight position={[5, 5, 5]} intensity={0.7} color="#059669" />
      <pointLight position={[-5, -5, 5]} intensity={0.4} color="#f59e0b" />
      <pointLight position={[0, 3, -5]} intensity={0.2} color="#059669" />

      <GlowingSphere />

      <OrbitingRing radius={3} speed={0.25} color="#059669" thickness={0.015} />
      <OrbitingRing radius={3.8} speed={-0.18} color="#f59e0b" thickness={0.012} />
      <OrbitingRing radius={4.5} speed={0.12} color="#059669" thickness={0.008} />

      <FloatingGem position={[-2.8, 1.5, -1]} color="#059669" scale={0.4} />
      <FloatingGem position={[3, -1, -2]} color="#f59e0b" scale={0.3} />
      <FloatingGem position={[-1.5, -2, 0.5]} color="#059669" scale={0.35} />
      <FloatingGem position={[2, 2.5, -1.5]} color="#f59e0b" scale={0.25} />

      <ParticleField />
      <Sparkles count={40} scale={8} size={1.5} speed={0.2} color="#059669" />
      <Sparkles count={25} scale={6} size={1} speed={0.4} color="#f59e0b" />
    </>
  );
};

const Hero3DScene: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <React.Suspense fallback={null}>
          <Scene />
        </React.Suspense>
      </Canvas>
    </div>
  );
};

export default Hero3DScene;
