import { Handle, Position } from '@xyflow/react';
import { useState, useEffect } from 'react';
import { NodeData } from '../../types/types';

interface PDFNodeProps {
  data: NodeData;
  id: string;
}

const PDFNode: React.FC<PDFNodeProps> = ({ data }) => {
  const [content, setContent] = useState<string>(data.content || '');
  const [title, setTitle] = useState<string>(data.title || 'Candidate Evaluation Report');


  useEffect(() => {
    data.content = content;
    data.title = title;
  }, [content, title, data]);

  return (
    <div className="bg-white rounded-lg shadow-md min-w-[32rem]">
      <Handle type="target" position={Position.Top} />
      <div className="bg-pink-200 p-4 rounded-t-lg flex items-center gap-3">
        <div className="bg-pink-400 text-white w-8 h-8 flex items-center justify-center rounded">
          PDF
        </div>
        <div className="flex-grow">
          <div className="text-gray-600 text-sm">PDF Generation</div>
          <div className="text-gray-800 font-semibold">Generate PDF</div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <label className="block font-medium mb-1">PDF Title</label>
          <input
            type="text"
            placeholder="Enter PDF title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Content</label>
          <textarea
            placeholder="Content will be populated from previous nodes"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            rows={4}
            readOnly={!!data._previous_results}
          />
          {data._previous_results && (
            <p className="text-sm text-green-600 mt-1">
              Content automatically populated from previous nodes
            </p>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default PDFNode;