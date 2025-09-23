# Call Flow Visualizer Frontend

A React application for visualizing phone system call flows using XYFlow. This frontend connects to your backend API to fetch and display call flow data in an interactive graph format.

## Features

- **Interactive Graph Visualization**: Uses XYFlow to render call flow diagrams with custom node types
- **Custom Node Types**: Supports DID, Auto Attendant, Call Queue, User, Voicemail, and Hunt Group nodes
- **Real-time Statistics**: Displays graph statistics including node counts, edge counts, and connectivity metrics
- **Node Details Panel**: Click on any node to view detailed information and metadata
- **Modern UI/UX**: Built with Tailwind CSS for a clean, responsive interface
- **Domain-based Loading**: Load call flows by specifying domain and graph ID

## Node Types

### DID (Direct Inward Dialing)
- Displays phone numbers and routing information
- Shows active/inactive status
- Color-coded: Blue for active, Gray for inactive

### Auto Attendant
- Shows attendant name and configuration
- Displays prompt information and option counts
- Color-coded: Green

### Call Queue
- Displays queue information and agent statistics
- Shows dispatch type and call counts
- Color-coded: Purple for accepting calls, Gray for not accepting

### User
- Shows user details including name, email, department
- Displays active status and voicemail settings
- Color-coded: Orange for active, Gray for inactive

### Voicemail
- Displays voicemail box information
- Color-coded: Red

### Hunt Group
- Shows hunt group configuration and member counts
- Displays strategy information
- Color-coded: Yellow

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view the application

## Usage

1. **Load a Call Flow**: 
   - Enter a domain (e.g., "pacificdermatology", "BBPlumbing")
   - Enter a graph ID (e.g., "pacderm_graph", "BBPlumbing_graph")
   - Click "Load Graph"

2. **Explore the Graph**:
   - Use mouse to pan and zoom
   - Click on nodes to view detailed information
   - Use the minimap for navigation
   - Use controls for zoom and fit-to-view

3. **View Statistics**:
   - Check the left sidebar for graph statistics
   - View node type counts and connectivity metrics

## API Integration

The application connects to your backend API at `http://localhost:8000`. Make sure your backend is running and accessible.

### API Endpoint
- **POST** `/graphs/domain?domain={domain}`
- **Body**: `{ "graph_id": "your_graph_id" }`

## Data Structure Examples

### Backend Response Format

The backend sends call flow data in the following JSON structure:

```json
{
  "graph_id": "BBPlumbing_graph",
  "statistics": {
    "total_nodes": 8,
    "total_edges": 7,
    "node_type_counts": {
      "did": 1,
      "auto_attendant": 2,
      "call_queue": 1,
      "user": 3,
      "voicemail": 1
    },
    "edge_type_counts": {
      "to_auto_attendant": 1,
      "to_user": 3,
      "to_queue": 1,
      "agent": 2
    },
    "connected_components": 1,
    "isolated_nodes": 0,
    "density": 0.25
  },
  "nodes": [
    {
      "node_id": "did_17149707977",
      "node_type": "did",
      "metadata": {
        "model_type": "did",
        "created_from_api": true,
        "phone_number": "17149707977",
        "domain": "BBPlumbing",
        "dial_rule_application": "to-user-residential",
        "destination_identifier": "400",
        "is_active": false
      }
    },
    {
      "node_id": "aa_daytime",
      "node_type": "auto_attendant",
      "metadata": {
        "model_type": "auto_attendant",
        "created_from_api": true,
        "attendant_name": "Daytime",
        "user": "400",
        "starting_prompt": "Prompt_400001",
        "option_count": 0,
        "dial_by_extension_3_digit": false
      }
    },
    {
      "node_id": "user_400",
      "node_type": "user",
      "metadata": {
        "model_type": "user",
        "created_from_api": true,
        "user_id": "400",
        "full_name": "John Smith",
        "email": "john@bbplumbing.com",
        "department": "Sales",
        "is_active": true,
        "voicemail_enabled": true
      }
    }
  ],
  "edges": [
    {
      "edge_id": "edge_did_to_aa",
      "source_id": "did_17149707977",
      "target_id": "aa_daytime",
      "edge_type": "to_auto_attendant"
    },
    {
      "edge_id": "edge_aa_to_user",
      "source_id": "aa_daytime",
      "target_id": "user_400",
      "edge_type": "to_user"
    },
    {
      "edge_id": "edge_user_to_vm",
      "source_id": "user_400",
      "target_id": "vm_400",
      "edge_type": "to_voicemail"
    }
  ]
}
```

### Frontend XYFlow Transformation

The frontend transforms the backend data into XYFlow-compatible format:

