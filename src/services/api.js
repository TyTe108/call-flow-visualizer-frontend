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
            x: config.x + (Math.random() * 30 - 15), // Small random offset for visual variety
            y: yPosition + (Math.random() * 20 - 10)
          },
          data: {
            ...node.metadata,
            label: node.node_type
          }
        });
      });
    });

    // Create edges with improved styling
    const edges = backendData.edges.map(edge => ({
      id: edge.edge_id,
      source: edge.source_id,
      target: edge.target_id,
      type: 'smoothstep',
      animated: true,
      label: edge.edge_type.replace(/_/g, ' ').toUpperCase(),
      labelStyle: {
        fontSize: 10,
        fill: '#666',
        fontWeight: 'bold'
      },
      style: {
        stroke: '#4f46e5',
        strokeWidth: 2
      },
      markerEnd: {
        type: 'arrowclosed',
        color: '#4f46e5',
      }
    }));

    return { nodes, edges };
  }
};

export default api;
