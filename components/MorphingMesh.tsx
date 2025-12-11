import React, { useLayoutEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { ParticleData, TreeState } from '../types';
import { ANIMATION_SPEED } from '../constants';

interface MorphingMeshProps {
  data: ParticleData[];
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  targetState: TreeState;
}

export const MorphingMesh: React.FC<MorphingMeshProps> = ({ 
  data, 
  geometry, 
  material, 
  targetState 
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Initialize positions
  useLayoutEffect(() => {
    if (!meshRef.current) return;
    
    // Set colors once
    data.forEach((particle, i) => {
      meshRef.current!.setColorAt(i, particle.color);
    });
    meshRef.current.instanceColor!.needsUpdate = true;
  }, [data]);

  // Frame loop for animation
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Determine target factor (0 = Scatter, 1 = Tree)
    // We don't track a global 'progress' state variable to avoid React re-renders.
    // Instead, we interpolate each instance towards its target.
    
    const isTree = targetState === TreeState.TREE_SHAPE;
    const lerpFactor = THREE.MathUtils.clamp(delta * ANIMATION_SPEED, 0, 1);

    let needsUpdate = false;

    for (let i = 0; i < data.length; i++) {
      const p = data[i];
      
      // Get current instance matrix
      meshRef.current.getMatrixAt(i, dummy.matrix);
      dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);

      // Define Targets
      const targetPos = isTree ? p.treePos : p.scatterPos;
      const targetRotEuler = isTree ? p.treeRot : p.scatterRot;
      const targetScale = isTree ? p.treeScale : p.scatterScale;
      
      const targetQuat = new THREE.Quaternion().setFromEuler(targetRotEuler);

      // Interpolate
      // Using simple lerp for smooth visual transition
      // For 2000 particles this is performant enough on modern devices
      
      // Position Lerp
      dummy.position.lerp(targetPos, lerpFactor);
      
      // Rotation Slerp
      dummy.quaternion.slerp(targetQuat, lerpFactor);
      
      // Scale Lerp
      dummy.scale.lerp(targetScale, lerpFactor);

      // Update Matrix
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      
      // Optimization: Stop updating if very close? 
      // For this demo, continuous update ensures fluidity if user toggles rapidly.
      needsUpdate = true;
    }

    if (needsUpdate) {
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
    
    // Rotate the whole tree slowly when assembled
    if (isTree) {
       meshRef.current.rotation.y += delta * 0.1;
    } else {
       // Slow random drift could be added here for scattered state, 
       // but keeping it static relative to world is fine for the effect.
       meshRef.current.rotation.y *= 0.95; // Dampen rotation back to 0
    }
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, data.length]}
      castShadow
      receiveShadow
    />
  );
};
