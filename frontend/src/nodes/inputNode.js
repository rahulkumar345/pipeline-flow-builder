import { BaseNode } from './BaseNode';
import { NodeField } from './NodeField';

export const InputNode = ({ id }) => (
  <BaseNode
    id={id}
    type="customInput"
    title="Input"
    subtitle="Pipeline entry point"
    handles={[{ type: 'source', position: 'right', id: 'value' }]}
  >
    <NodeField
      id={id}
      name="inputName"
      label="Name"
      type="text"
      defaultValue={id.replace('customInput-', 'input_')}
    />
    <NodeField
      id={id}
      name="inputType"
      label="Type"
      type="select"
      options={['Text', 'File']}
      defaultValue="Text"
    />
  </BaseNode>
);
