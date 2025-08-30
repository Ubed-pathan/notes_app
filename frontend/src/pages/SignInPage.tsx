import { useState } from 'react';
import api from '../lib/api';
import Logo from '../components/Logo';
import { LabeledInput } from '../components/Field';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [phase, setPhase] = useState<'request' | 'verify'>('request');
  const [error, setError] = useState<string | null>(null);
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
      <div className="w-full rounded-3xl overflow-hidden" style={{ aspectRatio: '4 / 5' }}>
        <img src="/image.png" alt="Auth Hero" className="w-full h-full object-cover"/>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
    <div className="w-full max-w-6xl bg-white rounded-3xl shadow-sm flex flex-col lg:flex-row overflow-hidden">
        <div className="w-full lg:w-1/2 p-6 sm:p-10">
      <div className="mb-6"><Logo /></div>
      <h1 className="text-[44px] leading-tight font-semibold">Sign In</h1>
          <p className="text-gray-400 mt-2">Please login to continue to your account.</p>

          {error && <div className="text-red-600 text-sm mt-4">{error}</div>}

          <div className="mt-6 space-y-4">
            <LabeledInput label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jonas_kahnwald@gmail.com" />

            {phase === 'request' && (
              <button onClick={requestOtp} disabled={loading} className="btn-primary">
                {loading ? 'Sending…' : 'Get OTP'}
              </button>
            )}

            {phase === 'verify' && (
              <>
                <div className="flex items-center rounded-2xl border focus-within:border-blue-500 bg-white">
                  <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="OTP" className="w-full rounded-2xl px-3 py-3 tracking-widest focus:outline-none bg-white text-gray-900" />
                </div>
                <div>
                  <button type="button" className="text-blue-600 underline text-sm" onClick={requestOtp}>Resend OTP</button>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" id="keep" className="h-4 w-4 accent-blue-600"/>
                  <label htmlFor="keep">Keep me logged in</label>
                </div>
                <button onClick={verifyOtp} disabled={loading} className="btn-primary">
                  {loading ? 'Signing in…' : 'Sign in'}
                </button>
              </>
            )}

            <div className="text-gray-500">Need an account?? <a className="text-blue-600 underline" href="/">Create one</a></div>
          </div>
        </div>
        <RightPanel />
      </div>
    </div>
  );
}
