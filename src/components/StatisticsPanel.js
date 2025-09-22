import React from 'react';
import { BarChart3, Users, Phone, Settings, Clock } from 'lucide-react';

const StatisticsPanel = ({ statistics, graphId }) => {
  if (!statistics) return null;

  const { 
    total_nodes, 
    total_edges, 
    node_type_counts, 
    edge_type_counts,
    connected_components,
    isolated_nodes,
    density
  } = statistics;

  const nodeTypeIcons = {
    did: Phone,
    user: Users,
    auto_attendant: Settings,
    call_queue: Clock,
    voicemail: Phone,
    hunt_group: Users
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Graph Statistics</h3>
      
      {graphId && (
        <div className="mb-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Graph ID:</span> {graphId}
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 rounded-md">
          <div className="text-2xl font-bold text-gray-800">{total_nodes}</div>
          <div className="text-sm text-gray-600">Total Nodes</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-md">
          <div className="text-2xl font-bold text-gray-800">{total_edges}</div>
          <div className="text-sm text-gray-600">Total Edges</div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Node Types</h4>
          <div className="space-y-2">
            {Object.entries(node_type_counts).map(([type, count]) => {
              const IconComponent = nodeTypeIcons[type] || Settings;
              return (
                <div key={type} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-4 h-4 text-gray-600" />
                    <span className="text-sm capitalize">{type.replace(/_/g, ' ')}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-800">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Edge Types</h4>
          <div className="space-y-2">
            {Object.entries(edge_type_counts).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <span className="text-sm capitalize">{type.replace(/_/g, ' ')}</span>
                <span className="text-sm font-medium text-gray-800">{count}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 bg-blue-50 rounded-md text-center">
            <div className="font-medium text-blue-800">{connected_components}</div>
            <div className="text-blue-600">Components</div>
          </div>
          <div className="p-2 bg-orange-50 rounded-md text-center">
            <div className="font-medium text-orange-800">{isolated_nodes}</div>
            <div className="text-orange-600">Isolated</div>
          </div>
        </div>
        
        <div className="p-2 bg-green-50 rounded-md text-center">
          <div className="text-sm font-medium text-green-800">
            Density: {(density * 100).toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPanel;
