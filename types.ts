import * as THREE from 'three';
import { ThreeElements } from '@react-three/fiber';

export enum TreeState {
  SCATTERED = 'SCATTERED',
  TREE_SHAPE = 'TREE_SHAPE',
}

export interface ParticleData {
  id: number;
  // Position in Tree form
  treePos: THREE.Vector3;
  treeRot: THREE.Euler;
  treeScale: THREE.Vector3;
  // Position in Scattered form
  scatterPos: THREE.Vector3;
  scatterRot: THREE.Euler;
  scatterScale: THREE.Vector3;
  // Color variation
  color: THREE.Color;
}

// Extend global JSX namespace to include Three.js elements (mesh, group, etc.)
declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}