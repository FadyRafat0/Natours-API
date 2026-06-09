import { useState, type FormEvent, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userImg } from '../utils/helpers';

const LOGO_WHITE = '/img/logo-white.png';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
  }, [searchParams]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/');
    }
  };

  return (
    <header className="header">
      <nav className="nav nav--tours">
        <Link to="/" className="nav__el">All tours</Link>
        {location.pathname === '/' && (
          <form className="nav__search" onSubmit={handleSearch}>
            <button type="submit" className="nav__search-btn">
              <svg>
                <use href="/img/icons.svg#icon-search" />
              </svg>
            </button>
            <input
              type="text"
              placeholder="Search tours"
              className="nav__search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        )}
      </nav>
      <div className="header__logo">
        <img src={LOGO_WHITE} alt="Natours logo" />
      </div>
      <nav className="nav nav--user">
        {user ? (
          <>
            <button onClick={handleLogout} className="nav__el nav__el--logout">
              Log out
            </button>
            <Link to="/me" className="nav__el">
              <img src={userImg(user.photo)} alt={`Photo of ${user.name}`} className="nav__user-img" />
              <span>{user.name.split(' ')[0]}</span>
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="nav__el">Log in</Link>
            <Link to="/signup" className="nav__el nav__el--cta">Sign up</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
