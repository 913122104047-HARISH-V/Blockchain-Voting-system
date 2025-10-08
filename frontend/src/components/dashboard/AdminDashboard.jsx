import React, { useState } from "react";
import CreateElection from "./admin/CreateElection";
import ManageCandidates from "./admin/ManageCandidates";
import ManageVoters from "./admin/ManageVoters";
import ViewResults from "./admin/ViewResults";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("elections");
  const [elections, setElections] = useState([
    {
      id: "1",
      title: "Presidential Election",
      description: "Election for the new president",
      start_time: "2025-10-01T08:00:00Z",
      end_time: "2025-10-05T18:00:00Z",
      is_active: true,
      contract_address: "0x123456789abcdef",
    },
    {
      id: "2",
      title: "Senate Election",
      description: "Senate representative voting",
      start_time: "2025-11-01T08:00:00Z",
      end_time: "2025-11-02T18:00:00Z",
      is_active: false,
      contract_address: null,
    },
  ]);

  const handleElectionCreated = (newElection) => {
    setElections([newElection, ...elections]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <button
            onClick={() => alert("Logout clicked")}
            className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 border-b mb-6">
          {["elections", "candidates", "voters", "results"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                activeTab === tab
                  ? "bg-white border border-b-0"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Elections Tab */}
        {activeTab === "elections" && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-bold mb-2">Manage Elections</h2>
            <p className="text-sm text-gray-500 mb-4">
              Create and manage voting elections
            </p>

            <CreateElection onElectionCreated={handleElectionCreated} />

            <div className="mt-6 space-y-4">
              {elections.map((election) => (
                <div
                  key={election.id}
                  className="p-4 border rounded-lg bg-gray-50"
                >
                  <h3 className="font-semibold">{election.title}</h3>
                  <p className="text-sm text-gray-600">{election.description}</p>
                  <div className="mt-2 text-xs text-gray-500">
                    <p>
                      Start: {new Date(election.start_time).toLocaleString()}
                    </p>
                    <p>End: {new Date(election.end_time).toLocaleString()}</p>
                    <p>
                      Status:{" "}
                      {election.is_active ? "Active" : "Inactive"}
                    </p>
                    {election.contract_address && (
                      <p className="font-mono mt-1">
                        Contract: {election.contract_address}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Candidates Tab */}
        {activeTab === "candidates" && (
          <ManageCandidates elections={elections} />
        )}

        {/* Voters Tab */}
        {activeTab === "voters" && <ManageVoters elections={elections} />}

        {/* Results Tab */}
        {activeTab === "results" && <ViewResults elections={elections} />}
      </main>
    </div>
  );
};

export default AdminDashboard;
