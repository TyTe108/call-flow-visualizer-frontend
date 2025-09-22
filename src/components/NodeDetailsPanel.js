import React from 'react';
import { X, Phone, User, Settings, Users, Voicemail, Users2 } from 'lucide-react';

const NodeDetailsPanel = ({ selectedNode, onClose }) => {
  if (!selectedNode) return null;

  const { data, type } = selectedNode;
  const metadata = data || {};

  const getNodeIcon = (nodeType) => {
    switch (nodeType) {
      case 'did': return Phone;
      case 'user': return User;
      case 'auto_attendant': return Settings;
      case 'call_queue': return Users;
      case 'voicemail': return Voicemail;
      case 'hunt_group': return Users2;
      default: return Settings;
    }
  };

  const IconComponent = getNodeIcon(type);

  const formatKey = (key) => {
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatValue = (value) => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <IconComponent className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800 capitalize">
            {type.replace(/_/g, ' ')} Details
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="p-3 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600">Node ID</p>
          <p className="font-mono text-sm text-gray-800">{selectedNode.id}</p>
        </div>
        
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Properties</h4>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {Object.entries(metadata).map(([key, value]) => (
              <div key={key} className="p-2 border border-gray-200 rounded-md">
                <p className="text-xs font-medium text-gray-600 mb-1">
                  {formatKey(key)}
                </p>
                <p className="text-sm text-gray-800 break-words">
                  {formatValue(value)}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-blue-50 rounded-md">
              <p className="text-blue-600">Position</p>
              <p className="text-blue-800">
                ({Math.round(selectedNode.position.x)}, {Math.round(selectedNode.position.y)})
              </p>
            </div>
            <div className="p-2 bg-green-50 rounded-md">
              <p className="text-green-600">Type</p>
              <p className="text-green-800 capitalize">{type.replace(/_/g, ' ')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodeDetailsPanel;
