import { Handle, Position } from '@xyflow/react';
import { useState } from 'react';
import { NodeData } from '../../types/types';

interface LinkedInNodeProps {
  data: NodeData;
  id: string;
}

const LinkedInNode: React.FC<LinkedInNodeProps> = ({ data, id }) => {
  const [profileUrl, setProfileUrl] = useState<string>(data.profileUrl || '');

  const updateNodeData = (): void => {
    data.profileUrl = profileUrl;
    
  };

  return (
    <div className="bg-white rounded-lg shadow-md min-w-[32rem]">
      <Handle type="target" position={Position.Top} />
      <div className="bg-blue-100 p-4 rounded-t-lg flex items-center gap-3">
        <div className="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded">
          LI
        </div>
        <div className="flex-grow">
          <div className="text-gray-600 text-sm">LinkedIn</div>
          <div className="text-gray-800 font-semibold">LinkedIn Profile Scraper</div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <label className="block font-medium mb-1">LinkedIn Profile URL</label>
          <input
            type="text"
            placeholder="https://www.linkedin.com/in/username/"
            value={profileUrl}
            onChange={(e) => setProfileUrl(e.target.value)}
            onBlur={updateNodeData}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default LinkedInNode;