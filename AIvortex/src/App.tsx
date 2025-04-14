import React, { useState, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import NodePalette from './components/NodePalette';
import AskAINode from './components/Nodes/AskAINode';
import PDFNode from './components/Nodes/PDFNode';
import LinkedInNode from './components/Nodes/LinkedInNode';
import TypeformNode from './components/Nodes/TypeformNode';
import CombineTextNode from './components/Nodes/CombineTextNode';
import CultureFitNode from './components/Nodes/CultureFitNode';
import api from './services/api';
import { Node, Edge, TransferData } from './types/types';
import { IoPlayOutline } from 'react-icons/io5';

const App: React.FC = () => {
  const [showPalette, setShowPalette] = useState<boolean>(false);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const downloadPDF = async (pdfPath: string): Promise<void> => {
    try {
      const filename = pdfPath.split('/').pop();
      const response = await api.get(`/download-pdf/${filename}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename || 'output.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      throw error;
    }
  };

  const executeFlow = async (): Promise<void> => {
    if (nodes.length === 0) {
      setErrorMessage('No nodes to execute.');
      return;
    }

    const invalidNodes = nodes.filter((node) => node.data.isValid === false);
    if (invalidNodes.length > 0) {
      setErrorMessage(
        `Please fix errors in the following nodes: ${invalidNodes
          .map((node) => node.data.label)
          .join(', ')}`
      );
      return;
    }

    setErrorMessage('');

    const workflowPayload = { nodes, edges };

    try {
      const response = await api.post('/execute-workflow', workflowPayload);
      console.log('Workflow execution results:', response.data.results);

      Object.entries(response.data.results).forEach(([nodeId, result]) => {
        const resultStr = result as string;
        if (nodeId.includes('pdf') && resultStr.includes('PDF generated successfully at')) {
          const pdfPath = resultStr.split('PDF generated successfully at ')[1];
          console.log('Extracted PDF path:', pdfPath);
          downloadPDF(pdfPath);
        }
      });
    } catch (error: any) {
      console.error('Error executing workflow:', error?.response?.data || error?.message || error);
      setErrorMessage('Failed to execute workflow. Please try again.');
    }
  };

  const nodeTypes = {
    askAI: AskAINode,
    pdfGenerator: PDFNode,
    linkedIn: LinkedInNode,
    typeform: TypeformNode,
    combineText: CombineTextNode,
    cultureFit: CultureFitNode,
  };

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragStart = (event: React.DragEvent, nodeData: TransferData): void => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeData));
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDrop = (event: React.DragEvent): void => {
    event.preventDefault();

    try {
      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const transferData: TransferData = JSON.parse(event.dataTransfer.getData('application/reactflow'));

      if (!transferData) return;

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode: Node = {
        id: `${transferData.type}-${Date.now()}`,
        type: transferData.type,
        position,
        data: { label: transferData.label, isValid: true }, // Initialize as valid
      };

      setNodes((nds) => [...nds, newNode]);
    } catch (error) {
      console.error('Error dropping node:', error);
    }
  };

  const onDragOver = (event: React.DragEvent): void => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  return (
    <div className="w-screen h-screen">
      <button
        onClick={() => setShowPalette(true)}
        className="absolute top-5 left-5 z-10 h-10 w-10 bg-pink-300 rounded-full text-pink-900 flex items-center justify-center text-2xl p-7 font-medium hover:bg-pink-400 transition-colors"
      >
        +
      </button>

      <button
        onClick={executeFlow}
        className="absolute top-5 right-5 z-10 h-10 bg-pink-300 rounded-full text-pink-900 flex items-center justify-center p-2 font-medium hover:bg-pink-400 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <IoPlayOutline className="text-xl" />
          <span>RUN</span>
        </div>
      </button>

      {errorMessage && (
        <div className="absolute top-20 right-5 z-10 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {errorMessage}
        </div>
      )}

      {showPalette && (
        <NodePalette
          onClose={() => setShowPalette(false)}
          onDragStart={onDragStart}
        />
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={10} size={1} />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export default App;