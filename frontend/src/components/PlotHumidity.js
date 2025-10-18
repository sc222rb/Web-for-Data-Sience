import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import PropTypes from 'prop-types';
import { LoadingSpinner, ErrorMessage, EmptyState } from './CommonComponents';

/**
 * PlotHumidity Component - Professional Design
 */
const PlotHumidity = ({ hive1, hive2, fromDate, toDate, searchTrigger }) => {
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
          axios.get(`${process.env.REACT_APP_API_URL}/${hive1.id}/humidity`, {
            params: { from: fromDate, to: toDate }
          }),
          axios.get(`${process.env.REACT_APP_API_URL}/${hive2.id}/humidity`, {
            params: { from: fromDate, to: toDate }
          })
        ]);

        // Calculate statistics
        const humidity1 = response1.data.map(entry => entry.humidity);
        const humidity2 = response2.data.map(entry => entry.humidity);
        
        setStats({
          hive1: {
            avg: (humidity1.reduce((a, b) => a + b, 0) / humidity1.length).toFixed(1),
            min: Math.min(...humidity1).toFixed(1),
            max: Math.max(...humidity1).toFixed(1),
          },
          hive2: {
            avg: (humidity2.reduce((a, b) => a + b, 0) / humidity2.length).toFixed(1),
            min: Math.min(...humidity2).toFixed(1),
            max: Math.max(...humidity2).toFixed(1),
          }
        });

        const formattedData = [
          {
            x: response1.data.map(entry => entry.timestamp),
            y: humidity1,
            type: 'scatter',
            mode: 'lines',
            name: hive1.name,
            line: { 
              color: '#10B981', 
              width: 3,
              shape: 'spline'
            },
            fill: 'tozeroy',
            fillcolor: 'rgba(16, 185, 129, 0.1)',
          },
          {
            x: response2.data.map(entry => entry.timestamp),
            y: humidity2,
            type: 'scatter',
            mode: 'lines',
            name: hive2.name,
            line: { 
              color: '#3B82F6', 
              width: 3,
              shape: 'spline'
            },
            fill: 'tozeroy',
            fillcolor: 'rgba(59, 130, 246, 0.1)',
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

  if (loading) return <LoadingSpinner message="Loading humidity data..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!data || data.length === 0) return <EmptyState icon="💧" title="No Humidity Data" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-4xl">💧</span>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Humidity Analysis
          </h2>
          <p className="text-gray-600 text-sm">
            Real-time humidity measurements from both beehives
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Hive 1 Stats */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <h3 className="text-lg font-bold text-gray-800">{hive1.name}</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Average</p>
                <p className="text-2xl font-bold text-green-600">{stats.hive1.avg}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Min</p>
                <p className="text-2xl font-bold text-green-600">{stats.hive1.min}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Max</p>
                <p className="text-2xl font-bold text-green-600">{stats.hive1.max}%</p>
              </div>
            </div>
          </div>

          {/* Hive 2 Stats */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <h3 className="text-lg font-bold text-gray-800">{hive2.name}</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Average</p>
                <p className="text-2xl font-bold text-blue-600">{stats.hive2.avg}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Min</p>
                <p className="text-2xl font-bold text-blue-600">{stats.hive2.min}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Max</p>
                <p className="text-2xl font-bold text-blue-600">{stats.hive2.max}%</p>
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
              text: 'Humidity Trends',
              font: { size: 20, family: 'Inter, sans-serif', weight: 600 }
            },
            xaxis: { 
              title: 'Time',
              gridcolor: '#E5E7EB',
              showgrid: true,
            },
            yaxis: { 
              title: 'Humidity (%)',
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
      <div className="flex items-start gap-3 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
        <span className="text-green-600 text-xl mt-0.5">💡</span>
        <div className="text-sm text-green-800">
          <p className="font-medium mb-1">Insight</p>
          <p>
            Optimal humidity levels in beehives range from 50-60%. High humidity can promote 
            mold growth, while low humidity may cause honey to ferment or brood to dry out.
          </p>
        </div>
      </div>
    </div>
  );
};

PlotHumidity.propTypes = {
  hive1: PropTypes.object.isRequired,
  hive2: PropTypes.object.isRequired,
  fromDate: PropTypes.string.isRequired,
  toDate: PropTypes.string.isRequired,
  searchTrigger: PropTypes.bool.isRequired
};

export default PlotHumidity;
