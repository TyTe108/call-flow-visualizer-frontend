import React, { useState } from 'react';
import { Search, Loader } from 'lucide-react';

const DomainSelector = ({ onLoadGraph, loading }) => {
  const [domain, setDomain] = useState('');
  const [graphId, setGraphId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (domain.trim() && graphId.trim()) {
      onLoadGraph(domain.trim(), graphId.trim());
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Load Call Flow Graph</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-2">
            Domain
          </label>
          <input
            type="text"
            id="domain"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="e.g., pacificdermatology, BBPlumbing"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
        </div>
        
        <div>
          <label htmlFor="graphId" className="block text-sm font-medium text-gray-700 mb-2">
            Graph ID
          </label>
          <input
            type="text"
            id="graphId"
            value={graphId}
            onChange={(e) => setGraphId(e.target.value)}
            placeholder="e.g., pacderm_graph, BBPlumbing_graph"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading || !domain.trim() || !graphId.trim()}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              Load Graph
            </>
          )}
        </button>
      </form>
      
      <div className="mt-4 text-sm text-gray-600">
        <p className="mb-2">Example domains:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>pacificdermatology</li>
          <li>BBPlumbing</li>
        </ul>
      </div>
    </div>
  );
};

export default DomainSelector;
