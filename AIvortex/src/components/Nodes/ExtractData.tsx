import React, { useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { CustomNodeProps } from './types';

const ExtractData: React.FC<CustomNodeProps> = ({ data, id }) => {
  const [extractQuery, setExtractQuery] = useState<string>(data.extractQuery || '');
  const [context, setContext] = useState<string>(data.context || '');
  const [model, setModel] = useState<string>(data.model || 'Claude 3 Haiku');
  const [isEnabled, setIsEnabled] = useState<boolean>(data.isEnabled || false);

  const updateNodeData = () => {
    if (data) {
      data.extractQuery = extractQuery;
      data.context = context;
      data.model = model;
      data.isEnabled = isEnabled;
    }
  };

  useEffect(() => {
    updateNodeData();
  }, [extractQuery, context, model, isEnabled]);

  return (
    <div className="bg-white rounded-lg shadow-md min-w-[32rem]">
      <Handle type="target" position={Position.Top} />
      {/* ... existing JSX ... */}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default ExtractData;