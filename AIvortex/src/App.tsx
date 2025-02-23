import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ReactFlow,
  Controls,
  Background,
  Connection,
  Edge,
  addEdge,
  Node,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  NodeDragHandler,
  NodeTypes,
} from '@xyflow/react';
import { RootState } from './store';
import { setNodes, setEdges, addNode } from './store/slices/nodesSlice';
import { togglePalette } from './store/slices/paletteSlice';
import { NodePalette } from './components/NodePalette';
import AskAINode from './components/nodes/AskAINode';
import PDFNode from './components/nodes/PDFNode';
import '@xyflow/react/dist/style.css';

const nodeTypes: NodeTypes = {
  askAI: AskAINode,
  pdfGenerator: PDFNode,
};

const App: React.FC = () => {
  const dispatch = useDispatch();
  const { nodes, edges } = useSelector((state: RootState) => state.workflow);
  const showPalette = useSelector((state: RootState) => state.palette.showPalette);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      dispatch(setNodes(changes));
    },
    [dispatch]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      dispatch(setEdges(changes));
    },
    [dispatch]
  );

  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      dispatch(setEdges((eds) => addEdge(connection, eds)));
    },
    [dispatch]
  );

  const onDrop: React.DragEventHandler = (event) => {
    event.preventDefault();
    
    const reactFlowBounds = event.currentTarget.getBoundingClientRect();
    const transferData = JSON.parse(
      event.dataTransfer.getData('application/reactflow')
    );
    
    if (!transferData) return;

    const position = {
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    };

    const newNode: Node = {
      id: `${transferData.type}-${Date.now()}`,
      type: transferData.type,
      position,
      data: { label: transferData.label },
    };

    dispatch(addNode(newNode));
  };

  return (
    <div className="w-screen h-screen">
      <button
        onClick={() => dispatch(togglePalette(true))}
        className="absolute top-5 left-5 z-10 h-10 w-10 bg-pink-300 rounded-full text-pink-900 flex items-center justify-center text-2xl p-7 font-medium hover:bg-pink-400 transition-colors"
      >
        +
      </button>

      {showPalette && (
        <NodePalette
          onClose={() => dispatch(togglePalette(false))}
          onDragStart={(event, nodeData) => {
            event.dataTransfer.setData(
              'application/reactflow',
              JSON.stringify(nodeData)
            );
            event.dataTransfer.effectAllowed = 'move';
          }}
        />
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onDrop={onDrop}
        onDragOver={(event) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = 'move';
        }}
      >
        <Controls />
        <Background variant="dots" gap={10} size={1} />
      </ReactFlow>
    </div>
  );
};

export default App;