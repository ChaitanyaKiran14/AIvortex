import { Handle, Position } from '@xyflow/react';
import { useState } from 'react';
import { NodeData } from '../../types/types';

interface TypeformNodeProps {
  data: NodeData;
  id: string;
}

const TypeformNode: React.FC<TypeformNodeProps> = ({ data, id }) => {
  const [formId, setFormId] = useState<string>(data.formId || '');
  const [apiKey, setApiKey] = useState<string>(data.apiKey || '');

  const updateNodeData = (): void => {
    data.formId = formId;
    data.apiKey = apiKey;
  };

  return (
    <div className="bg-white rounded-lg shadow-md min-w-[32rem]">
      <Handle type="target" position={Position.Top} />
      <div className="bg-purple-200 p-4 rounded-t-lg flex items-center gap-3">
        <div className="bg-purple-400 text-white w-8 h-8 flex items-center justify-center rounded">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 43 24" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden="true" role="img">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0 5.42456C0 1.8517 1.40765 0 3.78009 0C6.15215 0 7.56018 1.8517 7.56018 5.42456V16.2479C7.56018 19.8208 6.15252 21.6725 3.78009 21.6725C1.40765 21.6725 0 19.8208 0 16.2479V5.42456ZM25.4643 0H17.6512C10.6419 0 10.0894 3.027 10.0894 7.06301L10.0802 14.599C10.0802 18.8069 10.6082 21.6725 17.6784 21.6725H25.4643C32.4961 21.6725 33.0128 18.656 33.0128 14.62V7.07352C33.0128 3.027 32.4736 0 25.4643 0Z" fill="currentColor"></path>
</svg>
        </div>
        <div className="flex-grow">
          <div className="text-gray-600 text-sm">Data Source</div>
          <div className="text-gray-800 font-semibold">Typeform</div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <label className="block font-medium mb-1">Form ID</label>
          <input
            type="text"
            placeholder="Enter Typeform ID"
            value={formId}
            onChange={(e) => setFormId(e.target.value)}
            onBlur={updateNodeData}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">API Key</label>
          <input
            type="password"
            placeholder="Enter Typeform API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            onBlur={updateNodeData}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default TypeformNode;