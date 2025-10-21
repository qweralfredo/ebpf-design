import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import EBPFFlowBuilder from './pages/EBPFFlowBuilder';
import './styles/global.css';

function App() {
  return (
    <div className="app">
      <ReactFlowProvider>
        <EBPFFlowBuilder />
      </ReactFlowProvider>
    </div>
  );
}

export default App;