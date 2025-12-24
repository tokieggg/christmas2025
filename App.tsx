import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import ChristmasTree from './components/ChristmasTree';

function App() {
  const [state, setState] = useState<'SCATTERED' | 'TREE_SHAPE'>('TREE_SHAPE'); // Start with tree visible!
  const [personName, setPersonName] = useState('');

  const displayName = personName.trim() || 'You';

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
            ? `Reveal "Merry Christmas ${displayName}"`
            : 'Reform the Luxurious Tree'}
        </button>

        <p className="instruction">
          Enter a name above, then click the button to scatter the tree into your personalized golden greeting!
        </p>
      </div>

      <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
        <color attach="background" args={['#000800']} />
        <ambientLight intensity={0.6} color="#ffd700" />
        <pointLight position={[10, 10, 10]} intensity={3} color="#ffd700" />
        <pointLight position={[-10, -10, 10]} intensity={1} color="#004d00" />
        <Stars radius={100} depth={50} count={7000} factor={5} saturation={0} fade speed={1} />
        
        <ChristmasTree state={state} personName={displayName} />
        
        <OrbitControls 
          enablePan={false} 
          minDistance={10} 
          maxDistance={30} 
          autoRotate 
          autoRotateSpeed={0.5}
        />
        
        <Environment preset="night" />
        
        <EffectComposer>
          <Bloom 
            luminanceThreshold={0.05} 
            luminanceSmoothing={0.9} 
            intensity={2} 
            radius={0.8}
          />
        </EffectComposer>
      </Canvas>
    </>
  );
}

export default App;
