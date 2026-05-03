import { BaseNode } from './BaseNode';
import { NodeField } from './NodeField';

export const OutputNode = ({ id }) => (
  <BaseNode
    id={id}
    type="customOutput"
    title="Output"
    subtitle="Pipeline result"
    handles={[{ type: 'target', position: 'left', id: 'value' }]}
  >
    <NodeField
      id={id}
      name="outputName"
      label="Name"
      type="text"
      defaultValue={id.replace('customOutput-', 'output_')}
    />
    <NodeField
      id={id}
      name="outputType"
      label="Type"
      type="select"
      options={['Text', 'Image']}
      defaultValue="Text"
    />
  </BaseNode>
);
