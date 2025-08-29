import { useState } from 'react';
import api from '../lib/api';
import Logo from '../components/Logo';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [phase, setPhase] = useState<'request' | 'verify'>('request');
  const [error, setError] = useState<string | null>(null);
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);

  const requestOtp = async () => {
    setError(null);
    setLoading(true);
    try {
      await api.post('/auth/request-otp', { email });
      setPhase('verify');
    } catch (e: any) {
      setError(e.response?.data?.error || 'Failed to send OTP');
    } finally { setLoading(false); }
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
    } finally { setLoading(false); }
  };

  const RightPanel = () => (
    <div className="hidden lg:block lg:w-1/2 p-6">
      <div className="w-full h-full rounded-3xl overflow-hidden">
        <img src="/images/auth-hero.png" alt="Auth Hero" className="w-full h-full object-cover"/>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black lg:bg-white">
    <div className="w-full max-w-6xl bg-white rounded-3xl shadow-sm flex flex-col lg:flex-row overflow-hidden">
        <div className="w-full lg:w-1/2 p-6 sm:p-10">
      <div className="mb-6"><Logo /></div>
          <h1 className="text-4xl sm:text-5xl font-semibold">Sign in</h1>
          <p className="text-gray-400 mt-2">Please login to continue to your account.</p>

          {error && <div className="text-red-600 text-sm mt-4">{error}</div>}

          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jonas_kahnwald@gmail.com" className="w-full border rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            {phase === 'request' && (
              <button onClick={requestOtp} disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg">
                {loading ? 'Sending…' : 'Get OTP'}
              </button>
            )}

            {phase === 'verify' && (
              <>
                <div className="flex items-center rounded-xl border focus-within:ring-2 focus-within:ring-blue-500">
                  <input type={showOtp ? 'text' : 'password'} value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="OTP" className="w-full rounded-xl px-3 py-3 tracking-widest focus:outline-none" />
                  <button className="px-3 text-gray-400" title="toggle" onClick={() => setShowOtp(!showOtp)}>
                    {showOtp ? '👁️' : '🙈'}
                  </button>
                </div>
                <div>
                  <button type="button" className="text-blue-600 underline text-sm" onClick={requestOtp}>Resend OTP</button>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" id="keep" className="h-4 w-4"/>
                  <label htmlFor="keep">Keep me logged in</label>
                </div>
                <button onClick={verifyOtp} disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg">
                  {loading ? 'Signing in…' : 'Sign in'}
                </button>
              </>
            )}

            <div className="text-gray-500">
              Need an account?? <a className="text-blue-600 underline" href="/">Create one</a>
            </div>
          </div>
        </div>
        <RightPanel />
      </div>
    </div>
  );
}
