import { BaseNode } from './BaseNode';
import { NodeField } from './NodeField';

export const NoteNode = ({ id }) => (
  <BaseNode
    id={id}
    type="note"
    title="Note"
    subtitle="Annotation, no I/O"
    handles={[]}
    style={{ background: '#FEFCE8' }}
  >
    <NodeField
      id={id}
      name="text"
      label=""
      type="textarea"
      defaultValue="Write a note..."
      rows={3}
      className="vs-textarea"
    />
  </BaseNode>
);
