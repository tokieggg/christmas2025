import { useRef, useEffect, useMemo } from 'react';
import { InstancedMesh, Vector3, Matrix4, Euler } from 'three';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';

type TreeMorphState = 'SCATTERED' | 'TREE_SHAPE';

interface ChristmasTreeProps {
  state: TreeMorphState;
  personName: string;
}

const ChristmasTree: React.FC<ChristmasTreeProps> = ({ state, personName }) => {
  const count = 12000; // More particles = clearer text & fuller tree
  const meshRef = useRef<InstancedMesh>(null);

  // Simple block-letter segments for reliability
  const letterSegments: Record<string, Vector3[][]> = {
    'M': [[[0,0,0],[0,6,0],[1.5,8,0],[3,6,0],[3,0,0]], [[1.5,4,0],[1.5,8,0]]],
    'E': [[[3,0,0],[0,0,0],[0,8,0],[3,8,0]], [[0,4,0],[2.5,4,0]]],
    'R': [[[0,0,0],[0,8,0],[2,8,0],[3,6,0],[2.5,4,0],[3,2,0]], [[1.5,4,0],[3,4,0]]],
    'Y': [[[0,8,0],[1.5,4,0],[3,8,0]], [[1.5,4,0],[1.5,0,0]]],

    'C': [[[3,8,0],[1,8,0],[0,7,0],[0,1,0],[1,0,0],[3,0,0]]],
    'H': [[[0,0,0],[0,8,0]], [[0,4,0],[3,4,0]], [[3,0,0],[3,8,0]]],
    'I': [[[0,8,0],[3,8,0]], [[1.5,8,0],[1.5,0,0]], [[0,0,0],[3,0,0]]],
    'S': [[[0,8,0],[1,8,0],[3,6,0],[2,4,0],[3,2,0],[1,0,0],[0,0,0]]],
    'T': [[[0,8,0],[3,8,0]], [[1.5,8,0],[1.5,0,0]]],
    'A': [[[0,0,0],[1.5,8,0],[3,0,0]], [[0,4,0],[3,4,0]]],
  };

  const { treePositions, textPositions, currentPositions } = useMemo(() => {
    const treePos: Vector3[] = [];
    const textPos: Vector3[] = [];
    const currPos: Vector3[] = [];

    // Tree: Conical Christmas tree
    const treeHeight = 10;
    const treeRadius = 4.5;
    for (let i = 0; i < count; i++) {
      const y = (Math.random() - 0.5) * treeHeight;
      const radiusAtY = treeRadius * (1 - Math.abs(y + treeHeight / 2) / treeHeight);
      const angle = Math.random() * Math.PI * 2;
      const x = radiusAtY * Math.cos(angle);
      const z = radiusAtY * Math.sin(angle);
      const pos = new Vector3(x, y, z);
      treePos.push(pos);
      currPos.push(pos.clone()); // Start in tree shape
    }

    // Text: "MERRY CHRISTMAS [Name]"
    const fullText = `MERRY CHRISTMAS ${personName.toUpperCase()}`;
    let offsetX = -45; // Center wide text
    const letterWidth = 10;
    const scale = 1.2;

    for (const char of fullText) {
      if (char === ' ') {
        offsetX += letterWidth;
        continue;
      }
      const segments = letterSegments[char] || [];
      for (const segment of segments) {
        for (let t = 0; t <= 20; t++) { // Sample points along each line
          if (textPos.length >= count) break;
          const ratio = t / 20;
          const x = segment[0].x + (segment[1].x - segment[0].x) * ratio;
          const y = segment[0].y + (segment[1].y - segment[0].y) * ratio;
          textPos.push(new Vector3(
            x * scale + offsetX,
            y * scale - 4,
            (Math.random() - 0.5) * 3
          ));
        }
      }
      offsetX += letterWidth;
    }

    // Fill remaining particles randomly around text
    while (textPos.length < count) {
      textPos.push(new Vector3(
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20
      ));
    }

    return { treePositions: treePos, textPositions: textPos, currentPositions: currPos };
  }, [personName]);

  // Morph animation
  useEffect(() => {
    const targets = state === 'SCATTERED' ? textPositions : treePositions;
    currentPositions.forEach((pos, i) => {
      gsap.to(pos, {
        x: targets[i].x,
        y: targets[i].y,
        z: targets[i].z,
        duration: 4,
        delay: Math.random() * 0.8,
        ease: 'power3.inOut',
      });
    });
  }, [state, textPositions, treePositions, currentPositions]);

  useFrame(() => {
    if (!meshRef.current) return;

    const matrix = new Matrix4();
    const rot = new Euler();

    for (let i = 0; i < count; i++) {
      const pos = currentPositions[i];

      // Gentle float in scattered mode
      if (state === 'SCATTERED') {
        pos.y += Math.sin(Date.now() * 0.001 + i) * 0.005;
      }

      rot.set(
        Math.PI / 2 + Math.random() * 0.5,
        Date.now() * 0.0003 + i * 0.05,
        0
      );

      matrix.compose(
        pos,
        rot.toVector3(),
        new Vector3(0.18, 0.18, 0.18) // Bigger, brighter particles
      );

      meshRef.current.setMatrixAt(i, matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      {/* Golden star on tree */}
      {state === 'TREE_SHAPE' && (
        <mesh position={[0, 6, 0]}>
          <coneGeometry args={[1.2, 3, 8]} />
          <meshStandardMaterial 
            color="#ffd700" 
            emissive="#ffd700" 
            emissiveIntensity={4} 
            metalness={1} 
            roughness={0.1} 
          />
        </mesh>
      )}

      {/* Particles: Emerald with golden glow */}
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <dodecahedronGeometry args={[0.2]} />
        <meshStandardMaterial
          color="#004d20"
          emissive="#ffd700"
          emissiveIntensity={0.8}
          metalness={0.6}
          roughness={0.4}
        />
      </instancedMesh>
    </>
  );
};

export default ChristmasTree;
