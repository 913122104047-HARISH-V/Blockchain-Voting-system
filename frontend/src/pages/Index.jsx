import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🗳️</span>
            <h1 className="text-xl font-bold">Blockchain Voting</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/auth")}
              className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Secure Electronic Voting on Blockchain
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            A tamper-proof, transparent, and decentralized voting platform
            powered by blockchain technology.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate("/auth")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Start Voting
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 border rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Admin Dashboard
            </button>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Blockchain Voting?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "🛡️",
                title: "Secure",
                desc: "Cryptographically signed votes ensure only authorized voters can participate",
              },
              {
                icon: "🔒",
                title: "Immutable",
                desc: "Once recorded on blockchain, votes cannot be altered or deleted",
              },
              {
                icon: "📊",
                title: "Transparent",
                desc: "All transactions are verifiable on the blockchain ledger",
              },
              {
                icon: "⚡",
                title: "Real-time",
                desc: "Live results and instant verification of voting transactions",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="p-6 bg-white rounded-xl shadow hover:shadow-lg text-center"
              >
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="max-w-3xl mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl font-bold mb-8">How It Works</h2>
          <div className="space-y-6 text-left">
            {[
              {
                step: "1",
                title: "Register & Connect Wallet",
                desc: "Create an account and connect your MetaMask wallet",
              },
              {
                step: "2",
                title: "Get Authorized",
                desc: "Admin verifies and authorizes your wallet for voting",
              },
              {
                step: "3",
                title: "Cast Your Vote",
                desc: "Select your candidate and submit via blockchain transaction",
              },
              {
                step: "4",
                title: "Verify Results",
                desc: "View transparent, tamper-proof results on the blockchain",
              },
            ].map((s, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  {s.step}
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{s.title}</h3>
                  <p className="text-gray-600 text-sm">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 bg-gray-50">
        <div className="text-center text-gray-500 text-sm">
          © 2025 Blockchain Voting System. Powered by Ethereum & Smart Contracts.
        </div>
      </footer>
    </div>
  );
};

export default Index;
