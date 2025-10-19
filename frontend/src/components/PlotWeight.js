import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import PropTypes from 'prop-types';
import { LoadingSpinner, ErrorMessage, EmptyState } from './CommonComponents';

/**
 * PlotWeight Component
 * This component fetches and displays weight data over time for two beehives.
 * It retrieves data from an API and visualizes it using Plotly, showing the weight trends
 * for both hives.
 *
 * @param {Object} hive1 - The first hive object, containing at least an `id` and `name`
 * @param {Object} hive2 - The second hive object, containing at least an `id` and `name`
 * @param {string} fromDate - The starting date for the data query (YYYY-MM-DD format)
 * @param {string} toDate - The ending date for the data query (YYYY-MM-DD format)
 * @param {boolean} searchTrigger - A boolean value to trigger the search when changed
 * @returns {JSX.Element} The rendered plot of weight data over time
 */
const PlotWeight = ({ hive1, hive2, fromDate, toDate, searchTrigger }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [response1, response2] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/${hive1.id}/weight`, {
            params: { from: fromDate, to: toDate }
          }),
          axios.get(`${process.env.REACT_APP_API_URL}/${hive2.id}/weight`, {
            params: { from: fromDate, to: toDate }
          })
        ]);

        // Calculate statistics
        const weights1 = response1.data.map(entry => entry.avgWeight);
        const weights2 = response2.data.map(entry => entry.avgWeight);
        
        setStats({
          hive1: {
            avg: (weights1.reduce((a, b) => a + b, 0) / weights1.length).toFixed(2),
            min: Math.min(...weights1).toFixed(2),
            max: Math.max(...weights1).toFixed(2),
          },
          hive2: {
            avg: (weights2.reduce((a, b) => a + b, 0) / weights2.length).toFixed(2),
            min: Math.min(...weights2).toFixed(2),
            max: Math.max(...weights2).toFixed(2),
          }
        });

        const formattedData = [
          {
            x: response1.data.map(entry => entry.hour),
            y: weights1,
            type: 'scatter',
            mode: 'lines',
            name: hive1.name,
            line: { 
              color: '#8B5CF6', 
              width: 3,
              shape: 'spline'
            },
            fill: 'tozeroy',
            fillcolor: 'rgba(139, 92, 246, 0.1)',
          },
          {
            x: response2.data.map(entry => entry.hour),
            y: weights2,
            type: 'scatter',
            mode: 'lines',
            name: hive2.name,
            line: { 
              color: '#F59E0B', 
              width: 3,
              shape: 'spline'
            },
            fill: 'tozeroy',
            fillcolor: 'rgba(245, 158, 11, 0.1)',
          }
        ];

        setData(formattedData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hive1, hive2, fromDate, toDate, searchTrigger]);

  if (loading) return <LoadingSpinner message="Loading weight data..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!data || data.length === 0) return <EmptyState icon="⚖️" title="No Weight Data" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-4xl">⚖️</span>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Weight Analysis
          </h2>
          <p className="text-gray-600 text-sm">
            Hourly average weight measurements tracking hive productivity
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Hive 1 Stats */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-4 h-4 rounded-full bg-purple-500"></div>
              <h3 className="text-lg font-bold text-gray-800">{hive1.name}</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Average</p>
                <p className="text-2xl font-bold text-purple-600">{stats.hive1.avg} kg</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Min</p>
                <p className="text-2xl font-bold text-purple-600">{stats.hive1.min} kg</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Max</p>
                <p className="text-2xl font-bold text-purple-600">{stats.hive1.max} kg</p>
              </div>
            </div>
          </div>

          {/* Hive 2 Stats */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border-2 border-amber-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-4 h-4 rounded-full bg-amber-500"></div>
              <h3 className="text-lg font-bold text-gray-800">{hive2.name}</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Average</p>
                <p className="text-2xl font-bold text-amber-600">{stats.hive2.avg} kg</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Min</p>
                <p className="text-2xl font-bold text-amber-600">{stats.hive2.min} kg</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Max</p>
                <p className="text-2xl font-bold text-amber-600">{stats.hive2.max} kg</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Plot */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <Plot
          data={data}
          layout={{
            title: {
              text: 'Weight Trends',
              font: { size: 20, family: 'Inter, sans-serif', weight: 600 }
            },
            xaxis: { 
              title: 'Time',
              gridcolor: '#E5E7EB',
              showgrid: true,
            },
            yaxis: { 
              title: 'Weight (kg)',
              gridcolor: '#E5E7EB',
              showgrid: true,
            },
            plot_bgcolor: '#F9FAFB',
            paper_bgcolor: '#FFFFFF',
            hovermode: 'x unified',
            legend: {
              orientation: 'h',
              y: -0.2,
              x: 0.5,
              xanchor: 'center',
              font: { size: 12 }
            },
            margin: { l: 60, r: 40, b: 80, t: 60 },
          }}
          config={{ 
            responsive: true,
            displayModeBar: true,
            displaylogo: false,
            modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d']
          }}
          style={{ width: '100%', height: '500px' }}
        />
      </div>

      {/* Info Box */}
      <div className="flex items-start gap-3 p-4 bg-purple-50 border-l-4 border-purple-500 rounded-lg">
        <span className="text-purple-600 text-xl mt-0.5">💡</span>
        <div className="text-sm text-purple-800">
          <p className="font-medium mb-1">Insight</p>
          <p>
            Weight changes indicate honey production and consumption patterns. A steady increase 
            suggests active foraging and honey storage, while a sudden drop may indicate harvesting 
            or resource depletion. Monitoring weight helps beekeepers optimize harvest timing.
          </p>
        </div>
      </div>
    </div>
  );
};

PlotWeight.propTypes = {
  hive1: PropTypes.object.isRequired,
  hive2: PropTypes.object.isRequired,
  fromDate: PropTypes.string.isRequired,
  toDate: PropTypes.string.isRequired,
  searchTrigger: PropTypes.bool.isRequired
};

export default PlotWeight;
