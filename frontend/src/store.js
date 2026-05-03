import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from 'reactflow';

const HISTORY_LIMIT = 50;

const SIGNIFICANT_CHANGE_TYPES = new Set(['add', 'remove', 'reset']);

const isSignificantNodeChange = (changes) =>
  changes.some(
    (c) =>
      SIGNIFICANT_CHANGE_TYPES.has(c.type) ||
      (c.type === 'position' && c.dragging === false)
  );

const isSignificantEdgeChange = (changes) =>
  changes.some((c) => SIGNIFICANT_CHANGE_TYPES.has(c.type));

const cloneTrackedState = (state) => ({
  nodes: structuredClone(state.nodes),
  edges: structuredClone(state.edges),
  nodeIDs: { ...state.nodeIDs },
});

const edgeDefaults = {
  type: 'smoothstep',
  animated: true,
  style: { stroke: '#6366F1', strokeWidth: 2 },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: '#6366F1',
    width: 18,
    height: 18,
  },
};

export const useStore = create(
  persist(
    (set, get) => ({
      nodes: [],
      edges: [],
      nodeIDs: {},
      past: [],
      future: [],

      pushHistory: () => {
        const past = [...get().past, cloneTrackedState(get())];
        set({
          past: past.slice(-HISTORY_LIMIT),
          future: [],
        });
      },

      undo: () => {
        const { past, future } = get();
        if (past.length === 0) return;
        const previous = past[past.length - 1];
        set({
          ...previous,
          past: past.slice(0, -1),
          future: [cloneTrackedState(get()), ...future].slice(0, HISTORY_LIMIT),
        });
      },

      redo: () => {
        const { past, future } = get();
        if (future.length === 0) return;
        const next = future[0];
        set({
          ...next,
          past: [...past, cloneTrackedState(get())].slice(-HISTORY_LIMIT),
          future: future.slice(1),
        });
      },

      clear: () => {
        if (get().nodes.length === 0 && get().edges.length === 0) return;
        get().pushHistory();
        set({ nodes: [], edges: [], nodeIDs: {} });
      },

      getNodeID: (type) => {
        const newIDs = { ...get().nodeIDs };
        newIDs[type] = (newIDs[type] || 0) + 1;
        set({ nodeIDs: newIDs });
        return `${type}-${newIDs[type]}`;
      },

      addNode: (node) => {
        get().pushHistory();
        set({ nodes: [...get().nodes, node] });
      },

      onNodesChange: (changes) => {
        if (isSignificantNodeChange(changes)) {
          get().pushHistory();
        }
        set({ nodes: applyNodeChanges(changes, get().nodes) });
      },

      onEdgesChange: (changes) => {
        if (isSignificantEdgeChange(changes)) {
          get().pushHistory();
        }
        set({ edges: applyEdgeChanges(changes, get().edges) });
      },

      onConnect: (connection) => {
        get().pushHistory();
        set({
          edges: addEdge(
            { ...connection, ...edgeDefaults },
            get().edges
          ),
        });
      },

      updateNodeField: (nodeId, fieldName, fieldValue) => {
        set({
          nodes: get().nodes.map((node) =>
            node.id === nodeId
              ? { ...node, data: { ...node.data, [fieldName]: fieldValue } }
              : node
          ),
        });
      },
    }),
    {
      name: 'vectorshift-pipeline-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        nodes: state.nodes,
        edges: state.edges,
        nodeIDs: state.nodeIDs,
      }),
      version: 1,
    }
  )
);
