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
