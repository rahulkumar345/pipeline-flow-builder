import { Handle, Position } from 'reactflow';
import { nodeAccents } from '../theme';

const POSITION_MAP = {
  left: Position.Left,
  right: Position.Right,
  top: Position.Top,
  bottom: Position.Bottom,
};

const isVertical = (side) => side === 'left' || side === 'right';

const groupHandlesBySide = (handles) =>
  handles.reduce((acc, handle) => {
    const side = handle.position || 'left';
    (acc[side] = acc[side] || []).push(handle);
    return acc;
  }, {});

const handleLabelStyle = (side, offset) => {
  const verticalCenter = { top: offset, transform: 'translateY(-50%)' };
  if (side === 'left') {
    return { ...verticalCenter, right: '100%', marginRight: 10 };
  }
  if (side === 'right') {
    return { ...verticalCenter, left: '100%', marginLeft: 10 };
  }
  return null;
};

export const BaseNode = ({
  id,
  type,
  title,
  subtitle,
  handles = [],
  children,
  style,
}) => {
  const accent = nodeAccents[type] || '#6B7280';
  const grouped = groupHandlesBySide(handles);

  return (
    <div
      style={{
        position: 'relative',
        minWidth: 220,
        background: '#FFFFFF',
        borderRadius: 8,
        border: '1px solid #E5E7EB',
        boxShadow: '0 1px 3px rgba(17, 24, 39, 0.06), 0 4px 12px rgba(17, 24, 39, 0.04)',
        overflow: 'visible',
        fontSize: 13,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div
        style={{
          height: 4,
          background: accent,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
      />

      <div
        style={{
          padding: '10px 12px 6px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <div
          style={{
            fontWeight: 600,
            fontSize: 13,
            color: '#111827',
            letterSpacing: '-0.01em',
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: 11, color: '#9CA3AF' }}>{subtitle}</div>
        )}
      </div>

      <div
        style={{
          padding: '4px 12px 12px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {children}
      </div>

      {Object.entries(grouped).flatMap(([side, sideHandles]) =>
        sideHandles.map((handle, index) => {
          const offset = `${((index + 1) * 100) / (sideHandles.length + 1)}%`;
          const labelPos = handleLabelStyle(side, offset);
          return (
            <span key={`${side}-${handle.id}`}>
              <Handle
                type={handle.type}
                position={POSITION_MAP[side]}
                id={`${id}-${handle.id}`}
                style={isVertical(side) ? { top: offset } : { left: offset }}
              />
              {handle.label && labelPos && (
                <span
                  style={{
                    position: 'absolute',
                    ...labelPos,
                    fontSize: 10,
                    color: '#6B7280',
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap',
                    fontWeight: 500,
                    background: 'rgba(249, 250, 251, 0.85)',
                    padding: '1px 5px',
                    borderRadius: 3,
                    lineHeight: 1.2,
                  }}
                >
                  {handle.label}
                </span>
              )}
            </span>
          );
        })
      )}
    </div>
  );
};
