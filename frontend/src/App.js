import { ReactFlowProvider } from 'reactflow';
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import { HistoryControls } from './HistoryControls';

const App = () => (
  <ReactFlowProvider>
    <div className="vs-app">
      <header className="vs-header">
        <div className="vs-brand">
          <div className="vs-brand-mark">VS</div>
          <div className="vs-brand-text">
            <div className="vs-brand-title">
              <span className="vs-title-full">VectorShift Pipeline</span>
              <span className="vs-title-short">VectorShift</span>
            </div>
            <div className="vs-brand-subtitle">Visual workflow editor</div>
          </div>
        </div>
        <div className="vs-actions">
          <HistoryControls />
          <SubmitButton />
        </div>
      </header>
      <PipelineToolbar />
      <PipelineUI />
    </div>
  </ReactFlowProvider>
);

export default App;
