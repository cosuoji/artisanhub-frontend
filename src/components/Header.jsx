import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import { useAuthStore } from '../store/useAuthStore';
import { useDarkMode } from '../hooks/useDarkMode';


export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => closeMenu(), [location])

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const [dark, toggle] = useDarkMode();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <Link to="/" className="font-bold text-xl text-[#1E3A8A]">ArtisanHub</Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 items-center">
            {/* <button onClick={toggle} className="ml-4">
            {dark ? '🌞' : '🌙'}
          </button> */}
          <Link to="/directory" className="text-[#1F2937] hover:text-[#1E3A8A] font-medium">Directory</Link>

          {user ? (
            <>
              <Link to="/dashboard" className="text-[#1F2937] hover:text-[#1E3A8A] font-medium">Dashboard</Link>
              <button
                onClick={handleLogout}
                className="bg-[#FFD700] text-[#1E3A8A] font-semibold px-4 py-2 rounded-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-[#1F2937] hover:text-[#1E3A8A] font-medium">Login</Link>
              <Link
                to="/signup"
                className="bg-[#FFD700] text-[#1E3A8A] font-semibold px-4 py-2 rounded-md"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-[#1F2937]" onClick={toggleMenu}>
          {menuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t">
          <nav className="flex flex-col space-y-4 px-6 py-4">
          {/* <button onClick={toggle} className="ml-4">
            {dark ? '🌞' : '🌙'}
          </button> */}
            <Link to="/directory" onClick={closeMenu} className="text-[#1F2937] hover:text-[#1E3A8A]">Directory</Link>

            {user ? (
              <>
                <Link to="/dashboard" onClick={closeMenu} className="text-[#1F2937] hover:text-[#1E3A8A]">
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                  className="bg-[#FFD700] text-[#1E3A8A] font-semibold px-4 py-2 rounded-md text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={closeMenu} className="text-[#1F2937] hover:text-[#1E3A8A]">Login</Link>
                <Link
                  to="/signup"
                  onClick={closeMenu}
                  className="bg-[#FFD700] text-[#1E3A8A] font-semibold px-4 py-2 rounded-md text-center"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
