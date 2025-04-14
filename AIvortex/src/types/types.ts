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
  isValid?: boolean;
  [key: string]: unknown; 
}

export interface Node extends ReactFlowNode<NodeData> {
  type: string; 
}

export interface Edge extends ReactFlowEdge {
  
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