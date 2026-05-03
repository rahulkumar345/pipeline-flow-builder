import { useEffect, useMemo } from 'react';
import { useUpdateNodeInternals } from 'reactflow';
import TextareaAutosize from 'react-textarea-autosize';
import { useStore } from '../store';
import { BaseNode } from './BaseNode';

const VARIABLE_REGEX = /\{\{\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*\}\}/g;
const DEFAULT_TEXT = '{{input}}';

const MIN_WIDTH = 220;
const MAX_WIDTH = 500;
const CHAR_PX = 7.2;
const HORIZONTAL_PADDING = 40;

const extractVariables = (text) => {
  const seen = new Set();
  for (const match of text.matchAll(VARIABLE_REGEX)) {
    seen.add(match[1]);
  }
  return [...seen];
};

const computeWidth = (text) => {
  const longest = text
    .split('\n')
    .reduce((acc, line) => Math.max(acc, line.length), 0);
  const px = longest * CHAR_PX + HORIZONTAL_PADDING;
  return Math.min(Math.max(px, MIN_WIDTH), MAX_WIDTH);
};

export const TextNode = ({ id }) => {
  const text = useStore(
    (state) => state.nodes.find((n) => n.id === id)?.data?.text
  );
  const updateNodeField = useStore((state) => state.updateNodeField);
  const updateNodeInternals = useUpdateNodeInternals();

  useEffect(() => {
    if (text === undefined) {
      updateNodeField(id, 'text', DEFAULT_TEXT);
    }
  }, [id, text, updateNodeField]);

  const value = text ?? DEFAULT_TEXT;
  const variables = useMemo(() => extractVariables(value), [value]);
  const variablesKey = variables.join(',');

  useEffect(() => {
    updateNodeInternals(id);
  }, [id, variablesKey, updateNodeInternals]);

  const handles = [
    ...variables.map((v) => ({
      type: 'target',
      position: 'left',
      id: v,
      label: v,
    })),
    { type: 'source', position: 'right', id: 'output' },
  ];

  return (
    <BaseNode
      id={id}
      type="text"
      title="Text"
      subtitle="Templated text with variables"
      handles={handles}
      style={{ width: computeWidth(value) }}
    >
      <label style={{ display: 'flex', flexDirection: 'column' }}>
        <span className="vs-field-label">Template</span>
        <TextareaAutosize
          className="vs-textarea"
          value={value}
          onChange={(e) => updateNodeField(id, 'text', e.target.value)}
          minRows={1}
          maxRows={20}
          placeholder="Use {{ variable }} to add inputs"
        />
      </label>
      <span style={{ fontSize: 11, color: '#9CA3AF' }}>
        {variables.length === 0
          ? 'No variables yet'
          : `${variables.length} variable${variables.length > 1 ? 's' : ''}: ${variables.join(', ')}`}
      </span>
    </BaseNode>
  );
};
