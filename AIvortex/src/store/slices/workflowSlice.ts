import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WorkflowState, NodeResult, WorkflowNode, Edge } from '../../types';

const initialState: WorkflowState = {
  nodes: [],
  edges: [],
  results: {},
  isExecuting: false,
  error: null,
};

const workflowSlice = createSlice({
  name: 'workflow',
  initialState,
  reducers: {
    setNodes: (state, action: PayloadAction<WorkflowNode[]>) => {
      state.nodes = action.payload;
    },
    setEdges: (state, action: PayloadAction<Edge[]>) => {
      state.edges = action.payload;
    },
    addNodeResult: (state, action: PayloadAction<NodeResult>) => {
      state.results[action.payload.nodeId] = action.payload;
    },
    setExecuting: (state, action: PayloadAction<boolean>) => {
      state.isExecuting = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearResults: (state) => {
      state.results = {};
      state.error = null;
    },
  },
});

export const {
  setNodes,
  setEdges,
  addNodeResult,
  setExecuting,
  setError,
  clearResults,
} = workflowSlice.actions;

export default workflowSlice.reducer;