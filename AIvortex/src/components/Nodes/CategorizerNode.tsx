import React, { useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { CustomNodeProps } from './types';

const CategorizerNode: React.FC<CustomNodeProps> = ({ data, id }) => {
  const [input, setInput] = useState<string>(data.input || '');
  const [category, setCategory] = useState<string>(data.category || '');
  const [model, setModel] = useState<string>(data.model || 'Claude 3 Haiku');

  const updateNodeData = () => {
    if (data) {
      data.input = input;
      data.category = category;
      data.model = model;
    }
  };

  useEffect(() => {
    updateNodeData();
  }, [input, category, model]);

  return (
    <div className="bg-white rounded-lg shadow-md min-w-[32rem]">
      <Handle type="target" position={Position.Top} />
      <div className="bg-pink-50 p-4 rounded-t-lg flex items-center gap-3">
        <div className="bg-pink-600 text-white w-8 h-8 flex items-center justify-center rounded">
          AI
        </div>
        <div className="flex-grow">
          <div className="text-gray-600 text-sm">Using AI</div>
          <div className="text-gray-800 font-semibold">Categorizer</div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <label className="block font-medium mb-1">Input Text</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            rows={4}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Choose AI model</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option>Claude 3 Haiku</option>
            <option>Claude 3 Sonnet</option>
            <option>Claude 3 Opus</option>
          </select>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default CategorizerNode;