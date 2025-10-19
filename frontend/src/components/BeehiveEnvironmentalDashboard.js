import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import PropTypes from 'prop-types';
import { LoadingSpinner, ErrorMessage, DataCard } from './CommonComponents';

/**
 * BeehiveEnvironmentalDashboard Component
 * This component fetches and displays environmental data (temperature, humidity, flow, and weight)
 * for two beehives over a given date range. It renders two separate graphs, one for each hive,
 * showing the data trends over time.
 *
 * @param {Object} hive1 - The first hive object, containing hive information (id, name, etc.)
 * @param {Object} hive2 - The second hive object, containing hive information (id, name, etc.)
 * @param {string} fromDate - The starting date for data filtering (format: YYYY-MM-DD)
 * @param {string} toDate - The ending date for data filtering (format: YYYY-MM-DD)
 * @param {boolean} searchTrigger - A boolean trigger that fetches data when the search is initiated
 * @returns {JSX.Element} The rendered environmental dashboard component
 */
const BeehiveEnvironmentalDashboard = ({ hive1, hive2, fromDate, toDate, searchTrigger }) => {
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const params = { from: fromDate, to: toDate };

      try {
        const [temperature1, humidity1, flow1, weight1] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/${hive1.id}/temperature`, { params }),
          axios.get(`${process.env.REACT_APP_API_URL}/${hive1.id}/humidity`, { params }),
          axios.get(`${process.env.REACT_APP_API_URL}/${hive1.id}/flow`, { params }),
          axios.get(`${process.env.REACT_APP_API_URL}/${hive1.id}/weight`, { params })
        ]);

        const dataForHive1 = [
          {
            x: temperature1.data.map(entry => entry.hour),
            y: temperature1.data.map(entry => entry.avgTemperature),
            type: 'scatter',
            mode: 'lines',
            name: 'Temperature',
            line: { color: '#EF4444', width: 2 },
            yaxis: 'y1'
          },
          {
            x: humidity1.data.map(entry => entry.timestamp),
            y: humidity1.data.map(entry => entry.humidity),
            type: 'scatter',
            mode: 'lines',
            name: 'Humidity',
            line: { color: '#10B981', width: 2 },
            yaxis: 'y2'
          },
          {
            x: flow1.data.map(entry => entry.hour),
            y: flow1.data.map(entry => entry.avgNetFlow),
            type: 'scatter',
            mode: 'lines',
            name: 'Net Flow',
            line: { color: '#8B5CF6', width: 2 },
            yaxis: 'y3'
          },
          {
            x: weight1.data.map(entry => entry.hour),
            y: weight1.data.map(entry => entry.avgWeight),
            type: 'scatter',
            mode: 'lines',
            name: 'Weight',
            line: { color: '#06B6D4', width: 2 },
            yaxis: 'y4'
          }
        ];

        setData1(dataForHive1);

        // Calculate statistics for hive 1
        const stats1 = {
          avgTemp: (temperature1.data.reduce((sum, e) => sum + e.avgTemperature, 0) / temperature1.data.length).toFixed(1),
          avgHumidity: (humidity1.data.reduce((sum, e) => sum + e.humidity, 0) / humidity1.data.length).toFixed(1),
          avgWeight: (weight1.data.reduce((sum, e) => sum + e.avgWeight, 0) / weight1.data.length).toFixed(1),
          avgFlow: (flow1.data.reduce((sum, e) => sum + Math.abs(e.avgNetFlow), 0) / flow1.data.length).toFixed(1),
        };

        const [temperature2, humidity2, flow2, weight2] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/${hive2.id}/temperature`, { params }),
          axios.get(`${process.env.REACT_APP_API_URL}/${hive2.id}/humidity`, { params }),
          axios.get(`${process.env.REACT_APP_API_URL}/${hive2.id}/flow`, { params }),
          axios.get(`${process.env.REACT_APP_API_URL}/${hive2.id}/weight`, { params })
        ]);

        const dataForHive2 = [
          {
            x: temperature2.data.map(entry => entry.hour),
            y: temperature2.data.map(entry => entry.avgTemperature),
            type: 'scatter',
            mode: 'lines',
            name: 'Temperature',
            line: { color: '#F59E0B', width: 2 },
            yaxis: 'y1'
          },
          {
            x: humidity2.data.map(entry => entry.timestamp),
            y: humidity2.data.map(entry => entry.humidity),
            type: 'scatter',
            mode: 'lines',
            name: 'Humidity',
            line: { color: '#F97316', width: 2 },
            yaxis: 'y2'
          },
          {
            x: flow2.data.map(entry => entry.hour),
            y: flow2.data.map(entry => entry.avgNetFlow),
            type: 'scatter',
            mode: 'lines',
            name: 'Net Flow',
            line: { color: '#EC4899', width: 2 },
            yaxis: 'y3'
          },
          {
            x: weight2.data.map(entry => entry.hour),
            y: weight2.data.map(entry => entry.avgWeight),
            type: 'scatter',
            mode: 'lines',
            name: 'Weight',
            line: { color: '#14B8A6', width: 2 },
            yaxis: 'y4'
          }
        ];

        setData2(dataForHive2);

        // Calculate statistics for hive 2
        const stats2 = {
          avgTemp: (temperature2.data.reduce((sum, e) => sum + e.avgTemperature, 0) / temperature2.data.length).toFixed(1),
          avgHumidity: (humidity2.data.reduce((sum, e) => sum + e.humidity, 0) / humidity2.data.length).toFixed(1),
          avgWeight: (weight2.data.reduce((sum, e) => sum + e.avgWeight, 0) / weight2.data.length).toFixed(1),
          avgFlow: (flow2.data.reduce((sum, e) => sum + Math.abs(e.avgNetFlow), 0) / flow2.data.length).toFixed(1),
        };

        setStats({ hive1: stats1, hive2: stats2 });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hive1, hive2, fromDate, toDate, searchTrigger]);

  if (loading) return <LoadingSpinner message="Loading environmental data..." />;
  if (error) return <ErrorMessage message={error} />;

  const plotLayout = (title) => ({
    title: {
      text: title,
      font: { size: 20, family: 'Inter, sans-serif', weight: 600 }
    },
    xaxis: { 
      title: 'Time',
      gridcolor: '#E5E7EB',
      domain: [0, 1]
    },
    yaxis: {
      title: 'Temperature (°C)',
      titlefont: { color: '#EF4444' },
      tickfont: { color: '#EF4444' },
      position: 0,
      anchor: 'free',
    },
    yaxis2: {
      title: 'Humidity (%)',
      titlefont: { color: '#10B981' },
      tickfont: { color: '#10B981' },
      overlaying: 'y',
      side: 'right',
      position: 1,
    },
    yaxis3: {
      title: 'Flow',
      titlefont: { color: '#8B5CF6' },
      tickfont: { color: '#8B5CF6' },
      overlaying: 'y',
      side: 'left',
      position: 0.05,
      anchor: 'free',
    },
    yaxis4: {
      title: 'Weight (kg)',
      titlefont: { color: '#06B6D4' },
      tickfont: { color: '#06B6D4' },
      overlaying: 'y',
      side: 'right',
      position: 0.95,
      anchor: 'free',
    },
    plot_bgcolor: '#F9FAFB',
    paper_bgcolor: '#FFFFFF',
    hovermode: 'x unified',
    legend: {
      orientation: 'h',
      y: -0.3,
      x: 0.5,
      xanchor: 'center',
    },
    margin: { l: 80, r: 80, b: 100, t: 60 },
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-4xl">📊</span>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Environmental Dashboard
          </h2>
          <p className="text-gray-600 text-sm">
            Comprehensive view of all environmental conditions
          </p>
        </div>
      </div>

      {/* Info Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hive 1 Cards */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              {hive1.name}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <DataCard 
                icon="🌡️" 
                title="Temperature" 
                value={stats.hive1.avgTemp} 
                unit="°C" 
                color="red"
              />
              <DataCard 
                icon="💧" 
                title="Humidity" 
                value={stats.hive1.avgHumidity} 
                unit="%" 
                color="green"
              />
              <DataCard 
                icon="⚖️" 
                title="Weight" 
                value={stats.hive1.avgWeight} 
                unit="kg" 
                color="blue"
              />
              <DataCard 
                icon="🐝" 
                title="Flow" 
                value={stats.hive1.avgFlow} 
                unit="avg" 
                color="purple"
              />
            </div>
          </div>

          {/* Hive 2 Cards */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              {hive2.name}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <DataCard 
                icon="🌡️" 
                title="Temperature" 
                value={stats.hive2.avgTemp} 
                unit="°C" 
                color="red"
              />
              <DataCard 
                icon="💧" 
                title="Humidity" 
                value={stats.hive2.avgHumidity} 
                unit="%" 
                color="green"
              />
              <DataCard 
                icon="⚖️" 
                title="Weight" 
                value={stats.hive2.avgWeight} 
                unit="kg" 
                color="blue"
              />
              <DataCard 
                icon="🐝" 
                title="Flow" 
                value={stats.hive2.avgFlow} 
                unit="avg" 
                color="purple"
              />
            </div>
          </div>
        </div>
      )}

      {/* Hive 1 Plot */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 animate-slideUp">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-4 h-4 rounded-full bg-blue-500"></div>
          <h3 className="text-xl font-bold text-gray-800">{hive1.name} Hive</h3>
        </div>
        <Plot
          data={data1}
          layout={plotLayout(`${hive1.name} - Multi-Parameter Analysis`)}
          config={{ 
            responsive: true,
            displaylogo: false,
            modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d']
          }}
          style={{ width: '100%', height: '500px' }}
        />
      </div>

      {/* Hive 2 Plot */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 animate-slideUp delay-100">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-4 h-4 rounded-full bg-orange-500"></div>
          <h3 className="text-xl font-bold text-gray-800">{hive2.name} Hive</h3>
        </div>
        <Plot
          data={data2}
          layout={plotLayout(`${hive2.name} - Multi-Parameter Analysis`)}
          config={{ 
            responsive: true,
            displaylogo: false,
            modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d']
          }}
          style={{ width: '100%', height: '500px' }}
        />
      </div>

      {/* Insight Box */}
      <div className="flex items-start gap-3 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg">
        <span className="text-blue-600 text-2xl mt-1">💡</span>
        <div className="text-sm text-blue-900">
          <p className="font-bold text-lg mb-2">Dashboard Insights</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>This dashboard shows the environmental conditions of two different hives</li>
            <li>Multiple Y-axes allow simultaneous comparison of different parameters</li>
            <li>Temperature and humidity are critical for colony health</li>
            <li>Weight changes indicate honey production and resource consumption</li>
            <li>Flow data reveals foraging activity patterns</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

BeehiveEnvironmentalDashboard.propTypes = {
  hive1: PropTypes.object.isRequired,
  hive2: PropTypes.object.isRequired,
  fromDate: PropTypes.string.isRequired,
  toDate: PropTypes.string.isRequired,
  searchTrigger: PropTypes.bool.isRequired
};

export default BeehiveEnvironmentalDashboard;