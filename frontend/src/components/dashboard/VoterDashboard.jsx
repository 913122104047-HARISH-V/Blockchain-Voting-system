import React, { useState, useEffect, useRef } from "react";

const VoterDashboard = () => {
  const [elections, setElections] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [voting, setVoting] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Mock elections
    const demoElections = [
      { id: 1, title: "Presidential Election", description: "Vote for your next president" },
    ];
    setElections(demoElections);
    setSelectedElection(demoElections[0]);

    // Mock candidates
    setCandidates([
      { id: 1, name: "Alice Johnson", party: "Party A", description: "Experienced leader" },
      { id: 2, name: "Bob Smith", party: "Party B", description: "Fresh ideas and vision" },
    ]);
  }, []);

  const handleConnectWallet = () => {
    setWalletAddress("0x1234...abcd");
    alert("Wallet Connected!");
  };

  // Start camera
  const startCamera = () => {
    setShowCamera(true);
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => console.error("Camera error:", err));
  };

  // Capture image
  const captureImage = () => {
    const context = canvasRef.current.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, 400, 300);
    const imageData = canvasRef.current.toDataURL("image/png");
    setCapturedImage(imageData);
  };

  // Stop camera
  const stopCamera = () => {
    const stream = videoRef.current.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setShowCamera(false);
  };

  const handleVote = (candidateId) => {
    if (!walletAddress) {
      alert("Please connect wallet before voting");
      return;
    }

    startCamera();
    setVoting(true);

    setTimeout(() => {
      captureImage();
      stopCamera();

      // Here you can send `capturedImage` to your backend for verification
      alert(`Vote cast for candidate ID: ${candidateId}`);
      setVoting(false);
    }, 1500); // wait 1.5s for demo; you can adjust
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="border-b bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Voter Dashboard</h1>
          <div className="flex items-center gap-4">
            {/*walletAddress ? (
              <div className="px-3 py-1 bg-green-100 rounded-full text-sm text-green-700">
                {walletAddress}
              </div>
            ) : (
              <button
                onClick={handleConnectWallet}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                Connect Wallet
              </button>
            )*/}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-8">
        {elections.length === 0 ? (
          <div className="bg-white shadow rounded p-6 text-center">
            <p className="text-lg text-gray-500">No active elections available</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white shadow rounded p-6">
              <h2 className="text-2xl font-semibold">{selectedElection?.title}</h2>
              <p className="text-gray-600">{selectedElection?.description}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="bg-white shadow rounded p-6 hover:shadow-lg transition"
                >
                  <h3 className="text-lg font-semibold">{candidate.name}</h3>
                  <p className="text-sm text-gray-500">{candidate.party}</p>
                  <p className="text-sm text-gray-600 mt-2">{candidate.description}</p>
                  <button
                    className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                    onClick={() => handleVote(candidate.id)}
                    disabled={voting || !walletAddress}
                  >
                    {voting ? "Voting..." : "Vote"}
                  </button>
                </div>
              ))}
            </div>

            {/* Camera Modal */}
            {showCamera && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-4 rounded shadow-lg">
                  <video ref={videoRef} autoPlay width="400" height="300" className="border rounded-lg" />
                  <canvas ref={canvasRef} width="400" height="300" className="hidden" />
                  <div className="mt-4 flex gap-2 justify-center">
                    <button
                      onClick={captureImage}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Capture
                    </button>
                    <button
                      onClick={stopCamera}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Close
                    </button>
                  </div>
                  {capturedImage && (
                    <div className="mt-4 text-center">
                      <h3 className="font-semibold">Captured Image</h3>
                      <img src={capturedImage} alt="Captured" className="border rounded mt-2" />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default VoterDashboard;
