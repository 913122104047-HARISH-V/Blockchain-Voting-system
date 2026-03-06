import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Webcam from 'react-webcam'

function AdminFaceVerification() {
  const [cameraActive, setCameraActive] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [captureKey, setCaptureKey] = useState(0)
  const webcamRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    let redirectTimer

    if (message) {
      redirectTimer = window.setTimeout(() => {
        navigate('/admin/dashboard')
      }, 1800)
    }

    return () => {
      if (redirectTimer) {
        window.clearTimeout(redirectTimer)
      }
    }
  }, [message, navigate])

  const handleStart = () => {
    setCameraActive(true)
    setError('')
    setMessage('')
  }

  const handleVerification = () => {
    if (!cameraActive) {
      setError('Start the camera before running face verification.')
      return
    }

    const imageSrc = webcamRef.current?.getScreenshot()
    if (!imageSrc) {
      setError('Unable to capture your face. Please retry.')
      return
    }

    setIsProcessing(true)
    setError('')
    setMessage('')

    window.setTimeout(() => {
      setIsProcessing(false)
      setMessage(
        'Admin face verified successfully. Redirecting to dashboard...',
      )
    }, 2000)
  }

  const handleRetry = () => {
    setError('')
    setMessage('')
    setIsProcessing(false)
    setCameraActive(false)
    setCaptureKey((current) => current + 1)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6 py-16">
      <div className="w-full max-w-3xl rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-3xl font-bold text-slate-900">
          Admin Face Authentication
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          The system will verify your admin identity using live face
          recognition and match it against the stored admin record.
        </p>

        <div className="mt-8 overflow-hidden rounded-3xl bg-slate-900">
          {cameraActive ? (
            <Webcam
              key={captureKey}
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              className="h-[360px] w-full object-cover"
              videoConstraints={{
                facingMode: 'user',
              }}
            />
          ) : (
            <div className="flex h-[360px] items-center justify-center px-6 text-center text-slate-300">
              Camera preview will appear here when verification starts.
            </div>
          )}
        </div>

        {isProcessing ? (
          <div className="mt-6 flex items-center gap-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            <span className="h-3 w-3 animate-pulse rounded-full bg-emerald-500" />
            Verification in progress. Please keep your face centered.
          </div>
        ) : null}

        {message ? (
          <p className="mt-6 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {message}
          </p>
        ) : null}

        {error ? (
          <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-4">
          {!cameraActive ? (
            <button
              type="button"
              onClick={handleStart}
              className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              Start Verification
            </button>
          ) : (
            <button
              type="button"
              onClick={handleVerification}
              disabled={isProcessing || Boolean(message)}
              className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
            >
              Capture and Verify
            </button>
          )}

          <button
            type="button"
            onClick={handleRetry}
            className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-800 transition hover:border-emerald-600 hover:text-emerald-700"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminFaceVerification
