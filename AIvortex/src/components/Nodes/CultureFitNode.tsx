import { Handle, Position } from '@xyflow/react';
import { useState, useEffect } from 'react';
import { NodeData } from '../../types/types';
import { CultureFitNodeSchema } from '../../utils/validation';
import { z } from 'zod';

interface CultureFitNodeProps {
  data: NodeData;
  id: string;
}

const CultureFitNode: React.FC<CultureFitNodeProps> = ({ data }) => {
  const [companyValues, setCompanyValues] = useState<string>(data.companyValues || '');
  const [weights, setWeights] = useState<{ [key: string]: number }>(
    data.weights || {
      resourcefulness: 5,
      optimism: 4,
      excitement: 4,
      reliability: 3,
      teamwork: 3,
    }
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const formatCultureFitData = () => {
    const weightsString = Object.entries(weights)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
    return `Company Values: ${companyValues}\nWeights: ${weightsString}`;
  };

  const validate = () => {
    try {
      CultureFitNodeSchema.parse({ companyValues, weights });
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
    data.companyValues = companyValues;
    data.weights = weights;
    data.cultureFitContext = formatCultureFitData();
    data.isValid = validate();
  }, [companyValues, weights, data]);

  const handleWeightChange = (key: string, value: number) => {
    if (value < 1 || value > 10) return;
    setWeights({ ...weights, [key]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-md min-w-[32rem]">
      <Handle type="target" position={Position.Top} />
      <div className="bg-green-200 p-4 rounded-t-lg flex items-center gap-3">
        <div className="bg-green-400 text-white w-8 h-8 flex items-center justify-center rounded">
          CF
        </div>
        <div className="flex-grow">
          <div className="text-gray-600 text-sm">Analysis</div>
          <div className="text-gray-800 font-semibold">Culture Fit</div>
        </div>
      </div>
      <div className="p-4 space-y-4">
        <div>
          <label className="block font-medium mb-1">Company Values</label>
          <textarea
            placeholder="Describe your company's core values and culture"
            value={companyValues}
            onChange={(e) => setCompanyValues(e.target.value)}
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.companyValues ? 'border-red-500' : 'border-gray-300'
            }`}
            rows={4}
          />
          {errors.companyValues && <p className="text-sm text-red-600 mt-1">{errors.companyValues}</p>}
        </div>
        <div>
          <label className="block font-medium mb-1">Value Weights (1-10)</label>
          <div className="space-y-2">
            {Object.entries(weights).map(([key, value]) => (
              <div key={key} className="flex items-center">
                <span className="w-1/3 capitalize">{key}</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={value}
                  onChange={(e) => handleWeightChange(key, parseInt(e.target.value))}
                  className="w-1/2 mx-2"
                />
                <span className="w-8 text-center">{value}</span>
              </div>
            ))}
          </div>
          {errors.weights && <p className="text-sm text-red-600 mt-1">{errors.weights}</p>}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default CultureFitNode;