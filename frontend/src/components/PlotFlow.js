import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import PropTypes from 'prop-types';
import { LoadingSpinner, ErrorMessage, EmptyState } from './CommonComponents';

/**
 * PlotFlow Component - Professional Design
 */
const PlotFlow = ({ hive1, hive2, fromDate, toDate, searchTrigger }) => {
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
          axios.get(`${process.env.REACT_APP_API_URL}/${hive1.id}/flow`, {
            params: { from: fromDate, to: toDate }
          }),
          axios.get(`${process.env.REACT_APP_API_URL}/${hive2.id}/flow`, {
            params: { from: fromDate, to: toDate }
          })
        ]);

        // Calculate statistics
        const arrivals1 = response1.data.map(entry => entry.avgArrivals || 0);
        const departures1 = response1.data.map(entry => Math.abs(entry.avgDepartures || 0));
        const arrivals2 = response2.data.map(entry => entry.avgArrivals || 0);
        const departures2 = response2.data.map(entry => Math.abs(entry.avgDepartures || 0));
        
        setStats({
          hive1: {
            avgArrivals: (arrivals1.reduce((a, b) => a + b, 0) / arrivals1.length).toFixed(1),
            avgDepartures: (departures1.reduce((a, b) => a + b, 0) / departures1.length).toFixed(1),
          },
          hive2: {
            avgArrivals: (arrivals2.reduce((a, b) => a + b, 0) / arrivals2.length).toFixed(1),
            avgDepartures: (departures2.reduce((a, b) => a + b, 0) / departures2.length).toFixed(1),
          }
        });

        const formattedData = [
          {
            x: response1.data.map(entry => entry.hour),
            y: arrivals1,
            type: 'scatter',
            mode: 'lines',
            name: `${hive1.name} Arrivals`,
            line: { color: '#EF4444', width: 3, shape: 'spline' }
          },
          {
            x: response1.data.map(entry => entry.hour),
            y: response1.data.map(entry => entry.avgDepartures),
            type: 'scatter',
            mode: 'lines',
            name: `${hive1.name} Departures`,
            line: { color: '#F97316', width: 3, shape: 'spline' }
          },
          {
            x: response2.data.map(entry => entry.hour),
            y: arrivals2,
            type: 'scatter',
            mode: 'lines',
            name: `${hive2.name} Arrivals`,
            line: { color: '#3B82F6', width: 3, shape: 'spline', dash: 'dash' }
          },
          {
            x: response2.data.map(entry => entry.hour),
            y: response2.data.map(entry => entry.avgDepartures),
            type: 'scatter',
            mode: 'lines',
            name: `${hive2.name} Departures`,
            line: { color: '#10B981', width: 3, shape: 'spline', dash: 'dash' }
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

  if (loading) return <LoadingSpinner message="Loading flow data..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!data || data.length === 0) return <EmptyState icon="🐝" title="No Flow Data" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-4xl">🐝</span>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Bee Flow Analysis
          </h2>
          <p className="text-gray-600 text-sm">
            Hourly bee arrival and departure patterns from both hives
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Hive 1 Stats */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border-2 border-red-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <h3 className="text-lg font-bold text-gray-800">{hive1.name}</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Avg Arrivals</p>
                <p className="text-2xl font-bold text-red-600">+{stats.hive1.avgArrivals}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Avg Departures</p>
                <p className="text-2xl font-bold text-orange-600">-{stats.hive1.avgDepartures}</p>
              </div>
            </div>
          </div>

          {/* Hive 2 Stats */}
          <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-6 border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <h3 className="text-lg font-bold text-gray-800">{hive2.name}</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Avg Arrivals</p>
                <p className="text-2xl font-bold text-blue-600">+{stats.hive2.avgArrivals}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Avg Departures</p>
                <p className="text-2xl font-bold text-green-600">-{stats.hive2.avgDepartures}</p>
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
              text: 'Bee Flow Patterns',
              font: { size: 20, family: 'Inter, sans-serif', weight: 600 }
            },
            xaxis: { 
              title: 'Time',
              gridcolor: '#E5E7EB',
              showgrid: true,
            },
            yaxis: { 
              title: 'Flow Count',
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
      <div className="flex items-start gap-3 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-lg">
        <span className="text-amber-600 text-xl mt-0.5">💡</span>
        <div className="text-sm text-amber-800">
          <p className="font-medium mb-1">Insight</p>
          <p>
            Bee flow patterns reveal foraging activity. Positive values indicate arrivals (bees returning 
            with nectar/pollen), while negative values represent departures. Peak activity typically occurs 
            during mid-day when weather conditions are optimal. Balanced arrival/departure ratios suggest 
            healthy colony dynamics.
          </p>
        </div>
      </div>
    </div>
  );
};

PlotFlow.propTypes = {
  hive1: PropTypes.object.isRequired,
  hive2: PropTypes.object.isRequired,
  fromDate: PropTypes.string.isRequired,
  toDate: PropTypes.string.isRequired,
  searchTrigger: PropTypes.bool.isRequired
};

export default PlotFlow;
