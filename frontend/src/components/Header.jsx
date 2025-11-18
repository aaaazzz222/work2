import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <Link to="/" className="logo">
            <span className="logo-icon">✨</span>
            <span>Portfolio</span>
          </Link>

          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/projects">Projects</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>

          <div className="nav-auth">
            {isAuthenticated ? (
              <>
                <Link to="/admin" className="nav-link-special">
                  Admin Dashboard
                </Link>
                <span className="user-name">Hi, {user?.username}!</span>
                <button onClick={logout} className="btn btn-outline btn-sm">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline btn-sm">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
