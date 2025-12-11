import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene } from './components/Scene';
import { UI } from './components/UI';
import { TreeState } from './types';

const App: React.FC = () => {
  const [treeState, setTreeState] = useState<TreeState>(TreeState.TREE_SHAPE);

  const toggleState = () => {
    setTreeState((prev) => 
      prev === TreeState.TREE_SHAPE ? TreeState.SCATTERED : TreeState.TREE_SHAPE
    );
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas
          shadows
          dpr={[1, 2]} // Quality scaling for high-res screens
          gl={{ 
            antialias: false, // Post-processing handles AA better usually, or we turn it off for perf with Bloom
            toneMapping: 3, // ACESFilmic
            toneMappingExposure: 1.2
          }}
          camera={{ position: [0, 0, 25], fov: 45 }}
        >
          <Scene treeState={treeState} />
        </Canvas>
      </div>

      {/* UI Overlay */}
      <UI currentState={treeState} onToggle={toggleState} />
    </div>
  );
};

export default App;
