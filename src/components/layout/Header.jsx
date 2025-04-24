import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <header className="bg-gray-800 text-white p-4 sticky top-0 z-10">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold flex items-center gap-2">
          <img src="/logo.png" alt="Foremade" className="h-8" />
          Foremade
        </Link>
        <div className="flex-1 mx-4 hidden md:block">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full p-2 rounded text-black"
          />
        </div>
        <nav className="hidden md:flex items-center gap-4">
          <Link to="/cart">Cart (0)</Link>
          {user ? (
            <>
              <Link to="/seller">Seller Dashboard</Link>
              <button onClick={logout} className="hover:underline">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
        <button
          className="md:hidden"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      {isSidebarOpen && (
        <div className="md:hidden bg-gray-700 p-4">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full p-2 rounded text-black mb-4"
          />
          <nav className="flex flex-col gap-2">
            <Link to="/cart" onClick={() => setIsSidebarOpen(false)}>
              Cart (0)
            </Link>
            {user ? (
              <>
                <Link to="/seller" onClick={() => setIsSidebarOpen(false)}>
                  Seller Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsSidebarOpen(false);
                  }}
                  className="text-left hover:underline"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsSidebarOpen(false)}>
                  Login
                </Link>
                <Link to="/register" onClick={() => setIsSidebarOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;