```javascript
// Transformed Nodes
{
  nodes: [
    {
      id: "did_17149707977",
      type: "did",
      position: { x: 50, y: 100 },
      data: {
        phone_number: "17149707977",
        domain: "BBPlumbing",
        dial_rule_application: "to-user-residential",
        destination_identifier: "400",
        is_active: false,
        label: "did"
      }
    },
    {
      id: "aa_daytime",
      type: "auto_attendant",
      position: { x: 380, y: 100 },
      data: {
        attendant_name: "Daytime",
        user: "400",
        starting_prompt: "Prompt_400001",
        option_count: 0,
        dial_by_extension_3_digit: false,
        label: "auto_attendant"
      }
    },
    {
      id: "user_400",
      type: "user",
      position: { x: 1060, y: 100 },
      data: {
        user_id: "400",
        full_name: "John Smith",
        email: "john@bbplumbing.com",
        department: "Sales",
        is_active: true,
        voicemail_enabled: true,
        label: "user"
      }
    }
  ],
  
  // Transformed Edges
  edges: [
    {
      id: "edge_did_to_aa",
      source: "did_17149707977",
      target: "aa_daytime",
      type: "smoothstep",
      animated: false,
      label: "TO AUTO ATTENDANT",
      labelStyle: {
        fontSize: 9,
        fill: "#3b82f6",
        fontWeight: "bold",
        background: "rgba(255, 255, 255, 0.8)",
        borderRadius: 3,
        padding: "2px 4px"
      },
      style: {
        stroke: "#3b82f6",
        strokeWidth: 1.5,
        strokeDasharray: "0"
      },
      markerEnd: {
        type: "arrowclosed",
        color: "#3b82f6",
        width: 15,
        height: 15
      }
    },
    {
      id: "edge_aa_to_user",
      source: "aa_daytime",
      target: "user_400",
      type: "smoothstep",
      animated: false,
      label: "TO USER",
      labelStyle: {
        fontSize: 9,
        fill: "#10b981",
        fontWeight: "bold",
        background: "rgba(255, 255, 255, 0.8)",
        borderRadius: 3,
        padding: "2px 4px"
      },
      style: {
        stroke: "#10b981",
        strokeWidth: 1.5,
        strokeDasharray: "0"
      },
      markerEnd: {
        type: "arrowclosed",
        color: "#10b981",
        width: 15,
        height: 15
      }
    }
  ]
}
```

### Key Transformation Details

#### Node Transformation:
- **Backend**: `node_id` → **Frontend**: `id`
- **Backend**: `node_type` → **Frontend**: `type` (maps to custom components)
- **Backend**: `metadata` → **Frontend**: `data` (flattened and passed to components)
- **Frontend**: Adds `position` coordinates for hierarchical layout
- **Frontend**: Adds `label` field for node type identification

#### Edge Transformation:
- **Backend**: `source_id` → **Frontend**: `source`
- **Backend**: `target_id` → **Frontend**: `target`
- **Backend**: `edge_type` → **Frontend**: `label` (formatted as uppercase)
- **Frontend**: Adds visual styling (colors, stroke width, markers)
- **Frontend**: Adds edge type-specific styling (smooth vs straight lines)

#### Layout Positioning:
- **DID nodes**: Column 1 (x: 50)
- **Auto Attendant nodes**: Column 2 (x: 380)
- **Call Queue/Hunt Group nodes**: Column 3 (x: 730)
- **User nodes**: Column 4 (x: 1060)
- **Voicemail nodes**: Column 5 (x: 1360)
- **Vertical spacing**: 180px between nodes
- **Starting Y position**: 100px

#### Color Coding:
- **DID**: Blue (`#3b82f6`)
- **Auto Attendant**: Green (`#10b981`)
- **Call Queue**: Purple (`#8b5cf6`)
- **User**: Orange (`#f59e0b`)
- **Voicemail**: Red (`#ef4444`)
- **Hunt Group**: Yellow (`#eab308`)

## Customization

### Adding New Node Types
1. Create a new node component in `src/components/nodes/`
2. Add the component to the `nodeTypes` object in `src/App.js`
3. Update the node type mapping in `src/services/api.js`

### Styling
- Uses Tailwind CSS for styling
- Custom node styles can be modified in `src/index.css`
- Node colors and appearance are defined in individual node components

## Project Structure

```
src/
├── components/
│   ├── nodes/           # Custom node components
│   ├── DomainSelector.js
│   ├── StatisticsPanel.js
│   └── NodeDetailsPanel.js
├── services/
│   └── api.js          # API integration and data transformation
├── App.js              # Main application component
├── index.js            # Application entry point
└── index.css           # Global styles and Tailwind imports
```

## Dependencies

- **React**: Frontend framework
- **@xyflow/react**: Graph visualization library
- **Axios**: HTTP client for API requests
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library

## Development

The application is built with Create React App and includes:
- Hot reloading for development
- ESLint for code quality
- Tailwind CSS for styling
- Responsive design

## Build for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files ready for deployment.

## Troubleshooting

1. **API Connection Issues**: Ensure your backend is running on `http://localhost:8000`
2. **CORS Issues**: Make sure your backend allows requests from `http://localhost:3000`
3. **Graph Not Loading**: Check the browser console for error messages
4. **Styling Issues**: Ensure Tailwind CSS is properly configured

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
