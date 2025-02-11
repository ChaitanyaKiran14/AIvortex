import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  getIncomers,
  getOutgoers,
  Connection,
} from '@xyflow/react';
import { NodePalette } from './components/NodePalette/NodePalette';
import { nodeHandlers } from './utils/nodeHandlers';
import { nodeTypes } from './components/Nodes';
import { AppDispatch, RootState } from './store';
import {
  setNodes,
  setEdges,
  addNodeResult,
  setExecuting,
  setError,
  clearResults,
} from './store/slices/workflowSlice';
import { WorkflowNode, Edge } from './types';
import '@xyflow/react/dist/style.css';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [showPalette, setShowPalette] = useState(false);
  const [nodes, setLocalNodes, onNodesChange] = useNodesState([]);
  const [edges, setLocalEdges, onEdgesChange] = useEdgesState([]);

  const findStartNodes = useCallback((nodes: WorkflowNode[], edges: Edge[]) => {
    return nodes.filter((node) => {
      const incomers = getIncomers(node, nodes, edges);
      return incomers.length === 0;
    });
  }, []);

  const getNextNodes = useCallback((node: WorkflowNode, nodes: WorkflowNode[], edges: Edge[]) => {
    return getOutgoers(node, nodes, edges);
  }, []);

  const executeFlow = async () => {
    dispatch(clearResults());
    dispatch(setExecuting(true));

    const startNodes = findStartNodes(nodes, edges);

    if (startNodes.length === 0) {
      dispatch(setError('No start nodes found. Add nodes and connect them to create a flow.'));
      dispatch(setExecuting(false));
      return;
    }

    const executedNodes = new Set<string>();

    const executeNodeAndChildren = async (node: WorkflowNode) => {
      if (executedNodes.has(node.id)) return;

      const handler = nodeHandlers[node.type];
      if (!handler) {
        dispatch(setError(`No handler found for node type: ${node.type}`));
        return;
      }

      try {
        const result = await handler(node);
        dispatch(addNodeResult(result));
        executedNodes.add(node.id);

        const nextNodes = getNextNodes(node, nodes, edges);
        for (const nextNode of nextNodes) {
          await executeNodeAndChildren(nextNode);
        }
      } catch (error) {
        dispatch(setError(`Error executing node ${node.id}: ${error.message}`));
      }
    };

    try {
      for (const startNode of startNodes) {
        await executeNodeAndChildren(startNode);
      }
    } finally {
      dispatch(setExecuting(false));
    }
  };

  const onConnect = useCallback(
    (params: Connection) => {
      setLocalEdges((eds) => addEdge(params, eds));
      dispatch(setEdges(edges));
    },
    [setLocalEdges, dispatch, edges]
  );

  // ... rest of the component implementation
  
  return (
    <div className="w-screen h-screen">
      {/* ... existing JSX ... */}
    </div>
  );
};

export default App