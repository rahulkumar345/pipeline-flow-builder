import { BaseNode } from './BaseNode';
import { NodeField } from './NodeField';

export const MathNode = ({ id }) => (
  <BaseNode
    id={id}
    type="math"
    title="Math"
    subtitle="Arithmetic on two inputs"
    handles={[
      { type: 'target', position: 'left', id: 'a', label: 'a' },
      { type: 'target', position: 'left', id: 'b', label: 'b' },
      { type: 'source', position: 'right', id: 'result', label: 'result' },
    ]}
  >
    <NodeField
      id={id}
      name="operator"
      label="Operation"
      type="select"
      options={[
        { value: '+', label: 'Add (+)' },
        { value: '-', label: 'Subtract (-)' },
        { value: '*', label: 'Multiply (×)' },
        { value: '/', label: 'Divide (÷)' },
      ]}
      defaultValue="+"
    />
  </BaseNode>
);
