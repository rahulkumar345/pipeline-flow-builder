import { useCallback, useEffect, useState } from 'react';
import { useStore } from './store';

const API_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:8000';

const slimNode = ({ id, type, data, position }) => ({
  id,
  type,
  data,
  position,
});

const slimEdge = ({ id, source, target, sourceHandle, targetHandle }) => ({
  id,
  source,
  target,
  sourceHandle,
  targetHandle,
});

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const onSubmit = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/pipelines/parse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nodes: nodes.map(slimNode),
          edges: edges.map(slimEdge),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      setResult({ kind: 'success', data });
    } catch (err) {
      setResult({
        kind: 'error',
        message:
          err.message === 'Failed to fetch'
            ? 'Could not reach the backend at ' + API_URL
            : err.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [nodes, edges, isSubmitting]);

  return (
    <>
      <button
        type="button"
        className="vs-btn vs-btn--primary"
        onClick={onSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          'Submitting…'
        ) : (
          <>
            <span className="vs-submit-full">Submit Pipeline</span>
            <span className="vs-submit-short">Submit</span>
          </>
        )}
      </button>
      {result && (
        <ResultToast result={result} onClose={() => setResult(null)} />
      )}
    </>
  );
};

const ResultToast = ({ result, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 6000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (result.kind === 'error') {
    return (
      <div className="vs-result-toast">
        <div className="vs-result-card" style={{ borderColor: '#FCA5A5' }}>
          <div style={{ ...toastStyles.title, color: '#B91C1C' }}>
            Submit failed
          </div>
          <div style={toastStyles.body}>{result.message}</div>
        </div>
      </div>
    );
  }

  const { num_nodes, num_edges, is_dag } = result.data;
  return (
    <div className="vs-result-toast">
      <div className="vs-result-card">
        <div style={toastStyles.title}>Pipeline parsed</div>
        <dl style={toastStyles.list}>
          <Row label="Nodes" value={num_nodes} />
          <Row label="Edges" value={num_edges} />
          <Row
            label="Forms a DAG"
            value={is_dag ? 'Yes' : 'No'}
            valueColor={is_dag ? '#059669' : '#DC2626'}
          />
        </dl>
        <button
          type="button"
          className="vs-btn vs-btn--ghost"
          style={{ alignSelf: 'flex-end', padding: '4px 8px', fontSize: 12 }}
          onClick={onClose}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

const Row = ({ label, value, valueColor }) => (
  <div style={toastStyles.row}>
    <dt style={toastStyles.rowLabel}>{label}</dt>
    <dd
      style={{ ...toastStyles.rowValue, color: valueColor || '#111827' }}
    >
      {value}
    </dd>
  </div>
);

const toastStyles = {
  title: {
    fontSize: 13,
    fontWeight: 600,
    color: '#111827',
  },
  body: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 1.45,
  },
  list: {
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 13,
  },
  rowLabel: {
    margin: 0,
    color: '#6B7280',
  },
  rowValue: {
    margin: 0,
    fontWeight: 600,
    fontVariantNumeric: 'tabular-nums',
  },
};
