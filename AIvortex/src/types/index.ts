import { Node, Edge } from '@xyflow/react';

export interface NodeData {
  label: string;
  prompt?: string;
  context?: string;
  model?: string;
  content?: string;
}

export interface CustomNode extends Node {
  data: NodeData;
}

export interface PaletteNode {
  id: string;
  label: string;
  type: string;
  icon: React.ReactNode | string;
}

export interface PaletteCategory {
  category: string;
  description: string;
  count: number;
  nodeIcon: string;
  items: PaletteNode[];
}

export interface WorkflowState {
  nodes: CustomNode[];
  edges: Edge[];
}

export interface PaletteState {
  showPalette: boolean;
}
