import React, { useState, useEffect } from "react";

const ViewResults = ({ elections }) => {
  const [selectedElectionId, setSelectedElectionId] = useState("");
  const [results, setResults] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);

  const mockVotes = [
    { election_id: "1", candidate_index: 0 },
    { election_id: "1", candidate_index: 0 },
    { election_id: "1", candidate_index: 1 },
  ];

  const mockCandidates = {
    "1": [
      { id: 1, name: "Alice Johnson", party: "Party A", blockchain_index: 0 },
      { id: 2, name: "Bob Smith", party: "Party B", blockchain_index: 1 },
    ],
    "2": [
      { id: 3, name: "Charlie Brown", party: "Party C", blockchain_index: 0 },
      { id: 4, name: "Diana White", party: "Party D", blockchain_index: 1 },
    ],
  };

  useEffect(() => {
    if (selectedElectionId) {
      fetchResults();
    }
  }, [selectedElectionId]);

  const fetchResults = () => {
    const votesData = mockVotes.filter(
      (v) => v.election_id === selectedElectionId
    );
    const candidatesData = mockCandidates[selectedElectionId] || [];

    const voteCounts = votesData.reduce((acc, vote) => {
      acc[vote.candidate_index] = (acc[vote.candidate_index] || 0) + 1;
      return acc;
    }, {});

    const resultsWithVotes = candidatesData.map((candidate) => ({
      ...candidate,
      voteCount: voteCounts[candidate.blockchain_index] || 0,
    }));

    setResults(resultsWithVotes);
    setTotalVotes(votesData.length);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-1">Election Results</h2>
      <p className="text-sm text-gray-500 mb-6">
        View real-time voting results (sample data)
      </p>

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

      {/* Results */}
      {selectedElectionId && (
        <div className="space-y-6">
          {/* Total votes box */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-center">{totalVotes}</p>
            <p className="text-sm text-center text-gray-600">
              Total Votes Cast
            </p>
          </div>

          {/* Candidate Results */}
          {results.map((candidate) => {
            const percentage =
              totalVotes > 0
                ? (candidate.voteCount / totalVotes) * 100
                : 0;

            return (
              <div key={candidate.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{candidate.name}</p>
                    <p className="text-sm text-gray-500">{candidate.party}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{candidate.voteCount}</p>
                    <p className="text-sm text-gray-500">
                      {percentage.toFixed(1)}%
                    </p>
                  </div>
                </div>

                {/* Progress bar with Tailwind */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ViewResults;
