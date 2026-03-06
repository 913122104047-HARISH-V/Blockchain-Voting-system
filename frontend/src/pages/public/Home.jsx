import { Link } from 'react-router-dom'

const steps = [
  {
    title: '1. Voter Authentication',
    description:
      'The voter logs in with Aadhaar details, receives an OTP, and completes face verification.',
  },
  {
    title: '2. MetaMask Wallet Connection',
    description:
      'After identity verification, the voter connects a MetaMask wallet to authorize blockchain actions.',
  },
  {
    title: '3. Vote Casting on Blockchain',
    description:
      'The selected vote is recorded as a signed blockchain transaction, making it tamper-resistant.',
  },
  {
    title: '4. Transparent Result Calculation',
    description:
      'Results are counted from blockchain-backed records for better transparency and auditability.',
  },
]

function Home() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-lg font-bold text-white">
              BV
            </div>
            <div>
              <p className="text-lg font-bold">BlockVote</p>
              <p className="text-sm text-slate-500">E-Voting System</p>
            </div>
          </div>

          <div className="hidden items-center gap-8 text-sm font-medium text-slate-700 md:flex">
            <Link to="/" className="transition hover:text-emerald-600">
              Home
            </Link>
            <Link
              to="/voter/login"
              className="transition hover:text-emerald-600"
            >
              Voter Login
            </Link>
            <Link
              to="/admin/login"
              className="transition hover:text-emerald-600"
            >
              Admin Login
            </Link>
            <a href="#" className="transition hover:text-emerald-600">
              Results
            </a>
          </div>
        </div>
      </nav>

      <main>
        <section className="bg-white">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                Digital Democracy
              </p>
              <h1 className="mt-4 text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
                Secure Blockchain-Based E-Voting System
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                A secure and transparent digital voting platform that combines
                identity verification with blockchain technology to protect each
                vote and improve trust in election results.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/voter/login"
                  className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
                >
                  Vote Now
                </Link>
                <Link
                  to="/admin/login"
                  className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-800 transition hover:border-emerald-600 hover:text-emerald-700"
                >
                  Admin Login
                </Link>
                <a
                  href="#"
                  className="rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
                >
                  View Results
                </a>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-xl">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/10 p-5">
                  <p className="text-sm text-slate-300">Verification</p>
                  <p className="mt-2 text-2xl font-bold">Aadhaar + OTP</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-5">
                  <p className="text-sm text-slate-300">Security Layer</p>
                  <p className="mt-2 text-2xl font-bold">Face Check</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-5">
                  <p className="text-sm text-slate-300">Blockchain</p>
                  <p className="mt-2 text-2xl font-bold">Immutable Votes</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-5">
                  <p className="text-sm text-slate-300">Wallet</p>
                  <p className="mt-2 text-2xl font-bold">MetaMask Ready</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
          <div className="rounded-3xl bg-emerald-50 p-8 md:p-10">
            <h2 className="text-3xl font-bold text-slate-900">About</h2>
            <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-700">
              This Blockchain-Based E-Voting System is designed to provide a
              secure, transparent, and reliable voting experience. It uses
              Aadhaar verification to identify voters, OTP authentication for
              account access, face verification for additional security, and
              blockchain technology to store votes in a tamper-resistant manner.
              Together, these layers help prevent fraud and maintain trust in
              the election process.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-10">
          <h2 className="text-3xl font-bold text-slate-900">How It Works</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {steps.map((step) => (
              <article
                key={step.title}
                className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
              >
                <h3 className="text-xl font-semibold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-3 leading-7 text-slate-600">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-slate-200">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-3 lg:px-10">
          <div>
            <h3 className="text-lg font-semibold text-white">Project Info</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Blockchain-Based E-Voting System for secure, transparent, and
              verifiable digital elections.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">Authors</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Add your team member names here.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">Contact</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Email: yourmail@example.com
              <br />
              Phone: +91 98765 43210
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
