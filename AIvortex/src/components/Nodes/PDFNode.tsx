import React, { useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { useDispatch } from 'react-redux';
import { updateNodeData } from '../../store/slices/nodesSlice';
import { NodeData } from '../../types';
import { jsPDF } from 'jspdf';

interface PDFNodeProps {
  id: string;
  data: NodeData;
}

const PDFNode: React.FC<PDFNodeProps> = ({ data, id }) => {
  const dispatch = useDispatch();
  const [content, setContent] = useState<string>(data.content || '');

  useEffect(() => {
    dispatch(updateNodeData({ id, data: { content } }));
  }, [content, dispatch, id]);

  const generatePDF = (): void => {
    const doc = new jsPDF();
    doc.text(content, 10, 10);
    doc.save(`output-${id}.pdf`);
  };

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
          <label className="block font-medium mb-1">Content</label>
          <textarea
            placeholder="Enter content for PDF"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            rows={4}
          />
        </div>

        <button
          onClick={generatePDF}
          className="w-full bg-pink-200 text-white py-2 px-4 rounded hover:bg-pink-400 transition-colors"
        >
          Generate PDF
        </button>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default PDFNode;