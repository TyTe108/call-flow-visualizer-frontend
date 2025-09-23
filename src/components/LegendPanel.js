import React from 'react';
import { 
  Phone, 
  Settings, 
  Users, 
  User, 
  Voicemail, 
  Users2,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  ArrowLeft
} from 'lucide-react';

const LegendPanel = () => {
  const nodeTypes = [
    {
      type: 'DID (Direct Inward Dialing)',
      description: 'Phone numbers that receive incoming calls',
      icon: <Phone className="w-4 h-4 text-blue-600" />,
      color: 'bg-blue-50 border-blue-500',
      textColor: 'text-blue-800',
      example: 'Phone number entry point'
    },
    {
      type: 'Auto Attendant',
      description: 'Automated menu system for call routing',
      icon: <Settings className="w-4 h-4 text-green-600" />,
      color: 'bg-green-50 border-green-500',
      textColor: 'text-green-800',
      example: 'Interactive voice response system'
    },
    {
      type: 'Call Queue',
      description: 'Holds calls while waiting for available agents',
      icon: <Users className="w-4 h-4 text-purple-600" />,
      color: 'bg-purple-50 border-purple-500',
      textColor: 'text-purple-800',
      example: 'Call holding system for agents'
    },
    {
      type: 'User',
      description: 'Individual phone system users/agents',
      icon: <User className="w-4 h-4 text-orange-600" />,
      color: 'bg-orange-50 border-orange-500',
      textColor: 'text-orange-800',
      example: 'Individual phone system users'
    },
    {
      type: 'Voicemail',
      description: 'Voicemail boxes for message storage',
      icon: <Voicemail className="w-4 h-4 text-red-600" />,
      color: 'bg-red-50 border-red-500',
      textColor: 'text-red-800',
      example: 'Message storage system'
    },
    {
      type: 'Hunt Group',
      description: 'Groups of users that calls can be distributed to',
      icon: <Users2 className="w-4 h-4 text-yellow-600" />,
      color: 'bg-yellow-50 border-yellow-500',
      textColor: 'text-yellow-800',
      example: 'Call distribution group'
    }
  ];

  const edgeTypes = [
    {
      type: 'to_auto_attendant',
      description: 'Call routed to auto attendant',
      color: '#3b82f6',
      style: 'Smooth curved line',
      example: 'DID → Auto Attendant'
    },
    {
      type: 'to_user',
      description: 'Call routed to specific user',
      color: '#10b981',
      style: 'Smooth curved line',
      example: 'Auto Attendant → User'
    },
    {
      type: 'to_queue',
      description: 'Call routed to call queue',
      color: '#8b5cf6',
      style: 'Smooth curved line',
      example: 'Auto Attendant → Call Queue'
    },
    {
      type: 'agent',
      description: 'User is agent in queue',
      color: '#f59e0b',
      style: 'Straight dashed line',
      example: 'User ↔ Call Queue (agent relationship)'
    },
    {
      type: 'to_voicemail',
      description: 'Call routed to voicemail',
      color: '#ef4444',
      style: 'Smooth curved line',
      example: 'User → Voicemail (when unavailable)'
    }
  ];

  const interactionTypes = [
    {
      action: 'Hover over node',
      description: 'Highlights connected edges in red, dims other edges',
      visual: 'Red thick lines, gray thin lines'
    },
    {
      action: 'Click on node',
      description: 'Shows detailed information in right panel',
      visual: 'Node details panel appears'
    },
    {
      action: 'Edge labels',
      description: 'Show connection type in uppercase',
      visual: 'Labels on each connection line'
    }
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Call Flow Legend
      </h3>

      {/* Node Types Section */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Node Types</h4>
        <div className="space-y-3">
          {nodeTypes.map((node, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className={`p-2 rounded-lg border-2 ${node.color} flex-shrink-0`}>
                {node.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-semibold text-sm ${node.textColor}`}>
                    {node.type}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-1">{node.description}</p>
                <p className="text-xs text-gray-500 italic">{node.example}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edge Types Section */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Connection Types</h4>
        <div className="space-y-3">
          {edgeTypes.map((edge, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div 
                  className="w-8 h-1 rounded"
                  style={{ backgroundColor: edge.color }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-gray-800">
                    {edge.type.replace(/_/g, ' ').toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500">({edge.style})</span>
                </div>
                <p className="text-xs text-gray-600 mb-1">{edge.description}</p>
                <p className="text-xs text-gray-500 italic">{edge.example}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interaction Section */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Interactions</h4>
        <div className="space-y-2">
          {interactionTypes.map((interaction, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="font-medium text-sm text-gray-800">{interaction.action}</span>
                <p className="text-xs text-gray-600 mb-1">{interaction.description}</p>
                <p className="text-xs text-gray-500 italic">{interaction.visual}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default LegendPanel;
