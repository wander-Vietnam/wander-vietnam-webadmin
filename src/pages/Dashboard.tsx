import React, { useState } from "react";
import Users from "../components/Users";
import Provinces from "../components/Provinces";
import Creator from "../components/Creator";
import Reviews from "../components/Review";
import TripTypes from "../components/TripType";
import Checkpoints from "../components/Checkpoint";
import Questions from "../components/Question";
import Purchases from "../components/Purchases";

const Dashboard: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const tabs = [
    { name: "Users", endpoint: "/users" },
    { name: "Provinces", endpoint: "/province" },
    { name: "Reviews", endpoint: "/review" },
    { name: "Trip Types", endpoint: "/triptype" },
    { name: "Checkpoints", endpoint: "/checkpoints" },
    { name: "Questions", endpoint: "/questions" },
    { name: "Purchase History", endpoint: "/purchase-history" },
    { name: "Creator", endpoint: "/creator" },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0]);

  const renderActiveComponent = () => {
    switch (activeTab.endpoint) {
      case "/users":
        return <Users />;
      case "/province":
        return <Provinces />;
      case "/review":
        return <Reviews />;
      case "/triptype":
        return <TripTypes />;
      case "/checkpoints":
        return <Checkpoints />;
      case "/questions":
        return <Questions />;
      case "/purchase-history":
        return <Purchases />;
      case "/creator":
        return <Creator />;
      default:
        return <div>Select a tab to view content.</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div
        className={`bg-white shadow-md w-64 p-4 fixed top-0 left-0 h-full ${
          isMenuOpen ? "block" : "hidden"
        } md:block`}
      >
        <h2 className="text-lg font-bold mb-4">Menu</h2>
        <ul>
          {tabs.map((tab) => (
            <li key={tab.endpoint} className="mb-2">
              <button
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left p-2 rounded hover:bg-gray-200 ${
                  activeTab.endpoint === tab.endpoint
                    ? tab.endpoint === "/creator"
                      ? "bg-green-200 font-semibold text-black-600"
                      : "bg-gray-200"
                    : ""
                }`}
              >
                {tab.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 p-6 ml-64">
        {" "}
        {/* Thêm margin-left cho nội dung chính để tránh bị che khuất bởi menu */}
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-gray-700">
            Wander Viet Nam
          </h1>
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
