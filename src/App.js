import React, { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Custom node components
import DidNode from './components/nodes/DidNode';
import AutoAttendantNode from './components/nodes/AutoAttendantNode';
import CallQueueNode from './components/nodes/CallQueueNode';
import UserNode from './components/nodes/UserNode';
import VoicemailNode from './components/nodes/VoicemailNode';
import HuntGroupNode from './components/nodes/HuntGroupNode';

// UI Components
import DomainSelector from './components/DomainSelector';
import StatisticsPanel from './components/StatisticsPanel';
import NodeDetailsPanel from './components/NodeDetailsPanel';

// API Service
import { callFlowAPI } from './services/api';

// Custom node types
const nodeTypes = {
  did: DidNode,
  auto_attendant: AutoAttendantNode,
  call_queue: CallQueueNode,
  user: UserNode,
  voicemail: VoicemailNode,
  hunt_group: HuntGroupNode,
};

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [currentGraphId, setCurrentGraphId] = useState(null);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  const handleLoadGraph = useCallback(async (domain, graphId) => {
    setLoading(true);
    setError(null);
    setSelectedNode(null);
    
    try {
      const data = await callFlowAPI.getCallFlowByDomain(domain, graphId);
      const { nodes: transformedNodes, edges: transformedEdges } = callFlowAPI.transformToXYFlowData(data);
      
      setNodes(transformedNodes);
      setEdges(transformedEdges);
      setStatistics(data.statistics);
      setCurrentGraphId(data.graph_id);
    } catch (err) {
      setError(err.message || 'Failed to load call flow data');
      console.error('Error loading graph:', err);
    } finally {
      setLoading(false);
    }
  }, [setNodes, setEdges]);

  const defaultViewport = { x: 0, y: 0, zoom: 0.8 };

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Call Flow Visualizer</h1>
          <div className="text-sm text-gray-600">
            Interactive visualization of phone system call flows
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
          <DomainSelector onLoadGraph={handleLoadGraph} loading={loading} />
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          )}

          <StatisticsPanel statistics={statistics} graphId={currentGraphId} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* Graph Visualization */}
          <div className="flex-1 relative">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              defaultViewport={defaultViewport}
              fitView
              fitViewOptions={{
                padding: 0.2,
                minZoom: 0.5,
                maxZoom: 1.5
              }}
              attributionPosition="bottom-left"
              nodesDraggable={true}
              nodesConnectable={false}
              elementsSelectable={true}
            >
              <Controls />
              <MiniMap 
                nodeStrokeColor={(n) => {
                  if (n.type === 'did') return '#3b82f6';
                  if (n.type === 'auto_attendant') return '#10b981';
                  if (n.type === 'call_queue') return '#8b5cf6';
                  if (n.type === 'user') return '#f59e0b';
                  if (n.type === 'voicemail') return '#ef4444';
                  if (n.type === 'hunt_group') return '#eab308';
                  return '#6b7280';
                }}
                nodeColor={(n) => {
                  if (n.type === 'did') return '#dbeafe';
                  if (n.type === 'auto_attendant') return '#d1fae5';
                  if (n.type === 'call_queue') return '#ede9fe';
                  if (n.type === 'user') return '#fef3c7';
                  if (n.type === 'voicemail') return '#fee2e2';
                  if (n.type === 'hunt_group') return '#fef9c3';
                  return '#f3f4f6';
                }}
                nodeBorderRadius={8}
                maskColor="rgba(255, 255, 255, 0.8)"
              />
              <Background variant="dots" gap={12} size={1} />
            </ReactFlow>
          </div>

          {/* Right Sidebar - Node Details */}
          {selectedNode && (
            <div className="w-80 bg-gray-50 border-l border-gray-200 overflow-y-auto">
              <NodeDetailsPanel 
                selectedNode={selectedNode} 
                onClose={() => setSelectedNode(null)} 
              />
            </div>
          )}
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-700">Loading call flow data...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
