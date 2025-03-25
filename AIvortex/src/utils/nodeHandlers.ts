import { Node } from '../types/types';

export const nodeHandlers = {
  askAI: (node: Node) => {
    console.log(`Executing AskAI Node: ${node.id}`);
    return {
      output: `AI Response: ${node.data.prompt}`,
      nodeId: node.id,
      type: node.type,
      data: node.data,
    };
  },
  pdfGenerator: (node: Node, previousOutput: string) => {
    console.log(`Executing PDFGeneration Node: ${node.id}`);
    console.log(`Received input:`, previousOutput);
    
    const contentToUse = previousOutput || node.data.content || "No content provided";
    
    return {
      output: `PDF Generated with content: ${contentToUse}`,
      nodeId: node.id,
      type: node.type,
      data: node.data,
    };
  },
  linkedIn: (node: Node) => {
    console.log("LinkedIn Node Working");
    console.log(`Executing LinkedIn Node: ${node.id}`);
    return {
      output: `LinkedIn Profile Data for URL: ${node.data.profileUrl}`,
      nodeId: node.id,
      type: node.type,
      data: node.data,
    };
  },
  typeform : (node: Node) => {
    console.log("Typeform Node Working");
    console.log(`Executing Typeform Node: ${node.id}`);
    return {
      output: `Typeform for formId: ${node.data.formId}`,
      nodeId: node.id,
      type: node.type,
      data: node.data,
    };
  },

  combineText: (node: Node, previousOutput?: string | string[]) => {
    console.log(`Executing CombineText Node: ${node.id}`);
    
    let combinedOutput = "";
    
    // If previousOutput exists, it could be a string or an array of strings
    if (previousOutput) {
      if (Array.isArray(previousOutput)) {
        // If it's an array, combine all outputs
        previousOutput.forEach((output, index) => {
          combinedOutput += `--- Source ${index + 1} ---\n${output}\n\n`;
        });
      } else {
        // If it's a single string, use it directly
        combinedOutput = `--- Source 1 ---\n${previousOutput}\n\n`;
      }
    } else {
      combinedOutput = "No input data provided to CombineTextNode.";
    }
    
    console.log(`Combined output:`, combinedOutput);
    
    return {
      output: combinedOutput,
      nodeId: node.id,
      type: node.type,
      data: node.data,
    };
  },







};





  