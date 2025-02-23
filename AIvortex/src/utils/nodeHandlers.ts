=import { CustomNode } from '../types';

export const nodeHandlers = {
  askAI: (node: CustomNode) => {
    console.log(`Executing AskAI Node: ${node.id}`);
    return {
      output: `AI Response: ${node.data.prompt}`,
      nodeId: node.id,
      type: node.type,
      data: node.data,
    };
  },
  pdfGenerator: (node: CustomNode, previousOutput?: string) => {
    console.log(`Executing PDFGeneration Node: ${node.id}`);
    console.log(`Received input:`, previousOutput);
    
    const contentToUse = previousOutput || node.data.content || "No content provided";
    
    return {
      output: `PDF Generated with content: ${contentToUse}`,
      nodeId: node.id,
      type: node.type,
      data: node.data,
    };
  }
};
