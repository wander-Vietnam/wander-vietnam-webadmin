import React, { useState } from 'react';
import Users from '../components/Users';

const Dashboard: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const tabs = [
    { name: "Users", endpoint: "/users" },
    { name: "Provinces", endpoint: "/province" },
    { name: "Trip Quests", endpoint: "/tripquest" },
    { name: "Reviews", endpoint: "/review" },
    { name: "Trip Types", endpoint: "/triptype" },
    { name: "Checkpoints", endpoint: "/checkpoints" },
    { name: "Favorites", endpoint: "/favorites" },
    { name: "Questions", endpoint: "/questions" },
    { name: "Purchase History", endpoint: "/purchase-history" }
  ];

  const [activeTab, setActiveTab] = useState(tabs[0]);

  const renderActiveComponent = () => {
    switch (activeTab.endpoint) {
      case '/users':
        return <Users />;
      case '/province':
        return <div>Province Management</div>;
      case '/tripquest':
        return <div>Trip Quest Management</div>;
      case '/review':
        return <div>Review Management</div>;
      case '/triptype':
        return <div>Trip Type Management</div>;
      case '/checkpoints':
        return <div>Checkpoint Management</div>;
      case '/favorites':
        return <div>Favorite Management</div>;
      case '/questions':
        return <div>Question Management</div>;
      case '/purchase-history':
        return <div>Purchase History Management</div>;
      default:
        return <div>Select a tab to view content.</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className={`bg-white shadow-md w-64 p-4 ${isMenuOpen ? 'block' : 'hidden'} md:block`}>
        <h2 className="text-lg font-bold mb-4">Menu</h2>
        <ul>
          {tabs.map((tab) => (
            <li key={tab.endpoint} className="mb-2">
              <button
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left p-2 rounded hover:bg-gray-200 ${
                  activeTab.endpoint === tab.endpoint ? 'bg-gray-200' : ''
                }`}
              >
                {tab.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 p-6">
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-gray-700">Wander Viet Nam</h1>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 bg-blue-500 text-white rounded"
          >
            Menu
          </button>
          <div className="text-gray-600">Admin Info</div>
        </header>

        <div className="bg-white p-4 rounded shadow">
          {renderActiveComponent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
