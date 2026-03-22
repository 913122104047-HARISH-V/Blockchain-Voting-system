# Blockchain Voting System

End-to-end voting platform with a React frontend, an Express/MongoDB backend, and an Ethereum smart contract. The backend manages elections, voters, and candidates, while the smart contract records votes and results on-chain. The frontend provides admin and voter portals with MetaMask integration.

**Status and scope**
- This repo contains working API, UI, and contract code.
- Several flows are in "demo" or "dev-friendly" mode (see **Operational Notes**).

## Architecture

- **Frontend** (`frontend/`)
  - React + Vite
  - Redux Toolkit for state
  - MetaMask + ethers v6 for on-chain voting
- **Backend** (`backend/`)
  - Express API
  - MongoDB (Mongoose)
  - JWT auth with OTP + face token checks
  - Blockchain service that writes to the voting contract
- **Smart Contract** (`backend/smart-contracts/Voting.sol`)
  - Manages elections, constituencies, candidates, and votes
  - Allows publishing results on-chain

## Tech Stack

- **Frontend**: React 19, Vite 7, Redux Toolkit, Tailwind CSS, ethers v6, Axios
- **Backend**: Node.js, Express, Mongoose, JWT, Nodemailer, Hardhat, ethers v6
- **Blockchain**: Solidity 0.8.19, Ganache or compatible RPC
- **Database**: MongoDB

## Directory Structure

- `backend/`
  - `app.js`, `server.js`: Express app and server entry
  - `config/`: MongoDB + blockchain configuration
  - `controllers/`: API handlers
  - `middleware/`: auth and error handling
  - `models/`: Mongoose schemas
  - `services/`: OTP, email, blockchain, tally logic
  - `scripts/`: contract deployment + ABI export
  - `smart-contracts/`: Solidity contract
- `frontend/`
  - `src/`: React app, pages, APIs, blockchain helpers
  - `src/blockchain/`: MetaMask + contract interactions

## Prerequisites

- Node.js 18+ (recommended)
- MongoDB (local or Atlas)
- Ganache or another Ethereum-compatible JSON-RPC node
- MetaMask browser extension

## Environment Variables

**Backend** (`backend/.env`)

```
MONGODB_URI=mongodb://...
JWT_SECRET=your_jwt_secret
ENABLE_DEMO_OTP=false
STATIC_OTP=123456
OTP_TTL_MS=300000

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
ADMIN_FACE_TOKEN=admin-face-token
VOTER_FACE_TOKEN=voter-face-token

BLOCKCHAIN_RPC_URL=http://127.0.0.1:7545
VOTING_CONTRACT_ADDRESS=0x...
BLOCKCHAIN_CHAIN_ID=5777
BLOCKCHAIN_ADMIN_PRIVATE_KEY=0x...
DISABLE_BLOCKCHAIN=false

EMAIL_USER=you@gmail.com
EMAIL_PASS=app_password
PORT=5000
```

Notes:
- If `DISABLE_BLOCKCHAIN=true` or blockchain config is missing, on-chain calls are mocked.
- `ENABLE_DEMO_OTP=true` returns the OTP in API responses for demo.

**Frontend** (`frontend/.env`)

```
VITE_API_BASE_URL=http://localhost:5000
VITE_VOTING_CONTRACT_ADDRESS=0x...
VITE_BLOCKCHAIN_CHAIN_ID=1337
```

## Quick Start

1. Install dependencies
```
cd backend
npm install
cd ..\frontend
npm install
```

2. Start MongoDB and your RPC node (Ganache recommended).

3. Compile and deploy the contract
```
cd backend
npm run contracts:deploy
```
This updates `backend/.env` and `frontend/.env` with the deployed contract address and chain id.

4. Start the backend
```
cd backend
npm run dev
```

5. Start the frontend
```
cd frontend
npm run dev
```

## Smart Contract Workflow

- Compile contracts: `npm run compile:contracts`
- Export ABI to frontend/backend: `npm run export:abi`
- Deploy contract: `npm run deploy:contract`
- One-step deploy + ABI export: `npm run contracts:deploy`

## API Overview

Base URL: `http://localhost:5000`

**Auth**
- `POST /api/auth/admin/login`
  - Body: `{ email, password }`
  - Response: `{ message, otp_for_demo? }`
- `POST /api/auth/admin/verify`
  - Body: `{ email, otp, faceToken }`
  - Response: `{ message, token }`
