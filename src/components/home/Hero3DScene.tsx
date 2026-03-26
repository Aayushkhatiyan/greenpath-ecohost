import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sparkles, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';

const FloatingLeaf = ({ position, scale, speed }: { position: [number, number, number]; scale: number; speed: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed) * 0.3;
      meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * speed * 0.7) * 0.2;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <coneGeometry args={[0.5, 1, 4]} />
      <MeshWobbleMaterial
        color="#2dd4bf"
        emissive="#2dd4bf"
        emissiveIntensity={0.3}
        factor={0.3}
        speed={speed}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
};

const GlowingSphere = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.8, 1]} />
        <MeshDistortMaterial
          color="#2dd4bf"
          envMapIntensity={0.5}
          clearcoat={1}
          clearcoatRoughness={0}
          metalness={0.3}
          roughness={0.2}
          distort={0.25}
          speed={2}
          transparent
          opacity={0.6}
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
        emissiveIntensity={0.4}
        transparent
        opacity={0.4}
        wireframe
      />
    </mesh>
  );
};

const ParticleField = () => {
  const points = useMemo(() => {
    const positions = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return positions;
  }, []);

  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
      ref.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={200}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#2dd4bf"
        size={0.03}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#2dd4bf" />
      <pointLight position={[-5, -5, 5]} intensity={0.5} color="#8b5cf6" />
      <pointLight position={[0, 3, -5]} intensity={0.3} color="#2dd4bf" />

      <GlowingSphere />
      
      <OrbitingRing radius={2.8} speed={0.3} color="#2dd4bf" thickness={0.02} />
      <OrbitingRing radius={3.5} speed={-0.2} color="#8b5cf6" thickness={0.015} />
      <OrbitingRing radius={4.2} speed={0.15} color="#2dd4bf" thickness={0.01} />

      <FloatingLeaf position={[-2.5, 1.5, -1]} scale={0.4} speed={1.2} />
      <FloatingLeaf position={[2.8, -1, -2]} scale={0.3} speed={0.8} />
      <FloatingLeaf position={[-1.5, -2, 0.5]} scale={0.35} speed={1.5} />
      <FloatingLeaf position={[1.8, 2.2, -1.5]} scale={0.25} speed={1} />

      <ParticleField />
      <Sparkles count={50} scale={8} size={2} speed={0.3} color="#2dd4bf" />
      <Sparkles count={30} scale={6} size={1.5} speed={0.5} color="#8b5cf6" />
    </>
  );
};

const Hero3DScene: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
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
