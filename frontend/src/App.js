import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import DateRangePicker from './components/DateRangePicker';
import BeehiveEnvironmentalDashboard from './components/BeehiveEnvironmentalDashboard';
import PlotFlow from './components/PlotFlow';
import PlotHumidity from './components/PlotHumidity';
import PlotTemperature from './components/PlotTemperature';
import PlotWeight from './components/PlotWeight';
import axios from 'axios';

/**
 * Navigation Component with active state
 */
const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/temperature', label: 'Temperature', icon: '🌡️' },
    { path: '/humidity', label: 'Humidity', icon: '💧' },
    { path: '/weight', label: 'Weight', icon: '⚖️' },
    { path: '/flow', label: 'Flow', icon: '🐝' }
  ];

  return (
    <nav className="flex flex-wrap justify-center gap-2 px-4">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-lg font-medium
            transition-all duration-300 transform hover:scale-105
            ${location.pathname === item.path
              ? 'bg-white text-blue-600 shadow-lg'
              : 'bg-blue-600 text-white hover:bg-blue-700'
            }
          `}
        >
          <span className="text-xl">{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

/**
 * App Component
 * Main application component for rendering the beehive environmental dashboard.
 * @returns {JSX.Element} The main app component.
 */
const App = () => {
  const [hives, setHives] = useState([]);
  const [dateRange, setDateRange] = useState({ 
    fromDate: '2017-07-01', 
    toDate: '2017-07-31' 
  });
  const [searchTrigger, setSearchTrigger] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHives = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}`);
        setHives(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching hive data:', error);
        setError('Failed to load hive data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchHives();
  }, []);

  const handleSearch = (fromDate, toDate) => {
    setDateRange({ fromDate, toDate });
    setSearchTrigger(!searchTrigger);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-xl text-gray-700 font-medium">Loading Beehive Data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const hive1 = hives[0];
  const hive2 = hives[1];

  return (
    <Router basename={process.env.REACT_APP_PUBLIC_URL}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-2xl">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-5xl">🐝</span>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    Beehive Monitor
                  </h1>
                  <p className="text-blue-200 text-sm">
                    Environmental Data Analytics Platform
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-sm text-blue-100">Monitoring</span>
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-100"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-200"></div>
                </div>
              </div>
            </div>
            <Navigation />
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Date Range Picker Section */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 p-6">
              <DateRangePicker 
                fromDate={dateRange.fromDate} 
                toDate={dateRange.toDate} 
                onSearch={handleSearch} 
              />
            </div>

            {/* Content Section */}
            <div className="p-8">
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
                  path="/weight" 
                  element={
                    <PlotWeight 
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
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-8 text-center text-gray-600 text-sm">
            <p>Data Source: Kaggle Beehive Metrics (2017-2019)</p>
            <p className="mt-1">Locations: Würzburg & Schwartau, Germany</p>
          </footer>
        </main>
      </div>
    </Router>
  );
};

export default App;
