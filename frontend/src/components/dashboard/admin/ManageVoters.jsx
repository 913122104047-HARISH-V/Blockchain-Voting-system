import React, { useState, useEffect } from "react";

const ManageVoters = ({ elections }) => {
  const [selectedElectionId, setSelectedElectionId] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [authorizedVoters, setAuthorizedVoters] = useState([]);

  // Fake profiles (you can replace with API call later)
  useEffect(() => {
    setProfiles([
      {
        id: 1,
        full_name: "Alice Johnson",
        email: "alice@example.com",
        wallet_address: "0x123...abc",
      },
      {
        id: 2,
        full_name: "Bob Smith",
        email: "bob@example.com",
        wallet_address: "0x456...def",
      },
    ]);
  }, []);

  const handleAuthorize = (profile) => {
    if (!selectedElectionId) return;
    setAuthorizedVoters([...authorizedVoters, { ...profile, electionId: selectedElectionId }]);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-1">Manage Voters</h2>
      <p className="text-sm text-gray-500 mb-6">Authorize voters for elections</p>

      {/* Election Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Election
        </label>
        <select
          value={selectedElectionId}
          onChange={(e) => setSelectedElectionId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Choose an election</option>
          {elections.map((election) => (
            <option key={election.id} value={election.id}>
              {election.title}
            </option>
          ))}
        </select>
      </div>

      {/* Voters List */}
      {selectedElectionId && (
        <div className="space-y-4">
          <h3 className="font-semibold">Available Voters</h3>
          {profiles.map((profile) => {
            const isAuthorized = authorizedVoters.some(
              (av) => av.id === profile.id && av.electionId === selectedElectionId
            );

            return (
              <div
                key={profile.id}
                className="flex items-center justify-between p-4 border rounded-lg bg-gray-50"
              >
                <div>
                  <p className="font-medium">{profile.full_name}</p>
                  <p className="text-sm text-gray-600">{profile.email}</p>
                  <p className="text-xs text-gray-500 font-mono">
                    {profile.wallet_address}
                  </p>
                </div>
                {isAuthorized ? (
                  <div className="flex items-center gap-2 text-green-600 font-medium">
                    ✅ Authorized
                  </div>
                ) : (
                  <button
                    onClick={() => handleAuthorize(profile)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Authorize
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManageVoters;
