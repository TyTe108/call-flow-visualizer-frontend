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
import LegendPanel from './components/LegendPanel';

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
  const [highlightedEdges, setHighlightedEdges] = useState(new Set());
  
  // Focus flow state
  const [focusMode, setFocusMode] = useState(false);
  const [focusedNodeId, setFocusedNodeId] = useState(null);
  const [originalNodes, setOriginalNodes] = useState([]);
  const [originalEdges, setOriginalEdges] = useState([]);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  // Function to find all downstream nodes from a given node
  const findDownstreamNodes = useCallback((nodeId, allEdges) => {
    const visited = new Set();
    const downstream = new Set([nodeId]);
    
    const traverse = (currentNodeId) => {
      if (visited.has(currentNodeId)) return;
      visited.add(currentNodeId);
      
      // Find all edges where current node is the source
      const outgoingEdges = allEdges.filter(edge => edge.source === currentNodeId);
      
      outgoingEdges.forEach(edge => {
        downstream.add(edge.target);
        traverse(edge.target);
      });
    };
    
    traverse(nodeId);
    return downstream;
  }, []);

  // Function to rearrange nodes in a focused layout
  const rearrangeFocusedLayout = useCallback((nodesToShow, edgesToShow) => {
    const startY = 100;
    const nodeSpacing = 180;
    const columnWidth = 350;
    const centerX = 400;
    
    // Group nodes by their position in the flow (approximated by node type)
    const nodeTypeOrder = ['did', 'auto_attendant', 'call_queue', 'hunt_group', 'user', 'voicemail'];
    
    // Create a more organized layout for focused nodes
    const rearrangedNodes = nodesToShow.map((node, index) => {
      const typeIndex = nodeTypeOrder.indexOf(node.type) !== -1 ? nodeTypeOrder.indexOf(node.type) : 0;
      const x = centerX + (typeIndex - 2) * columnWidth; // Center around the middle
      const y = startY + (index * nodeSpacing);
      
      return {
        ...node,
        position: { x, y },
        style: {
          ...node.style,
          border: '2px solid #3b82f6',
          boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.1), 0 2px 4px -1px rgba(59, 130, 246, 0.06)',
        }
      };
    });
    
    return rearrangedNodes;
  }, []);

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
    
    // Toggle focus mode
    if (focusMode && focusedNodeId === node.id) {
      // If clicking the same focused node, exit focus mode
      setFocusMode(false);
      setFocusedNodeId(null);
      setNodes(originalNodes);
      setEdges(originalEdges);
    } else if (focusMode && focusedNodeId !== node.id) {
      // If in focus mode but clicking different node, switch focus
      const downstreamNodes = findDownstreamNodes(node.id, originalEdges);
      const filteredNodes = originalNodes.filter(n => downstreamNodes.has(n.id));
      const filteredEdges = originalEdges.filter(e => 
        downstreamNodes.has(e.source) && downstreamNodes.has(e.target)
      );
      
      const rearrangedNodes = rearrangeFocusedLayout(filteredNodes, filteredEdges);
      
      setFocusedNodeId(node.id);
      setNodes(rearrangedNodes);
      setEdges(filteredEdges);
    } else {
      // Enter focus mode for the first time
      const downstreamNodes = findDownstreamNodes(node.id, edges);
      const filteredNodes = nodes.filter(n => downstreamNodes.has(n.id));
      const filteredEdges = edges.filter(e => 
        downstreamNodes.has(e.source) && downstreamNodes.has(e.target)
      );
      
      // Store original state before entering focus mode
      setOriginalNodes(nodes);
      setOriginalEdges(edges);
      
      const rearrangedNodes = rearrangeFocusedLayout(filteredNodes, filteredEdges);
      
      setFocusMode(true);
      setFocusedNodeId(node.id);
      setNodes(rearrangedNodes);
      setEdges(filteredEdges);
    }
  }, [focusMode, focusedNodeId, nodes, edges, originalNodes, originalEdges, findDownstreamNodes, rearrangeFocusedLayout]);

  const onNodeMouseEnter = useCallback((event, node) => {
    // Find all edges connected to this node
    const connectedEdges = edges
      .filter(edge => edge.source === node.id || edge.target === node.id)
      .map(edge => edge.id);
    
    setHighlightedEdges(new Set(connectedEdges));
    
    // Now that we've fixed the handle issue, let's implement proper highlighting
    setEdges(currentEdges => 
      currentEdges.map(edge => {
        const isHighlighted = connectedEdges.includes(edge.id);
        const shouldDim = connectedEdges.length > 0 && !isHighlighted;
        
        return {
          ...edge,
          style: {
            ...edge.style,
            strokeWidth: isHighlighted ? 3 : 1.5,
            opacity: shouldDim ? 0.3 : 1,
            stroke: edge.style?.stroke || '#6b7280',
          }
        };
      })
    );
  }, [edges, setEdges]);

  const onNodeMouseLeave = useCallback(() => {
    setHighlightedEdges(new Set());
    
    // Restore original edge styles
    setEdges(currentEdges => 
      currentEdges.map(edge => ({
        ...edge,
        style: {
          ...edge.style,
          strokeWidth: 1.5,
          opacity: 1,
          stroke: edge.style?.stroke || '#6b7280',
        }
      }))
    );
  }, [setEdges]);

  const handleLoadGraph = useCallback(async (domain, graphId) => {
    setLoading(true);
    setError(null);
    setSelectedNode(null);
    setHighlightedEdges(new Set());
    
    // Reset focus mode when loading new graph
    setFocusMode(false);
    setFocusedNodeId(null);
    setOriginalNodes([]);
    setOriginalEdges([]);
    
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

  // Removed edgesWithHighlighting - now handling highlighting directly in mouse events

  const defaultViewport = { x: 0, y: 0, zoom: 0.8 };

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Custom CSS for edge highlighting */}
      <style>
        {`
          .highlighted-edge {
            stroke: #ff6b6b !important;
            stroke-width: 4px !important;
            opacity: 1 !important;
          }
          .dimmed-edge {
            opacity: 0.2 !important;
          }
          .highlighted-edge .react-flow__edge-path {
            stroke: #ff6b6b !important;
            stroke-width: 4px !important;
          }
          .highlighted-edge .react-flow__edge-text {
            fill: #ff6b6b !important;
            font-weight: bold !important;
          }
        `}
      </style>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-800">Call Flow Visualizer</h1>
            {focusMode && (
              <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                Focus Mode
                <button
                  onClick={() => {
                    setFocusMode(false);
                    setFocusedNodeId(null);
                    setNodes(originalNodes);
                    setEdges(originalEdges);
                    setSelectedNode(null);
                  }}
                  className="ml-1 hover:bg-blue-200 rounded-full p-1 transition-colors"
                  title="Exit focus mode"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          <div className="text-sm text-gray-600">
            {focusMode ? (
              <span>Focusing on downstream flow from selected node</span>
            ) : (
              <span>Interactive visualization of phone system call flows</span>
            )}
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
          
          {/* Focus Mode Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Focus Flow</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Click any node to focus on its downstream flow. Click the same node again or use the X button to return to full view.</p>
                </div>
              </div>
            </div>
          </div>
          
          <LegendPanel />
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
              onNodeMouseEnter={onNodeMouseEnter}
              onNodeMouseLeave={onNodeMouseLeave}
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
