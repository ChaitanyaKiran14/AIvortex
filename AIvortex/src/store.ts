import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Node, Edge } from '@xyflow/react';

interface WorkflowState {
  nodes: Node<any>[];
  edges: Edge[];
}

const initialState: WorkflowState = {
  nodes: [],
  edges: [],
};

const workflowSlice = createSlice({
  name: 'workflow',
  initialState,
  reducers: {
    setNodes(state, action: PayloadAction<Node<any>[]>) {
      state.nodes = action.payload;
    },
    setEdges(state, action: PayloadAction<Edge[]>) {
      state.edges = action.payload;
    },
  },
});

export const { setNodes, setEdges } = workflowSlice.actions;

const store = configureStore({
  reducer: {
    workflow: workflowSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
