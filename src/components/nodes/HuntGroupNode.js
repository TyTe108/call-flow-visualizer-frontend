import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Users2, ArrowRightLeft } from 'lucide-react';

const HuntGroupNode = ({ data }) => {
  // Data is already flattened from metadata in the API transformation
  const huntGroupId = data?.hunt_group_id;
  const name = data?.name;
  const strategy = data?.strategy;
  const memberCount = data?.member_count || 0;

  return (
    <div className="px-4 py-3 min-w-[200px] max-w-[250px] bg-yellow-50 border-2 border-yellow-500 rounded-lg shadow-md">
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      
      <div className="flex items-center gap-2 mb-2">
        <Users2 className="w-4 h-4 text-yellow-600" />
        <span className="font-semibold text-sm">Hunt Group</span>
      </div>
      
      <div className="space-y-2 text-xs">
        <div className="font-semibold text-yellow-800">
          {name || 'Hunt Group'}
        </div>
        
        {huntGroupId && (
          <div className="font-mono text-gray-600">
            ID: {huntGroupId}
          </div>
        )}
        
        {strategy && (
          <div className="flex items-center gap-1 text-gray-600">
            <ArrowRightLeft className="w-3 h-3" />
            <span>{strategy}</span>
          </div>
        )}
        
        <div className="text-gray-500">
          Members: {memberCount}
        </div>
      </div>
      
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
    </div>
  );
};

export default HuntGroupNode;
