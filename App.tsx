import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene } from './Scene';  // This uses the advanced morphing system
import './index.css';

function App() {
  const [treeState, setTreeState] = useState<'SCATTERED' | 'TREE_SHAPE'>('TREE_SHAPE');
  const [personName, setPersonName] = useState('Tom');

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
          onClick={() => setTreeState(prev => prev === 'SCATTERED' ? 'TREE_SHAPE' : 'SCATTERED')}
        >
          {treeState === 'TREE_SHAPE' 
            ? `Deconstruct into Scatter` 
            : 'Assemble Luxurious Tree'}
        </button>

        <p className="instruction">
          Click the button to toggle between the opulent assembled Christmas tree and scattered particles!
        </p>
      </div>

      <Canvas shadows camera={{ position: [0, 0, 20], fov: 50 }}>
        <Scene treeState={treeState} />
      </Canvas>
    </>
  );
}

export default App;
