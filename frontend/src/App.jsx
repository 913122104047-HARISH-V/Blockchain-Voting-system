import { Route, Routes } from 'react-router-dom'
import AdminLayout from './components/layout/AdminLayout'
import Home from './pages/public/Home'
import AadhaarLogin from './pages/voter/AadhaarLogin'
import OTPVerification from './pages/voter/OTPVerification'
import FaceVerification from './pages/voter/FaceVerification'
import VoterDashboard from './pages/voter/VoterDashboard'
import CandidateList from './pages/voter/CandidateList'
import VoteSuccess from './pages/voter/VoteSuccess'
import AdminLogin from './pages/auth/AdminLogin'
import AdminOTPVerification from './pages/auth/OTPVerification'
import AdminFaceVerification from './pages/auth/FaceVerification'
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageStates from './pages/admin/ManageStates'
import ManageConstituencies from './pages/admin/ManageConstituencies'
import CreateElection from './pages/admin/CreateElection'
import ManageCandidates from './pages/admin/ManageCandidates'
import ElectionResults from './pages/admin/ElectionResults'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/voter/login" element={<AadhaarLogin />} />
      <Route path="/voter/otp" element={<OTPVerification />} />
      <Route path="/voter/face-verification" element={<FaceVerification />} />
      <Route path="/voter/dashboard" element={<VoterDashboard />} />
      <Route path="/voter/candidates" element={<CandidateList />} />
      <Route path="/voter/vote-success" element={<VoteSuccess />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/otp" element={<AdminOTPVerification />} />
      <Route
        path="/admin/face-verification"
        element={<AdminFaceVerification />}
      />
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="states" element={<ManageStates />} />
        <Route path="constituencies" element={<ManageConstituencies />} />
        <Route path="elections/create" element={<CreateElection />} />
        <Route path="candidates" element={<ManageCandidates />} />
        <Route path="results" element={<ElectionResults />} />
      </Route>
    </Routes>
  )
}

export default App
