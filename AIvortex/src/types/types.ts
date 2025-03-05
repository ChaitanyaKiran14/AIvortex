export interface NodeData {
  label: string;
  prompt?: string;
  context?: string;
  model?: string;
  content?: string;
}

export interface Node {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: NodeData;
}

export interface Edge {
  id: string;
  source: string;
  target: string;
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
  icon: string | JSX.Element;
}