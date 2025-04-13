import {  Edge as ReactFlowEdge, Node as ReactFlowNode } from '@xyflow/react';

export interface NodeData {
  label: string;
  prompt?: string;
  context?: string;
  model?: string;
  content?: string;
  title?: string;
  profileUrl?: string;  
  formId?: string;
  apiKey?: string;
  companyValues?: string; 
  weights?: { [key: string]: number };
  cultureFitContext?: string;
  _previous_results?: string[];
  [key: string]: unknown; // Add this to make it compatible with Record<string, unknown>
}

// Extend ReactFlow's Node type
export interface Node extends ReactFlowNode<NodeData> {
  type: string; // Make sure type is required, not optional
}

// Extend ReactFlow's Edge type
export interface Edge extends ReactFlowEdge {
  // Add any custom edge properties here if needed
}

export interface TransferData {
  type: string;
  label: string;
}

export interface PaletteNode {
  category: string;
  description: string;
  count: number;
  nodeIcon: string;
  items: PaletteItem[];
}

export interface PaletteItem {
  id: string;
  label: string;
  type: string;
  icon: string | React.ReactElement;
}