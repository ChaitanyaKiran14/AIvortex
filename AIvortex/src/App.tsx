
import React, { useState, useCallback } from 'react';
import { ReactFlow, Controls, Background, useNodesState, useEdgesState, addEdge, MiniMap, getIncomers, getOutgoers } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import NodePalette from './Components/NodePalette';
import AskAINode from './Components/Nodes/AskAINode';
import PDFNode from './Components/Nodes/PDFNode';
import LinkedInNode from './Components/Nodes/LinkedInNode';
import TypeformNode from './Components/Nodes/TypeformNode';
import CombineTextNode from './Components/Nodes/CombineTextNode';
import CultureFitNode from './Components/Nodes/CultureFitNode';
import api from './services/api';
import { Node, Edge, TransferData } from './types/types';
import { IoPlayOutline } from "react-icons/io5";

const App: React.FC = () => {
  const [showPalette, setShowPalette] = useState<boolean>(false);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  

  const findStartNodes = useCallback((nodes: Node[], edges: Edge[]): Node[] => {
    return nodes.filter((node) => {
      const incomers = getIncomers(node, nodes, edges);
      return incomers.length === 0;
    });
  }, []);

  const getNextNodes = useCallback((node: Node, nodes: Node[], edges: Edge[]): Node[] => {
    return getOutgoers(node, nodes, edges);
  }, []);

  const downloadPDF = async (pdfPath: string): Promise<void> => {
    try {
      const filename = pdfPath.split('\\').pop();
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
      console.error("Error downloading PDF:", error);
    }
  };

  const executeFlow = async (): Promise<void> => {
    if (nodes.length === 0) {
      console.log("No nodes to execute.");
      return;
    }
    
    const workflowPayload = { nodes, edges };
    
    try {
      const response = await api.post("/execute-workflow", workflowPayload);
      console.log("Workflow execution results:", response.data.results);

      Object.entries(response.data.results).forEach(([nodeId, result]) => {
        if (nodeId.includes('pdf') && result.includes('PDF generated successfully at')) {
          const pdfPath = result.split('PDF generated successfully at ')[1];
          downloadPDF(pdfPath);
        }
      });
    } catch (error) {
      console.error("Error executing workflow:", error.response?.data || error.message);
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
    (params: any) => setEdges((eds) => addEdge(params, eds)),
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
        y: event.clientY - reactFlowBounds.top
      };

      const newNode: Node = {
        id: `${transferData.type}-${Date.now()}`,
        type: transferData.type,
        position,
        data: { 
          label: transferData.label
        }
      };

      setNodes((nds) => nds.concat(newNode));
    } catch (error) {
      console.error('Error dropping node:', error);
    }
  };

  const onDragOver = (event: React.DragEvent): void => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  return (
    <div className='w-screen h-screen'>
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
        <Background variant="dots" gap={10} size={1} />
        <MiniMap/>
      </ReactFlow>
    </div>
  );
};

export default App;