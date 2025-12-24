import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import ChristmasTree from './components/ChristmasTree';  // Adjust if needed
import './index.css';

function App() {
  const [state, setState] = useState<'SCATTERED' | 'TREE_SHAPE'>('TREE_SHAPE');
  const [personName, setPersonName] = useState('');

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
        <button className="toggle-button" onClick={() => setState(prev => prev === 'SCATTERED' ? 'TREE_SHAPE' : 'SCATTERED')}>
          {state === 'TREE_SHAPE' ? `Reveal "Merry Christmas ${displayName}"` : 'Reform the Luxurious Tree'}
        </button>
        <p className="instruction">Enter a name, then click to scatter into personalized greeting!</p>
      </div>

      <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
        <color attach="background" args={['#000800']} />
        <ambientLight intensity={1} color="#ffd700" />
        <pointLight position={[10, 10, 10]} intensity={3} color="#ffd700" />
        <Stars radius={100} count={7000} factor={5} fade />
        <ChristmasTree state={state} personName={displayName} />
        <OrbitControls autoRotate autoRotateSpeed={0.5} />
        <EffectComposer>
          <Bloom intensity={2} luminanceThreshold={0.05} />
        </EffectComposer>
      </Canvas>
    </>
  );
}

export default App;
