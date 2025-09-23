import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Phone, PhoneCall } from 'lucide-react';

const DidNode = ({ data }) => {
  // Data is already flattened from metadata in the API transformation
  const phoneNumber = data?.phone_number;
  const isActive = data?.is_active;
  const destination = data?.destination_identifier;

  return (
    <div className="px-4 py-2 min-w-[200px] max-w-[250px] bg-blue-50 border-2 border-blue-500 rounded-lg shadow-md cursor-pointer">
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      
      <div className="flex items-center gap-2 mb-2">
        <Phone className="w-4 h-4 text-blue-600" />
        <span className="font-semibold text-sm">DID</span>
      </div>
      
      <div className="space-y-1 text-xs">
        <div className="font-mono text-sm font-semibold text-blue-800">
          {phoneNumber || 'No Number'}
        </div>
        
        {destination && (
          <div className="flex items-center gap-1 text-gray-600">
            <PhoneCall className="w-3 h-3" />
            <span>→ {destination}</span>
          </div>
        )}
        
        {data?.dial_rule_application && (
          <div className="text-gray-500">
            Rule: {data.dial_rule_application}
          </div>
        )}
      </div>
      
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
    </div>
  );
};

export default DidNode;
