import { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  useReactFlow,
} from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { nodeTypes } from './nodes';

import 'reactflow/dist/style.css';

const GRID_SIZE = 20;
const proOptions = { hideAttribution: true };
const fitViewOptions = { padding: 0.18, duration: 200 };

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const flow = useReactFlow();
  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useStore(selector, shallow);

  const hasFittedRef = useRef(false);

  useEffect(() => {
    if (hasFittedRef.current || nodes.length === 0) return;
    hasFittedRef.current = true;
    // Wait long enough for StrictMode double-mount and ReactFlow's internal
    // node measurement to settle, then click the canvas's own fit button.
    // Going via the button is the most reliable path because the button's
    // handler always reads the freshest viewport state internally.
    setTimeout(() => {
      const fitBtn = document.querySelector('.react-flow__controls-fitview');
      if (fitBtn) fitBtn.click();
      else flow.fitView(fitViewOptions);
    }, 600);
  }, [flow, nodes.length]);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      if (!reactFlowInstance) return;

      const transferData = event.dataTransfer.getData('application/reactflow');
      if (!transferData) return;

      let appData;
      try {
        appData = JSON.parse(transferData);
      } catch {
        return;
      }

      const type = appData?.nodeType;
      if (!type) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const nodeID = getNodeID(type);
      addNode({
        id: nodeID,
        type,
        position,
        data: { id: nodeID, nodeType: type },
      });
    },
    [reactFlowInstance, addNode, getNodeID]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const isEmpty = nodes.length === 0;

  return (
    <div className="vs-canvas-wrapper">
      <div ref={reactFlowWrapper} className="vs-canvas">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onInit={setReactFlowInstance}
          nodeTypes={nodeTypes}
          proOptions={proOptions}
          snapGrid={[GRID_SIZE, GRID_SIZE]}
          connectionLineType="smoothstep"
          deleteKeyCode={['Backspace', 'Delete']}
          fitView
          fitViewOptions={fitViewOptions}
          panOnDrag
          panOnScroll={false}
          zoomOnPinch
          zoomOnScroll
          zoomOnDoubleClick
          minZoom={0.2}
          maxZoom={2}
        >
          <Background color="#E5E7EB" gap={GRID_SIZE} />
          <Controls showInteractive={false} />
          <MiniMap
            nodeStrokeWidth={3}
            pannable
            zoomable
            maskColor="rgba(249, 250, 251, 0.6)"
          />
        </ReactFlow>
      </div>
      {isEmpty && (
        <div className="vs-empty-state">
          <div className="vs-empty-card">
            <div className="vs-empty-title">Your canvas is empty</div>
            Drag a node from the toolbar above to get started. Connect nodes to
            build a pipeline, then click <strong>Submit</strong> to validate it.
          </div>
        </div>
      )}
      <div className="vs-touch-hint">
        Drag with one finger to pan · pinch to zoom · use <span className="vs-fit-icon">⛶</span> to fit
      </div>
    </div>
  );
};
