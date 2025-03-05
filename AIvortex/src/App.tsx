
import React, { useState, useCallback } from 'react';
import { ReactFlow, Controls, Background, useNodesState, useEdgesState, addEdge, MiniMap, getIncomers, getOutgoers } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import NodePalette from './Components/NodePalette';
import { nodeHandlers } from './utils/nodeHandlers';
import AskAINode from './Components/Nodes/AskAINode';
import PDFNode from './Components/Nodes/PDFNode';
import api from './services/api';
import { Node, Edge, TransferData } from './types/types';

const App: React.FC = () => {
  const [showPalette, setShowPalette] = useState<boolean>(false);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);



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

   // Handle node hover
   const onNodeMouseEnter = useCallback((event: React.MouseEvent, node: Node) => {
    setHoveredNodeId(node.id);
  }, []);

  const onNodeMouseLeave = useCallback(() => {
    setHoveredNodeId(null);
  }, []);

  // Duplicate Node
  const duplicateNode = useCallback((nodeId: string) => {
    setNodes((nds) => {
      const nodeToDuplicate = nds.find((n) => n.id === nodeId);
      if (nodeToDuplicate) {
        const newNode = {
          ...nodeToDuplicate,
          id: `${nodeToDuplicate.type}-${Date.now()}`,
          position: { x: nodeToDuplicate.position.x + 50, y: nodeToDuplicate.position.y + 50 },
        };
        return nds.concat(newNode);
      }
      return nds;
    });
  }, [setNodes]);

  // Rename Node
  const renameNode = useCallback((nodeId: string, newLabel: string) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, label: newLabel } } : n))
    );
  }, [setNodes]);

  // Delete Node
  const deleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
  }, [setNodes, setEdges]);




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
        className="absolute top-5 right-5 z-10 h-10 w-10 bg-pink-300 rounded-full text-pink-900 flex items-center justify-center p-7 font-medium hover:bg-pink-400 transition-colors"
      >
        ▶
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
        onNodeMouseLeave={onNodeMouseLeave}
      >
        <Controls />
        <Background variant="dots" gap={10} size={1} />
        <MiniMap/>

         {/* Render action buttons for hovered node */}
         {nodes.map((node) => (
          hoveredNodeId === node.id && (
            <div
              key={node.id}
              className="absolute z-10 flex gap-2 p-2 bg-white border border-gray-200 rounded shadow"
              style={{
                top: `${node.position.y + 50}px`,
                left: `${node.position.x}px`,
              }}
            >
              <button
                onClick={() => duplicateNode(node.id)}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
              >
                Duplicate
              </button>
              <button
                onClick={() => {
                  const newLabel = prompt('Enter new label:', node.data.label);
                  if (newLabel) renameNode(node.id, newLabel);
                }}
                className="px-2 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200"
              >
                Rename
              </button>
              <button
                onClick={() => deleteNode(node.id)}
                className="px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
              >
                Delete
              </button>
            </div>
          )
        ))}




      </ReactFlow>
    </div>
  );
};

export default App;