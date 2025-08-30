import { useState } from 'react';
import api from '../lib/api';
import { z } from 'zod';
import Logo from '../components/Logo';
import { LabeledInput, DateField } from '../components/Field';

const emailSchema = z.string().email();

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState(''); // yyyy-mm-dd
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
          <h1 className="text-[44px] leading-tight font-semibold">Sign up</h1>
          <p className="text-gray-400 mt-2">Sign up to enjoy the feature of HD</p>

          {error && <div className="text-red-600 text-sm mt-4">{error}</div>}

          <div className="mt-6 space-y-4">
            <LabeledInput label="Your Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jonas Khanwald" />
            <DateField label="Date of Birth" value={dob} onChange={setDob} />
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
                <button onClick={verifyOtp} disabled={loading} className="btn-primary">
                  {loading ? 'Verifying…' : 'Sign up'}
                </button>
              </>
            )}

            <div className="text-gray-500">
              Already have an account?? <a className="text-blue-600 underline" href="/signin">Sign in</a>
            </div>
          </div>
        </div>
        <RightPanel />
      </div>
    </div>
  );
}
