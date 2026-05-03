import { BaseNode } from './BaseNode';

export const LLMNode = ({ id }) => (
  <BaseNode
    id={id}
    type="llm"
    title="LLM"
    subtitle="Language model call"
    handles={[
      { type: 'target', position: 'left', id: 'system', label: 'system' },
      { type: 'target', position: 'left', id: 'prompt', label: 'prompt' },
      { type: 'source', position: 'right', id: 'response', label: 'response' },
    ]}
  >
    <div style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.4 }}>
      Wires a system prompt and a user prompt into a model call.
    </div>
  </BaseNode>
);
