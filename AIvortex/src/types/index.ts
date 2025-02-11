import { Node, Edge } from '@xyflow/react';

export interface NodeData {
  label: string;
  prompt?: string;
  context?: string;
  model?: string;
  isEnabled?: boolean;
  extractQuery?: string;
  category?: string;
  content?: string;
  input?: string;
}

export interface WorkflowNode extends Node<NodeData> {}

export interface NodeResult {
  output: string;
  nodeId: string;
  type: string;
  data: NodeData;
}

export interface WorkflowState {
  nodes: WorkflowNode[];
  edges: Edge[];
  results: Record<string, NodeResult>;
  isExecuting: boolean;
  error: string | null;
}