import { InputNode } from './inputNode';
import { OutputNode } from './outputNode';
import { LLMNode } from './llmNode';
import { TextNode } from './textNode';
import { FilterNode } from './filterNode';
import { MathNode } from './mathNode';
import { ApiNode } from './apiNode';
import { ConditionalNode } from './conditionalNode';
import { NoteNode } from './noteNode';

export const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  filter: FilterNode,
  math: MathNode,
  api: ApiNode,
  conditional: ConditionalNode,
  note: NoteNode,
};

export const nodeRegistry = [
  { type: 'customInput', label: 'Input' },
  { type: 'llm', label: 'LLM' },
  { type: 'customOutput', label: 'Output' },
  { type: 'text', label: 'Text' },
  { type: 'filter', label: 'Filter' },
  { type: 'math', label: 'Math' },
  { type: 'api', label: 'API' },
  { type: 'conditional', label: 'Conditional' },
  { type: 'note', label: 'Note' },
];
