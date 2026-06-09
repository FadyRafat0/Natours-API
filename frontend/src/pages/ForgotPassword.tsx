import { useState, type FormEvent } from 'react';
import API from '../api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const res = await API.post('/users/forgotPassword', { email });
      setMessage(res.data.message || 'If an account with that email exists, a password reset link has been sent.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main">
      <div className="login-form">
        <h2 className="heading-secondary ma-bt-lg">Forgot your password?</h2>
        
        {message && (
          <div className="success__msg" style={{ marginBottom: '2rem', color: '#20bf6b', fontSize: '1.4rem' }}>
            {message}
          </div>
        )}
        
        {error && (
          <div className="error__msg" style={{ marginBottom: '2rem', color: '#eb4d4b', fontSize: '1.4rem' }}>
            {error}
          </div>
        )}

        <form className="form form--forgot-password" onSubmit={handleSubmit}>
          <div className="form__group ma-bt-md">
            <label className="form__label" htmlFor="email">Email address</label>
            <input
              className="form__input"
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form__group">
            <button className="btn btn--green" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default ForgotPassword;
