import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';

const VerifyEmail = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);

  const { refreshUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await API.post('/users/verifyEmailOtp', { otp });
      await refreshUser();
      navigate('/me');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Wrong OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    try {
      await API.post('/users/sendVerificationOtp');
      setCountdown(60);
      alert('New OTP sent to your email!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error sending email');
    }
  };

  return (
    <main className="main">
      <div className="login-form">
        <h2 className="heading-secondary ma-bt-lg">Verify your email</h2>
        
        <p style={{ fontSize: '1.5rem', marginBottom: '3rem', textAlign: 'center' }}>
          Please enter the 6-digit one-time passcode sent to your email.
        </p>

        {error && (
          <div className="error__msg" style={{ marginBottom: '2rem', color: '#eb4d4b', fontSize: '1.4rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form className="form form--verify" onSubmit={handleSubmit}>
          <div className="form__group ma-bt-md">
            <label className="form__label" htmlFor="otp">One-Time Passcode</label>
            <input
              className="form__input"
              id="otp"
              type="text"
              placeholder="123456"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
              style={{ textAlign: 'center', letterSpacing: '5px', fontSize: '2rem' }}
            />
          </div>
          <div className="form__group" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button className="btn btn--green" disabled={loading}>
              {loading ? 'Verifying...' : 'Submit'}
            </button>
            <button 
              type="button" 
              className="btn btn--small" 
              disabled={countdown > 0}
              onClick={handleResend}
              style={{ 
                backgroundColor: countdown > 0 ? '#ccc' : '#f39c12', 
                color: '#fff',
                cursor: countdown > 0 ? 'not-allowed' : 'pointer'
              }}
            >
              {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Verification Email'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default VerifyEmail;
