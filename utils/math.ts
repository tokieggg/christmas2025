import * as THREE from 'three';
import { ParticleData } from '../types';
import { COLORS, TREE_CONFIG } from '../constants';

// Helper to generate random position in a sphere
const randomInSphere = (radius: number): THREE.Vector3 => {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const r = Math.cbrt(Math.random()) * radius;
  const sinPhi = Math.sin(phi);
  return new THREE.Vector3(
    r * sinPhi * Math.cos(theta),
    r * sinPhi * Math.sin(theta),
    r * Math.cos(phi)
  );
};

// Generate data for Pine Needles (The green cone body)
export const generateNeedles = (count: number): ParticleData[] => {
  const particles: ParticleData[] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    // Tree Position: Fibonacci Spiral on Cone
    const y = - (TREE_CONFIG.HEIGHT / 2) + (i / count) * TREE_CONFIG.HEIGHT;
    const progress = (y + TREE_CONFIG.HEIGHT / 2) / TREE_CONFIG.HEIGHT; // 0 to 1
    const radius = TREE_CONFIG.RADIUS_BOTTOM * (1 - progress);
    const theta = i * goldenAngle;
    
    const x = radius * Math.cos(theta);
    const z = radius * Math.sin(theta);

    const treePos = new THREE.Vector3(x, y, z);
    
    // Rotate needles to face outward/upward
    const treeRot = new THREE.Euler(
      Math.random() * 0.5 - 0.25, // Slight X variation
      -theta, // Face outward Y
      Math.PI / 4 + (Math.random() * 0.2) // Angle up Z
    );

    const scaleBase = 1 - (progress * 0.5); // Smaller at top
    const treeScale = new THREE.Vector3(0.1, 0.8 * scaleBase, 0.1);

    // Scattered Position
    const scatterPos = randomInSphere(TREE_CONFIG.SCATTER_RADIUS);
    const scatterRot = new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    const scatterScale = new THREE.Vector3(0.1, 0.5, 0.1);

    // Color: Mix of emeralds
    const color = Math.random() > 0.5 ? COLORS.EMERALD_DEEP : COLORS.EMERALD_LIGHT;
    
    particles.push({
      id: i,
      treePos,
      treeRot,
      treeScale,
      scatterPos,
      scatterRot,
      scatterScale,
      color: color.clone().offsetHSL(0, 0, Math.random() * 0.1 - 0.05), // Subtle variation
    });
  }
  return particles;
};

// Generate data for Ornaments (Gold spheres)
export const generateOrnaments = (count: number): ParticleData[] => {
  const particles: ParticleData[] = [];
  
  for (let i = 0; i < count; i++) {
    // Tree Position: Random distribution on surface of cone
    const y = (Math.random() * TREE_CONFIG.HEIGHT) - (TREE_CONFIG.HEIGHT / 2);
    const progress = (y + TREE_CONFIG.HEIGHT / 2) / TREE_CONFIG.HEIGHT;
    const maxRadiusAtY = TREE_CONFIG.RADIUS_BOTTOM * (1 - progress);
    // Bias slightly outside to sit on leaves
    const radius = maxRadiusAtY + 0.2 + (Math.random() * 0.3); 
    const theta = Math.random() * Math.PI * 2;

    const x = radius * Math.cos(theta);
    const z = radius * Math.sin(theta);
    
    const treePos = new THREE.Vector3(x, y, z);
    const treeRot = new THREE.Euler(0, 0, 0);
    const s = 0.25 + Math.random() * 0.25;
    const treeScale = new THREE.Vector3(s, s, s);

    // Scattered
    const scatterPos = randomInSphere(TREE_CONFIG.SCATTER_RADIUS * 1.2);
    const scatterRot = new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    const scatterScale = new THREE.Vector3(s, s, s);

    // Color: Gold variations
    const color = Math.random() > 0.3 ? COLORS.GOLD_METALLIC : COLORS.GOLD_ROSE;

    particles.push({
      id: i + 10000,
      treePos,
      treeRot,
      treeScale,
      scatterPos,
      scatterRot,
      scatterScale,
      color,
    });
  }

  return particles;
};
