import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import DateRangePicker from './components/DateRangePicker';
import BeehiveEnvironmentalDashboard from './components/BeehiveEnvironmentalDashboard';
import PlotFlow from './components/PlotFlow';
import PlotHumidity from './components/PlotHumidity';
import PlotTemperature from './components/PlotTemperature';
import axios from 'axios';

/**
 * App Component
 * Main application component for rendering the beehive environmental dashboard.
 * @returns {JSX.Element} The main app component.
 */
const App = () => {
  const [hives, setHives] = useState([]);
  const [dateRange, setDateRange] = useState({ fromDate: '2017-07-01', toDate: '2017-07-31' });
  const [searchTrigger, setSearchTrigger] = useState(false);

  useEffect(() => {
    const fetchHives = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}`);
        setHives(response.data);
      } catch (error) {
        console.error('Error fetching hive data:', error);
      }
    };

    fetchHives();
  }, []);

  const handleSearch = (fromDate, toDate) => {
    setDateRange({ fromDate, toDate });
    setSearchTrigger(!searchTrigger);
  };

  if (hives.length === 0) return <div>Loading...</div>;

  const hive1 = hives[0];
  const hive2 = hives[1];

  return (
    <Router basename={process.env.REACT_APP_PUBLIC_URL}>
      <div className="flex flex-col min-h-screen">
        <header className="bg-blue-500 text-white p-4 shadow-md w-full">
          <div id="visualizationLinks" className="flex justify-center space-x-4">
            <Link to="/" className="hover:bg-blue-600 transition duration-300 ease-in-out rounded py-2 px-4">Home</Link>
            <Link to="/temperature" className="hover:bg-blue-600 transition duration-300 ease-in-out rounded py-2 px-4">Temperature</Link>
            <Link to="/humidity" className="hover:bg-blue-600 transition duration-300 ease-in-out rounded py-2 px-4">Humidity</Link>
            <Link to="/flow" className="hover:bg-blue-600 transition duration-300 ease-in-out rounded py-2 px-4">Flow</Link>
          </div>
        </header>
        <main className="flex-1 container mx-auto my-6 bg-white p-6 rounded-lg max-w-4xl">
          <DateRangePicker 
            fromDate={dateRange.fromDate} 
            toDate={dateRange.toDate} 
            onSearch={handleSearch} 
          />
          <Routes>
            <Route 
              path="/" 
              element={
                <BeehiveEnvironmentalDashboard 
                  hive1={hive1}
                  hive2={hive2}
                  fromDate={dateRange.fromDate} 
                  toDate={dateRange.toDate} 
                  searchTrigger={searchTrigger} 
                />
              } 
            />
            <Route 
              path="/temperature" 
              element={
                <PlotTemperature 
                  hive1={hive1}
                  hive2={hive2}
                  fromDate={dateRange.fromDate} 
                  toDate={dateRange.toDate} 
                  searchTrigger={searchTrigger} 
                />
              } 
            />
            <Route 
              path="/humidity" 
              element={
                <PlotHumidity 
                  hive1={hive1} 
                  hive2={hive2}
                  fromDate={dateRange.fromDate} 
                  toDate={dateRange.toDate} 
                  searchTrigger={searchTrigger} 
                />
              } 
            />
            <Route 
              path="/flow" 
              element={
                <PlotFlow 
                  hive1={hive1}
                  hive2={hive2}
                  fromDate={dateRange.fromDate} 
                  toDate={dateRange.toDate} 
                  searchTrigger={searchTrigger} 
                />
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
