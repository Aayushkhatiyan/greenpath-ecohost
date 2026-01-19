import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, MeshDistortMaterial, Environment, OrbitControls, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

interface Quiz3DExplanationProps {
  isCorrect: boolean;
  explanation: string;
  onAnimationComplete?: () => void;
}

const CorrectSymbol = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef}>
        {/* Glowing sphere */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[1.5, 32, 32]} />
          <MeshDistortMaterial
            color="#2dd4bf"
            envMapIntensity={0.4}
            clearcoat={1}
            clearcoatRoughness={0}
            metalness={0.1}
            distort={0.2}
            speed={2}
          />
        </mesh>
        
        {/* Checkmark */}
        <mesh position={[0, 0, 0.5]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.3, 1.2, 0.2]} />
          <meshStandardMaterial color="#ffffff" emissive="#2dd4bf" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0.4, -0.3, 0.5]} rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.3, 0.7, 0.2]} />
          <meshStandardMaterial color="#ffffff" emissive="#2dd4bf" emissiveIntensity={0.5} />
        </mesh>
        
        <Sparkles count={30} scale={4} size={3} speed={0.5} color="#2dd4bf" />
      </group>
    </Float>
  );
};

const IncorrectSymbol = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 3) * 0.05;
    }
  });

  return (
    <Float speed={3} rotationIntensity={0.3} floatIntensity={0.3}>
      <group ref={groupRef}>
        {/* Pulsing sphere */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[1.5, 32, 32]} />
          <MeshDistortMaterial
            color="#ef4444"
            envMapIntensity={0.4}
            clearcoat={1}
            clearcoatRoughness={0}
            metalness={0.1}
            distort={0.3}
            speed={3}
          />
        </mesh>
        
        {/* X mark */}
        <mesh position={[0, 0, 0.5]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.25, 1.5, 0.2]} />
          <meshStandardMaterial color="#ffffff" emissive="#ef4444" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.5]} rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.25, 1.5, 0.2]} />
          <meshStandardMaterial color="#ffffff" emissive="#ef4444" emissiveIntensity={0.5} />
        </mesh>
        
        <Sparkles count={20} scale={4} size={2} speed={1} color="#ef4444" />
      </group>
    </Float>
  );
};

const ExplanationText = ({ text, isCorrect }: { text: string; isCorrect: boolean }) => {
  // Truncate text for 3D display
  const displayText = text.length > 80 ? text.substring(0, 77) + '...' : text;
  
  return (
    <Text
      position={[0, -2.5, 0]}
      fontSize={0.2}
      maxWidth={5}
      lineHeight={1.4}
      color={isCorrect ? '#2dd4bf' : '#ef4444'}
      textAlign="center"
      anchorX="center"
      anchorY="middle"
    >
      {displayText}
    </Text>
  );
};

const Scene = ({ isCorrect, explanation }: { isCorrect: boolean; explanation: string }) => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color={isCorrect ? '#2dd4bf' : '#ef4444'} />
      
      {isCorrect ? <CorrectSymbol /> : <IncorrectSymbol />}
      <ExplanationText text={explanation} isCorrect={isCorrect} />
      
      <Environment preset="city" />
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        autoRotate
        autoRotateSpeed={1}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
      />
    </>
  );
};

const Quiz3DExplanation: React.FC<Quiz3DExplanationProps> = ({ isCorrect, explanation }) => {
  return (
    <div className="w-full h-64 rounded-xl overflow-hidden bg-gradient-to-b from-background/50 to-background">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Scene isCorrect={isCorrect} explanation={explanation} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Quiz3DExplanation;
