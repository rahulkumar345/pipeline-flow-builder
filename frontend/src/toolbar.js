import { Fragment } from 'react';
import { DraggableNode } from './draggableNode';

const TOOLBAR_GROUPS = [
  {
    label: 'General',
    items: [
      { type: 'customInput', label: 'Input' },
      { type: 'customOutput', label: 'Output' },
      { type: 'text', label: 'Text' },
    ],
  },
  {
    label: 'AI',
    items: [{ type: 'llm', label: 'LLM' }],
  },
  {
    label: 'Logic',
    items: [
      { type: 'filter', label: 'Filter' },
      { type: 'conditional', label: 'Conditional' },
    ],
  },
  {
    label: 'Compute',
    items: [{ type: 'math', label: 'Math' }],
  },
  {
    label: 'Network',
    items: [{ type: 'api', label: 'API' }],
  },
  {
    label: 'Annotate',
    items: [{ type: 'note', label: 'Note' }],
  },
];

export const PipelineToolbar = () => (
  <div className="vs-toolbar">
    {TOOLBAR_GROUPS.map((group, index) => (
      <Fragment key={group.label}>
        {index > 0 && <div className="vs-toolbar-divider" />}
        <div className="vs-toolbar-group">
          <span className="vs-toolbar-group-label">{group.label}</span>
          {group.items.map((item) => (
            <DraggableNode
              key={item.type}
              type={item.type}
              label={item.label}
            />
          ))}
        </div>
      </Fragment>
    ))}
    <span className="vs-toolbar-hint">Drag a node onto the canvas</span>
  </div>
);
