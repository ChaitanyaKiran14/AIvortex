import { Handle, Position } from '@xyflow/react';
import { useState, useEffect } from 'react';
import { NodeData } from '../../types/types';
import { LinkedInNodeSchema } from '../../utils/validation';
import { z } from 'zod';

interface LinkedInNodeProps {
  data: NodeData;
  id: string;
}

const LinkedInNode: React.FC<LinkedInNodeProps> = ({ data }) => {
  const [profileUrl, setProfileUrl] = useState<string>(data.profileUrl || '');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    try {
      LinkedInNodeSchema.parse({ profileUrl });
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
    data.profileUrl = profileUrl;
    data.isValid = validate();
  }, [profileUrl, data]);

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
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.profileUrl ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.profileUrl && <p className="text-sm text-red-600 mt-1">{errors.profileUrl}</p>}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default LinkedInNode;