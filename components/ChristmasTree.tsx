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
  const count = 8000; // Total particles
  const meshRef = useRef<InstancedMesh>(null);

  // Simple letter segment definitions (capital letters, line segments)
  const letterSegments: Record<string, Vector3[][]> = {
    'M': [[[0,0,0],[0,4,0],[1,6,0],[2,4,0],[2,0,0]], [[0,4,0],[1,5,0]], [[2,4,0],[1,5,0]]],
    'E': [[[0,0,0],[0,6,0]], [[0,0,0],[3,0,0]], [[0,3,0],[2.5,3,0]], [[0,6,0],[3,6,0]]],
    'R': [[[0,0,0],[0,6,0]], [[0,6,0],[3,6,0]], [[0,3,0],[2.5,3,0]], [[0,4,0],[2,2,0],[3,0,0]]],
    'Y': [[[0,6,0],[1.5,3,0],[3,6,0]], [[1.5,3,0],[1.5,0,0]]],
    'C': [[[3,6,0],[1,6,0],[0,5,0],[0,1,0],[1,0,0],[3,0,0]]],
    'H': [[[0,0,0],[0,6,0]], [[0,3,0],[3,3,0]], [[3,0,0],[3,6,0]]],
    'I': [[[0,6,0],[3,6,0]], [[1.5,6,0],[1.5,0,0]], [[0,0,0],[3,0,0]]],
    'S': [[[3,6,0],[1,6,0],[0,4.5,0],[2,3,0],[3,1.5,0],[1,0,0],[0,0,0]]],
    'T': [[[0,6,0],[3,6,0]], [[1.5,6,0],[1.5,0,0]]],
    'A': [[[0,0,0],[1.5,6,0],[3,0,0]], [[0,3,0],[3,3,0]]],
    // Add more if needed, but this covers "MERRY CHRISTMAS"
  };

  const { treePositions, textPositions } = useMemo(() => {
    const treePos: Vector3[] = [];
    const textPos: Vector3[] = [];

    // Tree positions (conical)
    const treeHeight = 8;
    const treeRadius = 3.5;
    for (let i = 0; i < count; i++) {
      const y = Math.random() * treeHeight - treeHeight / 2;
      const radiusAtY = treeRadius * (1 - (y + treeHeight / 2) / treeHeight);
      const angle = Math.random() * Math.PI * 2;
      treePos.push(new Vector3(radiusAtY * Math.cos(angle), y, radiusAtY * Math.sin(angle)));
    }

    // Text positions
    const fullText = `MERRY CHRISTMAS ${personName.toUpperCase()}`.trim();
    let offsetX = -20; // Start left
    const letterSpacing = 5;
    const scale = 0.8;

    for (const char of fullText) {
      if (char === ' ') {
        offsetX += letterSpacing;
        continue;
      }
      const segments = letterSegments[char] || [];
      for (const seg of segments) {
        for (const p of seg) {
          if (textPos.length >= count) break;
          textPos.push(new Vector3(
            (p.x * scale + offsetX),
            p.y * scale - 3, // Center vertically
            (Math.random() - 0.5) * 2 // Slight depth variation
          ));
        }
      }
      offsetX += letterSpacing * 4;
    }

    // Fill remaining with random positions if text uses fewer particles
    while (textPos.length < count) {
      textPos.push(new Vector3(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10
      ));
    }

    return { treePositions: treePos, textPositions: textPos };
  }, [personName, count]);

  const currentPositions = useMemo(() => treePositions.map(p => p.clone()), [treePositions]);

  useEffect(() => {
    const targets = state === 'SCATTERED' ? textPositions : treePositions;
    currentPositions.forEach((pos, i) => {
      gsap.to(pos, {
        x: targets[i].x,
        y: targets[i].y,
        z: targets[i].z,
        duration: 3 + Math.random() * 1.5,
        delay: Math.random() * 0.5,
        ease: 'power3.inOut',
      });
    });
  }, [state, textPositions, treePositions, currentPositions]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const matrix = new Matrix4();
    const rot = new Euler();

    for (let i = 0; i < count; i++) {
      const pos = currentPositions[i];
      if (state === 'SCATTERED') {
        pos.x += Math.sin(Date.now() * 0.0005 + i) * 0.003 * delta * 60;
        pos.y += Math.cos(Date.now() * 0.0004 + i) * 0.002 * delta * 60;
      }
      rot.set(
        Math.random() * Math.PI,
        Date.now() * 0.0002 + i * 0.1,
        0
      );
      matrix.compose(pos, rot.toVector3(), new Vector3(0.08, 0.08, 0.08));
      meshRef.current.setMatrixAt(i, matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  // Golden star on top (visible in tree state)
  return (
    <>
      {state === 'TREE_SHAPE' && (
        <mesh position={[0, 4.5, 0]}>
          <coneGeometry args={[0.8, 2, 5]} />
          <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={2} metalness={0.9} roughness={0.1} />
        </mesh>
      )}
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <dodecahedronGeometry args={[0.15]} />
        <meshStandardMaterial color="#004d00" metalness={0.3} roughness={0.6} emissive="#ffd700" emissiveIntensity={0.3} />
      </instancedMesh>
    </>
  );
};

export default ChristmasTree;
