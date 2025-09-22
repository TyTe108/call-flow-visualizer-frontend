import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Users, Clock } from 'lucide-react';

const CallQueueNode = ({ data }) => {
  // Data is already flattened from metadata in the API transformation
  const callqueue = data?.callqueue;
  const name = data?.name;
  const description = data?.description;
  const dispatchType = data?.dispatch_type;
  const countAgentsTotal = data?.count_agents_total || 0;
  const countAgentsAvailable = data?.count_agents_available || 0;
  const activeQueuedCalls = data?.active_queued_calls_total || 0;
  const isAcceptingNewCalls = data?.is_accepting_new_calls;

  return (
    <div className={`px-4 py-3 min-w-[200px] max-w-[250px] ${isAcceptingNewCalls ? 'bg-purple-50' : 'bg-gray-50'} border-2 ${isAcceptingNewCalls ? 'border-purple-500' : 'border-gray-400'} rounded-lg shadow-md cursor-pointer`}>
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      
      <div className="flex items-center gap-2 mb-2">
        <Users className="w-4 h-4 text-purple-600" />
        <span className="font-semibold text-sm">Call Queue</span>
        {isAcceptingNewCalls && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Accepting</span>}
      </div>
      
      <div className="space-y-2 text-xs">
        <div className="font-semibold text-purple-800">
          {name || callqueue || 'Unnamed Queue'}
        </div>
        
        {description && (
          <div className="text-gray-600">
            {description}
          </div>
        )}
        
        <div className="flex items-center gap-1 text-gray-600">
          <Clock className="w-3 h-3" />
          <span>{dispatchType} Dispatch</span>
        </div>
        
        <div className="text-xs">
          <div className="text-gray-500">Agents</div>
          <div className="font-semibold">{countAgentsTotal}</div>
        </div>
      </div>
      
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
    </div>
  );
};

export default CallQueueNode;
