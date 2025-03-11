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
          icon: (<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M16 8.016A8.522 8.522 0 008.016 16h-.032A8.521 8.521 0 000 8.016v-.032A8.521 8.521 0 007.984 0h.032A8.522 8.522 0 0016 7.984v.032z" fill="url(#prefix__paint0_radial_980_20147)"/><defs><radialGradient id="prefix__paint0_radial_980_20147" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(16.1326 5.4553 -43.70045 129.2322 1.588 6.503)"><stop offset=".067" /><stop offset=".343"/><stop offset=".672"/></radialGradient></defs></svg>)
        },
        {
          id: 'pdf-generator',
          label: 'PDF Generator',
          type: 'pdfGenerator',
          icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="20" height="20" rx="2" fill="#E53E3E"/><rect x="6" y="6" width="12" height="2" fill="white"/><rect x="6" y="10" width="12" height="2" fill="white"/><rect x="6" y="14" width="8" height="2" fill="white"/>
            
            <path d="M20 6L14 6L20 12V6Z" fill="#C53030"/>
          </svg>

           
          )
        },
        {
          id: 'linkedin-scraper',
          label: 'LinkedIn Scraper',
          type: 'linkedIn',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <path fill="#0077B5" d="M19 0H5a5 5 0 0 0-5 5v14a5 5 0 0 0 5 5h14a5 5 0 0 0 5-5V5a5 5 0 0 0-5-5zM8 19H5V8h3v11zM6.5 6.732c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zM20 19h-3v-5.604c0-3.368-4-3.113-4 0V19h-3V8h3v1.765c1.396-2.586 7-2.777 7 2.476V19z"/>
</svg>
          )
        },
        {
          id: 'typeform',
          label: 'Typeform',
          type: 'typeform',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 43 24" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden="true" role="img">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0 5.42456C0 1.8517 1.40765 0 3.78009 0C6.15215 0 7.56018 1.8517 7.56018 5.42456V16.2479C7.56018 19.8208 6.15252 21.6725 3.78009 21.6725C1.40765 21.6725 0 19.8208 0 16.2479V5.42456ZM25.4643 0H17.6512C10.6419 0 10.0894 3.027 10.0894 7.06301L10.0802 14.599C10.0802 18.8069 10.6082 21.6725 17.6784 21.6725H25.4643C32.4961 21.6725 33.0128 18.656 33.0128 14.62V7.07352C33.0128 3.027 32.4736 0 25.4643 0Z" fill="currentColor"></path>
</svg>
          )
        }
      ]
    },
    
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