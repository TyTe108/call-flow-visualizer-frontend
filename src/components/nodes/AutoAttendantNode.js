import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Settings, Play } from 'lucide-react';

const AutoAttendantNode = ({ data }) => {
  // Data is already flattened from metadata in the API transformation
  const attendantName = data?.attendant_name;
  const user = data?.user;
  const startingPrompt = data?.starting_prompt;
  const optionCount = data?.option_count || 0;

  return (
    <div className="px-4 py-3 min-w-[200px] max-w-[250px] bg-green-50 border-2 border-green-500 rounded-lg shadow-md">
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      
      <div className="flex items-center gap-2 mb-2">
        <Settings className="w-4 h-4 text-green-600" />
        <span className="font-semibold text-sm">Auto Attendant</span>
      </div>
      
      <div className="space-y-2 text-xs">
        <div className="font-semibold text-green-800">
          {attendantName || 'Unnamed'}
        </div>
        
        {user && (
          <div className="text-gray-600">
            User: {user}
          </div>
        )}
        
        {startingPrompt && (
          <div className="flex items-center gap-1 text-gray-600">
            <Play className="w-3 h-3" />
            <span>Prompt: {startingPrompt}</span>
          </div>
        )}
        
        <div className="text-gray-500">
          Options: {optionCount}
        </div>
      </div>
      
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
    </div>
  );
};

export default AutoAttendantNode;
