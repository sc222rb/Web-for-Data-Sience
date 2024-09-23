import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import PropTypes from 'prop-types';

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
 * @param {boolean} searchTrigger - A boolean trigger that refetches data when the search is initiated
 * @returns {JSX.Element} The rendered environmental dashboard component
 */
const BeehiveEnvironmentalDashboard = ({ hive1, hive2, fromDate, toDate, searchTrigger }) => {
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
            line: { color: 'red' }
          },
          {
            x: humidity1.data.map(entry => entry.timestamp),
            y: humidity1.data.map(entry => entry.humidity),
            type: 'scatter',
            mode: 'lines',
            name: 'Humidity',
            line: { color: 'green' }
          },
          {
            x: flow1.data.map(entry => entry.hour),
            y: flow1.data.map(entry => entry.avgNetFlow),
            type: 'scatter',
            mode: 'lines',
            name: 'Net Flow',
            line: { color: 'purple' }
          },
          {
            x: weight1.data.map(entry => entry.hour),
            y: weight1.data.map(entry => entry.avgWeight),
            type: 'scatter',
            mode: 'lines',
            name: 'Weight',
            line: { color: 'cyan' }
          }
        ];

        setData1(dataForHive1);

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
            line: { color: 'blue' }
          },
          {
            x: humidity2.data.map(entry => entry.timestamp),
            y: humidity2.data.map(entry => entry.humidity),
            type: 'scatter',
            mode: 'lines',
            name: 'Humidity',
            line: { color: 'orange' }
          },
          {
            x: flow2.data.map(entry => entry.hour),
            y: flow2.data.map(entry => entry.avgNetFlow),
            type: 'scatter',
            mode: 'lines',
            name: 'Net Flow',
            line: { color: 'brown' }
          },
          {
            x: weight2.data.map(entry => entry.hour),
            y: weight2.data.map(entry => entry.avgWeight),
            type: 'scatter',
            mode: 'lines',
            name: 'Weight',
            line: { color: 'magenta' }
          }
        ];

        setData2(dataForHive2);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hive1, hive2, fromDate, toDate, searchTrigger]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <p>This dashboard shows the environmental conditions of two different hives.</p>
      
      <div style={{ marginBottom: '40px' }}>
        <Plot
          data={data1}
          layout={{
            title: `${hive1.name} Data`,
            xaxis: { title: 'Timestamp' },
            yaxis: { title: 'Values', side: 'left', showgrid: true },
            legend: { orientation: 'h', y: -0.3 },
            margin: { l: 50, r: 50, b: 50, t: 50 },
          }}
          config={{ responsive: true }}
        />
      </div>

      <div>
        <Plot
          data={data2}
          layout={{
            title: `${hive2.name} Data`,
            xaxis: { title: 'Timestamp' },
            yaxis: { title: 'Values', side: 'left', showgrid: true },
            legend: { orientation: 'h', y: -0.3 },
            margin: { l: 50, r: 50, b: 50, t: 50 },
          }}
          config={{ responsive: true }}
        />
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
