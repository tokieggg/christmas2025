import React from 'react';
import { Sparkles } from '@react-three/drei';
import '../types';

export const EnvironmentDecor: React.FC = () => {
  return (
    <group>
        {/* Cinematic Dust */}
        <Sparkles 
            count={200} 
            scale={20} 
            size={4} 
            speed={0.4} 
            opacity={0.5} 
            color="#FFD700"
        />

        {/* Reflective Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -7, 0]} receiveShadow>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial 
                color="#000000" 
                roughness={0.1} 
                metalness={0.8}
            />
        </mesh>
    </group>
  );
};