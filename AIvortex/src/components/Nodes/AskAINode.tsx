import { Handle, Position } from '@xyflow/react';
import { useState, useEffect } from 'react';
import { NodeData } from '../../types/types';
import { AskAINodeSchema } from '../../utils/validation';
import { z } from 'zod';

interface AskAINodeProps {
  data: NodeData;
  id: string;
  connectedCultureFitData?: string;
}

const AskAINode: React.FC<AskAINodeProps> = ({ data, connectedCultureFitData }) => {
  const [prompt, setPrompt] = useState<string>(data.prompt || '');
  const [context, setContext] = useState<string>(data.context || '');
  const [model, setModel] = useState<string>(data.model || 'gemini-2.0-flash-thinking-exp-01-21');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    try {
      AskAINodeSchema.parse({ prompt, context, model });
      setErrors({});
      return true;
    } catch (e) {
      if (e instanceof z.ZodError) {
        const errorObj: { [key: string]: string } = {};
        e.errors.forEach((err) => {
          if (err.path[0]) errorObj[err.path[0]] = err.message;
        });
        setErrors(errorObj);
        return false;
      }
      return false;
    }
  };

  useEffect(() => {
    validate();
    data.prompt = prompt;
    data.context = context;
    data.model = model;
    data.isValid = validate();
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
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              errors.prompt ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.prompt && <p className="text-sm text-red-600 mt-1">{errors.prompt}</p>}
        </div>
        <div>
          <label className="block font-medium mb-1">Context</label>
          <input
            type="text"
            placeholder="Enter additional context (or automatically populated from Culture Fit Node)"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              connectedCultureFitData ? 'bg-gray-100' : errors.context ? 'border-red-500' : 'border-gray-300'
            }`}
            readOnly={!!connectedCultureFitData}
          />
          {errors.context && <p className="text-sm text-red-600 mt-1">{errors.context}</p>}
          {connectedCultureFitData && (
            <p className="text-sm text-green-600 mt-1">Context automatically populated from Culture Fit Node</p>
          )}
        </div>
        <div>
          <label className="block font-medium mb-1">Choose AI model</label>
          <select
            title="Select AI model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              errors.model ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="gemini-2.0-flash-thinking-exp-01-21">Gemini 2.0 Flash Thinking Experimental</option>
            <option value="deepseek-r1">DeepSeek R1</option>
          </select>
          {errors.model && <p className="text-sm text-red-600 mt-1">{errors.model}</p>}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default AskAINode;