import { useState } from 'react';
import { useReactFlow } from 'reactflow';
import { useStore } from './store';
import { nodeAccents } from './theme';

const storeSelector = (state) => ({
  addNode: state.addNode,
  getNodeID: state.getNodeID,
});

const buildGhost = (label, accent) => {
  const ghost = document.createElement('div');
  ghost.textContent = label;
  Object.assign(ghost.style, {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: '9999',
    padding: '6px 12px',
    borderRadius: '999px',
    background: '#FFFFFF',
    border: `1px solid ${accent}`,
    color: '#111827',
    fontSize: '12px',
    fontWeight: '500',
    boxShadow: '0 4px 12px rgba(17, 24, 39, 0.18)',
    transform: 'translate(-50%, -50%)',
    userSelect: 'none',
  });
  return ghost;
};

export const DraggableNode = ({ type, label }) => {
  const [isHovering, setIsHovering] = useState(false);
  const { addNode, getNodeID } = useStore(storeSelector);
  const flow = useReactFlow();
  const accent = nodeAccents[type] || '#6B7280';

  const placeNodeAt = (clientX, clientY) => {
    const canvas = document
      .elementFromPoint(clientX, clientY)
      ?.closest('.react-flow');
    if (!canvas) return;

    const bounds = canvas.getBoundingClientRect();
    const position = flow.project({
      x: clientX - bounds.left,
      y: clientY - bounds.top,
    });
    const id = getNodeID(type);
    addNode({ id, type, position, data: { id, nodeType: type } });
  };

  const onDragStart = (event) => {
    event.dataTransfer.setData(
      'application/reactflow',
      JSON.stringify({ nodeType: type })
    );
    event.dataTransfer.effectAllowed = 'move';
  };

  const onTouchStart = (event) => {
    if (event.touches.length !== 1) return;
    event.preventDefault();

    const ghost = buildGhost(label, accent);
    const start = event.touches[0];
    ghost.style.left = `${start.clientX}px`;
    ghost.style.top = `${start.clientY}px`;
    document.body.appendChild(ghost);

    const onTouchMove = (moveEvent) => {
      moveEvent.preventDefault();
      const touch = moveEvent.touches[0];
      ghost.style.left = `${touch.clientX}px`;
      ghost.style.top = `${touch.clientY}px`;
    };

    const cleanup = () => {
      ghost.remove();
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
      document.removeEventListener('touchcancel', cleanup);
    };

    const onTouchEnd = (endEvent) => {
      const touch = endEvent.changedTouches[0];
      cleanup();
      placeNodeAt(touch.clientX, touch.clientY);
    };

    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd);
    document.addEventListener('touchcancel', cleanup);
  };

  return (
    <div
      onDragStart={onDragStart}
      onTouchStart={onTouchStart}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      draggable
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 12px',
        borderRadius: 999,
        border: `1px solid ${isHovering ? '#D1D5DB' : '#E5E7EB'}`,
        background: isHovering ? '#F9FAFB' : '#FFFFFF',
        color: '#111827',
        fontSize: 12,
        fontWeight: 500,
        cursor: 'grab',
        userSelect: 'none',
        touchAction: 'none',
        transition: 'background 0.15s ease, border-color 0.15s ease',
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: accent,
          flexShrink: 0,
        }}
      />
      {label}
    </div>
  );
};
