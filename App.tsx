import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import ChristmasTree from './components/ChristmasTree';  // This exists!
import './index.css';

function App() {
  const [state, setState] = useState<'SCATTERED' | 'TREE_SHAPE'>('TREE_SHAPE'); // Start with tree
  const [personName, setPersonName] = useState('Tom');

  const displayName = personName.trim() || 'Tom';

  return (
    <>
      <div className="ui-overlay">
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter a name (e.g. Tom)"
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
          />
        </div>

        <button
          className="toggle-button"
          onClick={() => setState(prev => prev === 'SCATTERED' ? 'TREE_SHAPE' : 'SCATTERED')}
        >
          {state === 'TREE_SHAPE' 
            ? `Scatter into "Merry Christmas ${displayName}"` 
            : 'Reform the Luxurious Tree'}
        </button>

        <p className="instruction">
          Enter a name, then click to morph the tree into your personalized golden greeting!
        </p>
      </div>

      <Canvas camera={{ position: [0, 5, 20], fov: 45 }}>
        <color attach="background" args={['#000800']} />
        <ambientLight intensity={0.8} color="#ffd700" />
        <pointLight position={[10, 10, 10]} intensity={4} color="#ffd700" />
        <pointLight position={[-10, 10, -10]} intensity={2} color="#ffd700" />
        <Stars radius={100} count={8000} factor={6} fade speed={2} />
        <ChristmasTree state={state} personName={displayName.toUpperCase()} />
        <OrbitControls autoRotate autoRotateSpeed={0.3} enableZoom={true} minDistance={10} maxDistance={40} />
        <EffectComposer>
          <Bloom luminanceThreshold={0.05} luminanceSmoothing={0.9} intensity={2.5} radius={0.8} />
        </EffectComposer>
      </Canvas>
    </>
  );
}

export default App;
