import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('demo-admin@fady-natours.com');
  const [password, setPassword] = useState('DemoPassword2026!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main">
      <div className="login-form">
        <h2 className="heading-secondary ma-bt-lg">Log into your account</h2>
        
        {error && (
          <div className="error__msg" style={{ marginBottom: '2rem', color: '#eb4d4b', fontSize: '1.4rem' }}>
            {error}
          </div>
        )}

        <form className="form form--login" onSubmit={handleSubmit}>
          <div className="form__group">
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
          <div className="form__group ma-bt-md">
            <label className="form__label" htmlFor="password">Password</label>
            <input
              className="form__input"
              id="password"
              type="password"
              placeholder="••••••••"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form__group">
            <button className="btn btn--green" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
        <p style={{ marginTop: '2rem', textAlign: 'center', fontSize: '1.4rem' }}>
          <Link to="/forgot-password" style={{ color: '#55c57a', fontWeight: 'bold' }}>
            Forgot your password?
          </Link>
        </p>
        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '1.4rem' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#55c57a', fontWeight: 'bold' }}>
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
