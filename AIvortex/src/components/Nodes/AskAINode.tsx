import React, { useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { useDispatch } from 'react-redux';
import { updateNodeData } from '../../store/slices/nodesSlice';
import { NodeData } from '../../types';

interface AskAINodeProps {
  id: string;
  data: NodeData;
}

const AskAINode: React.FC<AskAINodeProps> = ({ data, id }) => {
  const dispatch = useDispatch();
  const [prompt, setPrompt] = useState(data.prompt || '');
  const [context, setContext] = useState(data.context || '');
  const [model, setModel] = useState(data.model || 'gemini-pro');

  useEffect(() => {
    dispatch(updateNodeData({ id, data: { prompt, context, model } }));
  }, [prompt, context, model, dispatch, id]);

  return (
    <div className="bg-white rounded-lg shadow-md min-w-[32rem]">
      <Handle type="target" position={Position.Top} />
      <div className="bg-indigo-50 p-4 rounded-t-lg flex items-center gap-3">
        <div className="bg-indigo-600 text-white w-8 h-8 flex items-center justify-center rounded">
          AI
        </div>
        <div className="flex-grow">
          <div className="text-gray-600 text-sm">Using AI</div>
          <div className="text-gray-800 font-semibold">Ask Gemini AI</div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <label className="block font-medium mb-1">Prompt</label>
          <input
            type="text"
            placeholder="Enter your prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Context</label>
          <input
            type="text"
            placeholder="Enter additional context"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Choose AI model</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="gemini-pro">Gemini Pro</option>
            <option value="gemini-pro-vision">Gemini Pro Vision</option>
            <option value="gemini-ultra">Gemini Ultra</option>
          </select>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default AskAINode;
