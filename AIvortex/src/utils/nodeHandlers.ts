import { NodeResult, WorkflowNode } from '../types';

export const nodeHandlers: Record<string, (node: WorkflowNode) => Promise<NodeResult>> = {
  askAI: async (node) => {
    console.log(`Executing AskAI Node: ${node.id}`);
    return {
      output: `AI Response: ${node.data.prompt}`,
      nodeId: node.id,
      type: node.type,
      data: node.data,
    };
  },
  extractData: async (node) => {
    console.log(`Executing ExtractData Node: ${node.id}`);
    return {
      output: `Extracted Data: ${node.data.extractQuery}`,
      nodeId: node.id,
      type: node.type,
      data: node.data,
    };
  },
  // ... other handlers
};