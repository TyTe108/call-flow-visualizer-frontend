import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { User, Mail, Building } from 'lucide-react';

const UserNode = ({ data }) => {
  // Data is already flattened from metadata in the API transformation
  const userId = data?.user_id;
  const fullName = data?.full_name;
  const email = data?.email;
  const department = data?.department;
  const site = data?.site;
  const isActive = data?.is_active;
  const voicemailEnabled = data?.voicemail_enabled;

  return (
    <div className="px-4 py-3 min-w-[200px] max-w-[250px] bg-orange-50 border-2 border-orange-500 rounded-lg shadow-md cursor-pointer">
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      
      <div className="flex items-center gap-2 mb-2">
        <User className="w-4 h-4 text-orange-600" />
        <span className="font-semibold text-sm">User</span>
      </div>
      
      <div className="space-y-2 text-xs">
        <div className="font-semibold text-orange-800">
          {fullName || 'Unknown User'}
        </div>
        
        {userId && (
          <div className="font-mono text-gray-600">
            {userId}
          </div>
        )}
        
        {email && (
          <div className="flex items-center gap-1 text-gray-600">
            <Mail className="w-3 h-3" />
            <span>{email}</span>
          </div>
        )}
        
        {department && (
          <div className="flex items-center gap-1 text-gray-600">
            <Building className="w-3 h-3" />
            <span>{department}</span>
          </div>
        )}
        
        {site && site !== 'n/a' && (
          <div className="text-gray-500">
            Site: {site}
          </div>
        )}
        
      </div>
      
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
    </div>
  );
};

export default UserNode;
