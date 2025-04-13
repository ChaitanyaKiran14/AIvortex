import { Handle, Position } from '@xyflow/react';
import { useState, useEffect } from 'react';
import { NodeData } from '../../types/types';

interface LinkedInNodeProps {
  data: NodeData;
  id: string;
}

const LinkedInNode: React.FC<LinkedInNodeProps> = ({ data}) => {
  const [profileUrl, setProfileUrl] = useState<string>(data.profileUrl || '');
  const [urlError, setUrlError] = useState<string>('');

  
  const validateUrl = (url: string) => {
    const linkedInRegex = /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
    if (!url) {
      setUrlError('LinkedIn profile URL is required.');
    } else if (!linkedInRegex.test(url)) {
      setUrlError('Please enter a valid LinkedIn profile URL (e.g., https://www.linkedin.com/in/username/).');
    } else {
      setUrlError('');
    }
  };

  useEffect(() => {
    validateUrl(profileUrl);
    data.profileUrl = profileUrl;
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
              urlError ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {urlError && <p className="text-sm text-red-600 mt-1">{urlError}</p>}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default LinkedInNode;