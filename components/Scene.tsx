import React, { useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { MorphingMesh } from './MorphingMesh';
import { EnvironmentDecor } from './EnvironmentDecor';
import { generateNeedles, generateOrnaments } from '../utils/math';
import { TreeState, ParticleData } from '../types';
import { TREE_CONFIG, COLORS } from '../constants';

interface SceneProps {
  treeState: TreeState;
}

export const Scene: React.FC<SceneProps> = ({ treeState }) => {
  // Generate Data Once
  const needlesData = useMemo(() => generateNeedles(TREE_CONFIG.NEEDLE_COUNT), []);
  const ornamentsData = useMemo(() => generateOrnaments(TREE_CONFIG.ORNAMENT_COUNT), []);

  // Geometries & Materials
  // 1. Needles: A simple thin box looks more stylized and expensive than a cone
  const needleGeometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const needleMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    roughness: 0.4,
    metalness: 0.1,
    flatShading: false,
  }), []);

  // 2. Ornaments: Spheres
  const ornamentGeometry = useMemo(() => new THREE.SphereGeometry(1, 32, 32), []);
  const ornamentMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    roughness: 0.15,
    metalness: 1.0,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
  }), []);

  return (
    <>
      <color attach="background" args={['#000500']} />
      
      {/* Cinematic Camera Control */}
      <OrbitControls 
        minPolarAngle={Math.PI / 4} 
        maxPolarAngle={Math.PI / 1.8}
        minDistance={10}
        maxDistance={40}
        enablePan={false}
        autoRotate={treeState === TreeState.TREE_SHAPE}
        autoRotateSpeed={0.5}
      />

      {/* Lighting - Critical for the "Luxury" look */}
      <ambientLight intensity={0.2} color="#002419" />
      
      {/* Main Key Light */}
      <spotLight 
        position={[20, 20, 10]} 
        angle={0.3} 
        penumbra={1} 
        intensity={2000} 
        color="#fff5e6" 
        castShadow
        shadow-bias={-0.0001}
      />
      
      {/* Rim Light (Gold) */}
      <spotLight 
        position={[-20, 10, -10]} 
        angle={0.5} 
        penumbra={1} 
        intensity={1000} 
        color="#FFD700" 
      />

      {/* Fill Light from bottom (Emerald) */}
      <pointLight position={[0, -10, 0]} intensity={500} color="#004d33" distance={20} />

      {/* Environment Map for reflections */}
      <Environment preset="city" environmentIntensity={0.8} />

      {/* The Interactive Objects */}
      <group position={[0, 0, 0]}>
        <MorphingMesh 
          data={needlesData} 
          geometry={needleGeometry} 
          material={needleMaterial} 
          targetState={treeState}
        />
        <MorphingMesh 
          data={ornamentsData} 
          geometry={ornamentGeometry} 
          material={ornamentMaterial} 
          targetState={treeState}
        />
        
        {/* Star Top - Simple Glow Mesh */}
        <mesh position={[0, TREE_CONFIG.HEIGHT / 2 + 0.5, 0]}>
            <octahedronGeometry args={[0.8, 0]} />
            <meshBasicMaterial color="#FFF" toneMapped={false} />
        </mesh>
      </group>

      <EnvironmentDecor />

      {/* Post Processing for the "Glow" */}
      <EffectComposer disableNormalPass>
        <Bloom 
            luminanceThreshold={1} // Only very bright things glow
            mipmapBlur 
            intensity={1.5} 
            radius={0.6}
        />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </>
  );
};
