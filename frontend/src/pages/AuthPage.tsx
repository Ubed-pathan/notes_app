import { useState } from 'react';
import api from '../lib/api';
import { z } from 'zod';
import Logo from '../components/Logo';

const emailSchema = z.string().email();

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState(''); // yyyy-mm-dd
  const [otp, setOtp] = useState('');
  const [phase, setPhase] = useState<'request' | 'verify'>('request');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);

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
    } finally { setLoading(false); }
  };

  const verifyOtp = async () => {
    setError(null);
    if (otp.length !== 6) return setError('Enter 6-digit OTP');
    setLoading(true);
    try {
      const payload: any = { email, code: otp };
      if (name) payload.name = name;
      if (dob) payload.dateOfBirth = new Date(dob).toISOString();
      const res = await api.post('/auth/verify-otp', payload);
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
        <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1600&auto=format&fit=crop" alt="bg" className="w-full h-full object-cover"/>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-sm flex flex-col lg:flex-row overflow-hidden">
        <div className="w-full lg:w-1/2 p-6 sm:p-10">
          <div className="mb-6"><Logo /></div>
          <h1 className="text-4xl sm:text-5xl font-semibold">Sign up</h1>
          <p className="text-gray-400 mt-2">Sign up to enjoy the feature of HD</p>

          {error && <div className="text-red-600 text-sm mt-4">{error}</div>}

          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Your Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jonas Khanwald" className="w-full border rounded-xl px-3 py-3" />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Date of Birth</label>
              <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full border rounded-xl px-3 py-3" />
            </div>
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
                <button onClick={verifyOtp} disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg">
                  {loading ? 'Verifying…' : 'Sign up'}
                </button>
              </>
            )}

            <div className="text-gray-500">
              Already have an account?? <a className="text-blue-600 underline" href="#">Sign in</a>
            </div>
          </div>
        </div>
        <RightPanel />
      </div>
    </div>
  );
}
