import { BaseNode } from './BaseNode';
import { NodeField } from './NodeField';

export const ApiNode = ({ id }) => (
  <BaseNode
    id={id}
    type="api"
    title="API Call"
    subtitle="HTTP request"
    handles={[
      { type: 'target', position: 'left', id: 'body', label: 'body' },
      { type: 'source', position: 'right', id: 'response', label: 'response' },
      { type: 'source', position: 'right', id: 'error', label: 'error' },
    ]}
  >
    <NodeField
      id={id}
      name="url"
      label="URL"
      type="text"
      defaultValue="https://"
    />
    <NodeField
      id={id}
      name="method"
      label="Method"
      type="select"
      options={['GET', 'POST', 'PUT', 'PATCH', 'DELETE']}
      defaultValue="GET"
    />
  </BaseNode>
);
