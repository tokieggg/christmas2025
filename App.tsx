import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import ChristmasTree from './components/ChristmasTree';
import './App.css'; // We'll add some CSS

function App() {
  const [state, setState] = useState<'SCATTERED' | 'TREE_SHAPE'>('TREE_SHAPE');
  const [personName, setPersonName] = useState('Mary'); // Default example

  return (
    <>
      <div className="ui-overlay">
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter a name (e.g. Mary)"
            value={personName}
            onChange={(e) => setPersonName(e.target.value.trim() || 'Mary')}
            onKeyDown={(e) => e.key === 'Enter' && setState('SCATTERED')}
          />
          <button onClick={() => setPersonName(personName || 'Mary')}>
            Apply Name
          </button>
        </div>

        <button
          className="toggle-button"
          onClick={() => setState(prev => prev === 'SCATTERED' ? 'TREE_SHAPE' : 'SCATTERED')}
        >
          {state === 'TREE_SHAPE' ? `Reveal "Merry Christmas ${personName}"` : 'Form Christmas Tree'}
        </button>

        <p className="instruction">
          {state === 'TREE_SHAPE'
            ? 'Click the button to scatter into your personalized greeting'
            : 'Click again to reform the luxurious tree'}
        </p>
      </div>

      <Canvas camera={{ position: [0, 0, 12], fov: 50 }}>
        <color attach="background" args={['#001a00']} />
        <ambientLight intensity={0.4} color="#ffd700" />
        <pointLight position={[0, 10, 10]} intensity={2} color="#ffd700" />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
        <ChristmasTree state={state} personName={personName} />
        <OrbitControls enablePan={false} minDistance={8} maxDistance={20} />
        <Environment preset="night" />
        <EffectComposer>
          <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.9} intensity={1.5} />
        </EffectComposer>
      </Canvas>
    </>
  );
}

export default App;
