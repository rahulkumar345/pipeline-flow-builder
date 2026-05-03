import { BaseNode } from './BaseNode';
import { NodeField } from './NodeField';

export const FilterNode = ({ id }) => (
  <BaseNode
    id={id}
    type="filter"
    title="Filter"
    subtitle="Conditional pass-through"
    handles={[
      { type: 'target', position: 'left', id: 'input', label: 'in' },
      { type: 'source', position: 'right', id: 'output', label: 'out' },
    ]}
  >
    <NodeField
      id={id}
      name="operator"
      label="Operator"
      type="select"
      options={['equals', 'not equals', 'contains', 'greater than', 'less than']}
      defaultValue="equals"
    />
    <NodeField id={id} name="value" label="Value" type="text" />
  </BaseNode>
);
