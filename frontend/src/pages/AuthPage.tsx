import { useState } from 'react';
import api from '../lib/api';
import { z } from 'zod';

const emailSchema = z.string().email();

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [phase, setPhase] = useState<'request' | 'verify'>('request');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const requestOtp = async () => {
    setError(null);
    const valid = emailSchema.safeParse(email);
    if (!valid.success) return setError('Enter a valid email');
    setLoading(true);
    try {
      await api.post('/auth/request-otp', { email });
      setPhase('verify');
    } catch (e: any) {
      setError(e.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setError(null);
    if (otp.length !== 6) return setError('Enter 6-digit OTP');
    setLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', { email, code: otp });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.location.href = '/notes';
    } catch (e: any) {
      setError(e.response?.data?.error || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // Placeholder for Google: We'll use Google Identity Services script in UI
  const googleLogin = () => {
    // GIS flow will call onGoogleCredential with id_token
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold">Welcome</h1>
        {error && <div className="text-red-600 text-sm">{error}</div>}

        {phase === 'request' && (
          <div className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full border rounded px-3 py-2"
            />
            <button onClick={requestOtp} disabled={loading} className="w-full bg-black text-white py-2 rounded">
              {loading ? 'Sending…' : 'Send OTP'}
            </button>
          </div>
        )}

        {phase === 'verify' && (
          <div className="space-y-3">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full border rounded px-3 py-2 tracking-widest"
            />
            <button onClick={verifyOtp} disabled={loading} className="w-full bg-black text-white py-2 rounded">
              {loading ? 'Verifying…' : 'Verify OTP'}
            </button>
            <button onClick={() => setPhase('request')} className="w-full text-sm text-gray-600">
              Resend / change email
            </button>
          </div>
        )}

        <div className="text-center text-sm text-gray-500">or</div>

        <div id="g_id_onload"
          data-client_id={import.meta.env.VITE_GOOGLE_CLIENT_ID}
          data-callback="onGoogleCredentialResponse"
        />
        <div className="g_id_signin" data-type="standard" data-size="large" data-theme="outline" />
      </div>
      <script dangerouslySetInnerHTML={{ __html: `
        window.onGoogleCredentialResponse = async function (response) {
          try {
            const res = await fetch('${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/auth/google', {
              method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken: response.credential })
            });
            const data = await res.json();
            if (data.token) {
              localStorage.setItem('token', data.token);
              localStorage.setItem('user', JSON.stringify(data.user));
              window.location.href = '/notes';
            } else {
              alert(data.error || 'Google login failed');
            }
          } catch (e) { alert('Google login failed'); }
        }
      ` }} />
      <script src="https://accounts.google.com/gsi/client" async defer></script>
    </div>
  );
}
