import { Handle, Position } from '@xyflow/react';
import { NodeData } from '../../types/types';

interface CombineTextNodeProps {
  data: NodeData;
  id: string;
}

const CombineTextNode: React.FC<CombineTextNodeProps> = ({ data, id }) => {
  return (
    <div className="bg-white rounded-lg shadow-md min-w-[32rem]">
      <Handle type="target" position={Position.Top} />
      <div className="bg-green-200 p-4 rounded-t-lg flex items-center gap-3">
        <div className="bg-green-400 text-white w-8 h-8 flex items-center justify-center rounded">
          CT
        </div>
        <div className="flex-grow">
          <div className="text-gray-600 text-sm">Data Processing</div>
          <div className="text-gray-800 font-semibold">Combine Text</div>
        </div>
      </div>
      <div className="p-4">
        <p className="text-gray-600">Combines text from all connected nodes</p>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default CombineTextNode;