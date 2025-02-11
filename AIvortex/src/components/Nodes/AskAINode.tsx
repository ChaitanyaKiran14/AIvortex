
import React, { useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { CustomNodeProps } from './types';

const AskAINode: React.FC<CustomNodeProps> = ({ data, id }) => {
  const [prompt, setPrompt] = useState<string>(data.prompt || '');
  const [context, setContext] = useState<string>(data.context || '');
  const [model, setModel] = useState<string>(data.model || 'Claude 3 Haiku');

  const updateNodeData = () => {
    if (data) {
      data.prompt = prompt;
      data.context = context;
      data.model = model;
    }
  };

  useEffect(() => {
    updateNodeData();
  }, [prompt, context, model]);

  return (
    <div className="bg-white rounded-lg shadow-md min-w-[32rem]">
      <Handle type="target" position={Position.Top} />
      {/* ... existing JSX ... */}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default AskAINode;