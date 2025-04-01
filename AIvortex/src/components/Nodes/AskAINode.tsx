import { Handle, Position } from '@xyflow/react';
import { useState, useEffect } from 'react';
import { NodeData } from '../../types/types';

interface AskAINodeProps {
  data: NodeData;
  id: string;
  connectedCultureFitData?: string; 
}

const AskAINode: React.FC<AskAINodeProps> = ({ data, id, connectedCultureFitData }) => {
  const [prompt, setPrompt] = useState<string>(data.prompt || '');
  const [context, setContext] = useState<string>(data.context || '');
  const [model, setModel] = useState<string>(data.model || 'gemini-pro');

 
  useEffect(() => {
    data.prompt = prompt;
    data.context = context;
    data.model = model;
  }, [prompt, context, model, data]);

  useEffect(() => {
    if (connectedCultureFitData) {
      setContext(connectedCultureFitData);
      data.context = connectedCultureFitData;
    } else {
      setContext(data.context || '');
      data.context = data.context || '';
    }
  }, [connectedCultureFitData, data]);

  return (
    <div className="bg-white rounded-lg shadow-md min-w-[32rem]">
      <Handle type="target" position={Position.Top} />
      <div className="bg-pink-200 p-4 rounded-t-lg flex items-center gap-3">
        <div className="bg-pink-400 text-white w-8 h-8 flex items-center justify-center rounded">
          AI
        </div>
        <div className="flex-grow">
          <div className="text-gray-600 text-sm">Using AI</div>
          <div className="text-gray-800 font-semibold">Ask AI Model</div>
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
            placeholder="Enter additional context (or automatically populated from Culture Fit Node)"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className={`w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              connectedCultureFitData ? 'bg-gray-100' : ''
            }`}
            readOnly={!!connectedCultureFitData}
          />
          {connectedCultureFitData && (
            <p className="text-sm text-green-600 mt-1">
              Context automatically populated from Culture Fit Node
            </p>
          )}
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
            <option value="deepseek-r1">Deepseek R1</option>
          </select>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default AskAINode;