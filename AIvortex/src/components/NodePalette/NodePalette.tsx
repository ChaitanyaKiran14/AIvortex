
import React from 'react';
import { Search, X } from 'lucide-react';
import { NodePaletteProps, PaletteCategory } from './types';

export const NodePalette: React.FC<NodePaletteProps> = ({ onClose, onDragStart }) => {
  const paletteNodes: PaletteCategory[] = [
    {
      category: 'Using AI',
      description: "Leverage AI for various tasks",
      count: 15,
      nodeIcon: "AI",
      items: [
        {
          id: 'ask-ai',
          label: 'Ask AI',
          type: 'askAI',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cpu mr-1" style={{ color: 'rgb(246, 112, 183)' }}>
              <rect width="16" height="16" x="4" y="4" rx="2" />
              <rect width="6" height="6" x="9" y="9" rx="1" />
              <path d="M15 2v2" />
              <path d="M15 20v2" />
              <path d="M2 15h2" />
              <path d="M2 9h2" />
              <path d="M20 15h2" />
              <path d="M20 9h2" />
              <path d="M9 2v2" />
              <path d="M9 20v2" />
            </svg>
          )
        },
        // ... other items
      ]
    },
    // ... other categories
  ];

  return (
    <div className="fixed top-5 left-5 z-10 w-[340px] max-w-2xl h-[calc(100vh-40px)] bg-white rounded-lg shadow-lg flex flex-col">
      {/* ... existing JSX ... */}
    </div>
  );
};