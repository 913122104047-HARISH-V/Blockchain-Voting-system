import React, { useState, useEffect } from "react";

const ManageCandidates = ({ elections }) => {
  const [selectedElectionId, setSelectedElectionId] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [form, setForm] = useState({
    name: "",
    party: "",
    description: "",
    blockchainIndex: 0,
  });

  useEffect(() => {
    if (selectedElectionId) {
      // Simulate fetching candidates from API
      setCandidates([]);
    }
  }, [selectedElectionId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newCandidate = {
      id: Date.now(),
      ...form,
    };

    setCandidates([...candidates, newCandidate]);
    setForm({
      name: "",
      party: "",
      description: "",
      blockchainIndex: candidates.length,
    });
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-1">Manage Candidates</h2>
      <p className="text-sm text-gray-500 mb-6">Add candidates to elections</p>

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

      {selectedElectionId && (
        <>
          {/* Add Candidate Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 p-4 border rounded-lg mb-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Candidate Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Party
              </label>
              <input
                type="text"
                value={form.party}
                onChange={(e) => setForm({ ...form, party: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blockchain Index
              </label>
              <input
                type="number"
                value={form.blockchainIndex}
                onChange={(e) =>
                  setForm({ ...form, blockchainIndex: parseInt(e.target.value) })
                }
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Candidate
            </button>
          </form>

          {/* Candidates List */}
          <div>
            <h3 className="font-semibold mb-3">Candidates List</h3>
            {candidates.length > 0 ? (
              <div className="space-y-3">
                {candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="p-4 border rounded-lg bg-gray-50"
                  >
                    <p className="font-medium">{candidate.name}</p>
                    <p className="text-sm text-gray-600">{candidate.party}</p>
                    <p className="text-xs text-gray-500">
                      Index: {candidate.blockchainIndex}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No candidates yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ManageCandidates;
