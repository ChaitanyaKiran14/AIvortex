export interface PaletteNode {
    id: string;
    label: string;
    type?: string;
    icon: string | JSX.Element;
  }
  
  export interface PaletteCategory {
    category: string;
    description: string;
    count: number;
    nodeIcon: string;
    items: PaletteNode[];
  }
  
  export interface NodePaletteProps {
    onClose: () => void;
    onDragStart: (event: React.DragEvent, nodeData: { type: string; label: string }) => void;
  }