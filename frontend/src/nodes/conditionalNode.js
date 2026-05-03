import { BaseNode } from './BaseNode';
import { NodeField } from './NodeField';

export const ConditionalNode = ({ id }) => (
  <BaseNode
    id={id}
    type="conditional"
    title="Conditional"
    subtitle="Branch on a condition"
    handles={[
      { type: 'target', position: 'left', id: 'value', label: 'value' },
      { type: 'source', position: 'right', id: 'true', label: 'true' },
      { type: 'source', position: 'right', id: 'false', label: 'false' },
    ]}
  >
    <NodeField
      id={id}
      name="comparator"
      label="If value is"
      type="select"
      options={['truthy', 'falsy', 'equal to', 'not equal to', 'empty']}
      defaultValue="truthy"
    />
    <NodeField id={id} name="compareTo" label="Compare to" type="text" />
  </BaseNode>
);
