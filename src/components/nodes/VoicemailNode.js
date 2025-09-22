import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Voicemail } from 'lucide-react';

const VoicemailNode = ({ data }) => {
  // Data is already flattened from metadata in the API transformation
  const voicemailId = data?.voicemail_id;
  const name = data?.name;
  const email = data?.email;

  return (
    <div className="px-4 py-3 min-w-[200px] max-w-[250px] bg-red-50 border-2 border-red-500 rounded-lg shadow-md">
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      
      <div className="flex items-center gap-2 mb-2">
        <Voicemail className="w-4 h-4 text-red-600" />
        <span className="font-semibold text-sm">Voicemail</span>
      </div>
      
      <div className="space-y-2 text-xs">
        <div className="font-semibold text-red-800">
          {name || 'Voicemail Box'}
        </div>
        
        {voicemailId && (
          <div className="font-mono text-gray-600">
            ID: {voicemailId}
          </div>
        )}
        
        {email && (
          <div className="text-gray-600">
            Email: {email}
          </div>
        )}
      </div>
      
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
    </div>
  );
};

export default VoicemailNode;