- `POST /api/auth/voter/login`
  - Body: `{ aadhaar_number }`
  - Response: `{ message, voter_id, otp_for_demo? }`
- `POST /api/auth/voter/verify`
  - Body: `{ voter_id, otp, faceToken }`
  - Response: `{ message, token }`

**Admin (JWT required)**
- `POST /api/admin/states`
  - Body: `{ name }`
- `GET /api/admin/states`
- `POST /api/admin/constituencies`
  - Body: `{ state_id, name, total_voters? }`
- `GET /api/admin/constituencies?state_id=...`
- `POST /api/admin/voters`
  - Body: `{ name, dob, gender, constituency_id, aadhaar_number, email, mobile, face_embedding }`
- `POST /api/admin/parties`
  - Body: `{ election_id, name, symbol? }`
- `GET /api/admin/parties?election_id=...`

**Elections**
- `GET /api/elections?state_id=...&status=...`
- `GET /api/elections/active/:stateId`
- `POST /api/elections` (admin)
  - Body: `{ state_id, title, status? }`
- `PATCH /api/elections/:id/status` (admin)
  - Body: `{ status }`

**Candidates**
- `GET /api/candidates?election_id=...&constituency_id=...`
- `POST /api/candidates` (admin)
  - Body: `{ election_id, constituency_id, name, party_id }`

**Voter**
- `GET /api/voter/dashboard`
- `POST /api/voter/bind-wallet`
  - Body: `{ wallet_address, voter_id? }`

**Vote**
- `POST /api/vote`
  - Body: `{ candidate_id, wallet_address, tx_hash? }`
  - Response includes on-chain ids and optional verification result.

**Results**
- `GET /api/results/election/:electionId`
- `GET /api/results/state/:stateId/latest`
- `POST /api/results/election/:electionId/publish` (admin)

## Data Models (MongoDB)

- `State`: name, total_constituencies, majority_mark
- `Constituency`: state_id, on_chain_id, name, total_voters
- `Election`: state_id, on_chain_id, title, start_time, end_time, status
- `ElectionConstituency`: election_id, constituency_id, status
- `Party`: election_id, name, symbol
- `Candidate`: election_id, on_chain_id, constituency_id, name, party_id, symbol
- `Voter`: name, dob, gender, constituency_id, aadhaar_number, email, mobile, face_embedding
- `WalletBinding`: voter_id, wallet_address, is_primary, bound_at
- `OtpToken`: scope, subject_id, otp_hash, expires_at
- `VerificationLog`: voter_id, otp_verified, face_verified, kyc_timestamp

## Frontend Routes

- `/` Home (public)
- `/voter/login` Aadhaar login
- `/voter/otp` OTP verification
- `/voter/face-verification` Face verification
- `/voter/dashboard` Voter dashboard
- `/voter/candidates` Candidate list
- `/voter/vote-success` Post-vote confirmation
- `/admin/login` Admin login
- `/admin/otp` Admin OTP verification
- `/admin/face-verification` Admin face verification
- `/admin/dashboard` Admin dashboard
- `/admin/states` Manage states
- `/admin/constituencies` Manage constituencies
- `/admin/elections/create` Create election
- `/admin/candidates` Manage candidates
- `/admin/results` Election results

## Operational Notes

- **Admin defaults**: If `ADMIN_EMAIL`, `ADMIN_PASSWORD`, or `JWT_SECRET` are missing, the server falls back to dev defaults.
- **Voter auth**: `/api/voter/*` routes allow requests even when JWT is missing or invalid.
- **Role enforcement**: `voterOnly` middleware is currently disabled, so voter role is not enforced.
- **Face verification**: currently a string comparison of `faceToken` to an env var, not biometric matching.
- **OTP flow**: uses a static OTP (`STATIC_OTP`) and TTL. Enable demo response with `ENABLE_DEMO_OTP=true`.

These behaviors are suitable for demos but should be hardened before production use.

## Common Scripts

Backend (`backend/package.json`):
- `npm run dev`: start API with nodemon
- `npm run start`: start API
- `npm run contracts:deploy`: compile + deploy + export ABI
- `npm run contracts:prepare`: compile + export ABI

Frontend (`frontend/package.json`):
- `npm run dev`: start Vite dev server
- `npm run build`: production build
- `npm run preview`: preview build

## Next Steps

1. Harden auth and voter role enforcement.
2. Replace demo OTP and face verification with production-grade services.
3. Add validation and audit logs for critical admin actions.
4. Add tests for contract and API flows.
