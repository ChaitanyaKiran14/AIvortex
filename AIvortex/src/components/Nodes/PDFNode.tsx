import { Handle, Position } from '@xyflow/react';
import { useState, useEffect } from 'react';
import { NodeData } from '../../types/types';
import { PDFNodeSchema } from '../../utils/validation';
import { z } from 'zod';

interface PDFNodeProps {
  data: NodeData;
  id: string;
}

const PDFNode: React.FC<PDFNodeProps> = ({ data }) => {
  const [content, setContent] = useState<string>(data.content || '');
  const [title, setTitle] = useState<string>(data.title || 'Candidate Evaluation Report');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    try {
      PDFNodeSchema.parse({ title, content });
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
    data.content = content;
    data.title = title;
    data.isValid = validate();
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
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
        </div>
        <div>
          <label className="block font-medium mb-1">Content</label>
          <textarea
            placeholder="Content will be populated from previous nodes"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
              errors.content ? 'border-red-500' : 'border-gray-300'
            }`}
            rows={4}
            readOnly={!!data._previous_results}
          />
          {errors.content && <p className="text-sm text-red-600 mt-1">{errors.content}</p>}
          {data._previous_results && (
            <p className="text-sm text-green-600 mt-1">Content automatically populated from previous nodes</p>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default PDFNode;