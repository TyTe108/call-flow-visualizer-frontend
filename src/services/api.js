import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const callFlowAPI = {
  // Fetch call flow data for a specific domain
  getCallFlowByDomain: async (domain, graphId) => {
    try {
      const response = await api.post(`/graphs/domain?domain=${domain}`, {
        graph_id: graphId
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching call flow data:', error);
      throw error;
    }
  },

  // Transform backend data to XYFlow format with hierarchical layout
  transformToXYFlowData: (backendData) => {
    // Group nodes by type for hierarchical layout
    const nodesByType = {
      did: [],
      auto_attendant: [],
      call_queue: [],
      hunt_group: [],
      user: [],
      voicemail: []
    };

    // Separate nodes by type
    backendData.nodes.forEach(node => {
      if (nodesByType[node.node_type]) {
        nodesByType[node.node_type].push(node);
      }
    });

    // Define column positions and spacing
    const columnConfig = {
      did: { x: 50, width: 280 },
      auto_attendant: { x: 380, width: 300 },
      call_queue: { x: 730, width: 280 },
      hunt_group: { x: 730, width: 280 }, // Same column as call_queue
      user: { x: 1060, width: 250 },
      voicemail: { x: 1360, width: 250 }
    };

    const nodeSpacing = 180;
    const startY = 100;

    // Position nodes hierarchically
    const nodes = [];
    let huntGroupOffset = 0;

    Object.keys(nodesByType).forEach(nodeType => {
      const nodesOfType = nodesByType[nodeType];
      const config = columnConfig[nodeType];
      
      nodesOfType.forEach((node, index) => {
        let yPosition = startY + (index * nodeSpacing);
        
        // Special handling for hunt_group to avoid overlap with call_queue
        if (nodeType === 'hunt_group') {
          const callQueueCount = nodesByType.call_queue.length;
          huntGroupOffset = Math.max(huntGroupOffset, callQueueCount * nodeSpacing + 50);
          yPosition = startY + huntGroupOffset + (index * nodeSpacing);
        }
        
        nodes.push({
          id: node.node_id,
          type: node.node_type,
          position: { 
            x: config.x,
            y: yPosition
          },
          data: {
            ...node.metadata,
            label: node.node_type
          }
        });
      });
    });

    // Create edges with improved styling and routing
    const edges = backendData.edges.map((edge, index) => {
      // Determine edge type and styling based on connection type
      let edgeColor = '#6b7280'; // Default gray
      let edgeStyle = 'straight';
      
      // Color code by edge type for better visual distinction
      switch (edge.edge_type) {
        case 'to_auto_attendant':
          edgeColor = '#3b82f6'; // Blue for routing to auto attendant
          edgeStyle = 'smoothstep';
          break;
        case 'to_user':
          edgeColor = '#10b981'; // Green for direct user connections
          edgeStyle = 'smoothstep';
          break;
        case 'to_queue':
          edgeColor = '#8b5cf6'; // Purple for queue connections
          edgeStyle = 'smoothstep';
          break;
        case 'agent':
          edgeColor = '#f59e0b'; // Orange for agent relationships
          edgeStyle = 'straight';
          break;
        case 'to_voicemail':
          edgeColor = '#ef4444'; // Red for voicemail connections
          edgeStyle = 'smoothstep';
          break;
        default:
          edgeColor = '#6b7280';
          edgeStyle = 'straight';
      }

      return {
        id: edge.edge_id,
        source: edge.source_id,
        target: edge.target_id,
        type: edgeStyle,
        animated: false, // Disable animation to reduce visual noise
        label: edge.edge_type.replace(/_/g, ' ').toUpperCase(),
        labelStyle: {
          fontSize: 9,
          fill: edgeColor,
          fontWeight: 'bold',
          background: 'rgba(255, 255, 255, 0.8)',
          borderRadius: 3,
          padding: '2px 4px'
        },
        style: {
          stroke: edgeColor,
          strokeWidth: 1.5,
          strokeDasharray: edgeStyle === 'straight' ? '5,5' : '0', // Dashed lines for straight connections
        },
        markerEnd: {
          type: 'arrowclosed',
          color: edgeColor,
          width: 15,
          height: 15
        },
        // Remove handle specifications - let ReactFlow use default handles
      };
    });

    return { nodes, edges };
  }
};

export default api;
