import React from "react";
import { Search, X } from "lucide-react";
import { PaletteNode, PaletteItem } from '../types/types';

interface NodePaletteProps {
  onClose: () => void;
  onDragStart: (event: React.DragEvent, nodeData: { type: string; label: string }) => void;
}

const NodePalette: React.FC<NodePaletteProps> = ({ onClose, onDragStart }) => {
  const paletteNodes: PaletteNode[] = [
    {
      category: 'Using AI',
      description: "Leverage AI for various tasks",
      count: 15,
      nodeIcon: "AI",
      items: [
        { 
          id: 'ask-ai',  
          label: 'Ask Gemini AI',  
          type: 'askAI',  
          icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cpu mr-1" style={{ color: 'rgb(79, 70, 229)' }}>
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
          </svg>)
        },
        {
          id: 'pdf-generator',
          label: 'PDF Generator',
          type: 'pdfGenerator',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text mr-1" style={{ color: 'rgb(59, 130, 246)' }}>
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" x2="8" y1="13" y2="13" />
              <line x1="16" x2="8" y1="17" y2="17" />
              <line x1="10" x2="8" y1="9" y2="9" />
            </svg>
          )
        }
      ]
    },
    // Add other categories similarly
  ];

  return (
    <div className="fixed top-5 left-5 z-10 w-[340px] max-w-2xl h-[calc(100vh-40px)] bg-white rounded-lg shadow-lg flex flex-col">
      {/* Header section */}
      <div className="flex-none border-b border-gray-100">
        <div className="flex items-center justify-between px-4 pt-4">
          <div className="flex gap-4">
            <button className="text-black font-medium pb-2 border-b-2 border-pink-500">Node Library</button>
            <button className="text-gray-500 font-medium pb-2">Subflow Library</button>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:rounded-full hover:bg-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 py-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
            <input 
              type="text"
              placeholder="Search or ask anything..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex gap-2 px-5 pb-3 overflow-x-auto">
          <button className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium whitespace-nowrap">Core Nodes</button>
          <button className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium whitespace-nowrap">Integrations</button>
          <button className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium whitespace-nowrap">Triggers</button>
          <button className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium whitespace-nowrap">Custom Nodes</button>
        </div>
      </div>

      {/* Scrollable content section */}
      <div className="flex-1 overflow-y-auto min-h-0 bg-gray-50">
        {paletteNodes.map((category, index) => (
          <div key={index} className="p-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                    <span className="text-pink-500 text-xs font-semibold">{category.nodeIcon}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{category.category}</h3>
                      <span className="text-xs text-gray-500">{category.count}</span>
                    </div>
                    <p className="text-sm text-gray-500">{category.description}</p>
                  </div>
                </div>
                <div className="text-gray-400">›</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
              {category.items.map((item) => (
                <button 
                  key={item.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, {
                    type: item.type,
                    label: item.label
                  })}
                  className="flex items-center gap-2 p-2.5 bg-white border border-gray-100 rounded-lg hover:border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-6 h-6 bg-pink-100 rounded-lg flex items-center justify-center">
                    {typeof item.icon === 'string' ? (
                      <span className="text-pink-500 text-xs">{item.icon}</span>
                    ) : (
                      item.icon
                    )}
                  </div>
                  <span className="text-sm text-gray-700 truncate">{item.label}</span>
                </button>
              ))}
              
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NodePalette;