import React from 'react';
import { TreeState } from '../types';

interface UIProps {
  currentState: TreeState;
  onToggle: () => void;
}

export const UI: React.FC<UIProps> = ({ currentState, onToggle }) => {
  const isTree = currentState === TreeState.TREE_SHAPE;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col p-8 z-10">
      {/* Header */}
      <div className="flex flex-col items-start">
        <h1 className="text-4xl md:text-6xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 drop-shadow-lg tracking-tighter">
          TOM INTERACTIVE
        </h1>
        <h2 className="text-emerald-500 font-light tracking-[0.5em] text-sm md:text-base mt-2 uppercase">
          Holiday Collection 2025
        </h2>
      </div>

      {/* Spacer to push controls down */}
      <div className="flex-grow" />

      {/* Controls */}
      <div className="flex flex-col items-center pointer-events-auto mb-12">
        <button
          onClick={onToggle}
          className={`
            group relative px-8 py-4 bg-black/40 backdrop-blur-md 
            border border-yellow-500/30 hover:border-yellow-400 
            transition-all duration-500 rounded-full overflow-hidden
          `}
        >
          <span className={`
            absolute inset-0 bg-yellow-500/10 translate-y-full 
            group-hover:translate-y-0 transition-transform duration-500
          `}></span>
          
          <span className="relative font-serif text-yellow-100 text-lg tracking-widest uppercase">
            {isTree ? "Deconstruct" : "Assemble Tree"}
          </span>
        </button>
        
        <p className="mt-4 text-emerald-600/60 text-xs font-mono">
          {isTree ? "Interactive State: ASSEMBLED" : "Interactive State: SCATTERED"}
        </p>
      </div>

      {/* Footer / Credits */}
      <div className="flex justify-between items-end text-yellow-500/40 text-xs font-mono">
        <div>
          <p>FIG. 01 — LUXURY PINE</p>
          <p>LAT: 90.00 N</p>
        </div>
        <div className="text-right">
          <p>REACT THREE FIBER</p>
          <p>HIGH FIDELITY RENDER</p>
        </div>
      </div>
    </div>
  );
};