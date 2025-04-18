import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { logout } from '../../features/auth/authSlice';
import { useDispatch } from 'react-redux';
import PwCLogo from '../../assets/logo/PwC-logo.svg';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { userDetails, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      };
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="flex items-center justify-between bg-white rounded-lg gap-4 shadow-sm p-4 px-12">
      <div className="flex items-center">
        <a className="text-xl font-bold no-underline text-gray-800 hover:text-gray-600" href="#">
          <img src={PwCLogo} alt="PwC Logo" style={{ height: 50 }} />
        </a>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 md:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
            <path d="M21 21l-6 -6"></path>
          </svg>
        </button>
        <div className="relative" ref={dropdownRef}>
          <button
            id="dropdown-avatar"
            type="button"
            className="flex items-center focus:outline-none"
            aria-haspopup="true"
            aria-expanded={isDropdownOpen}
            aria-label="User menu"
            onClick={toggleDropdown}
          >
            {user === "dummy@email.com" ? null : (
              <div>
                {userDetails?.first_name || userDetails?.last_name ? (
                  `${userDetails?.first_name || ''} ${userDetails?.last_name || ''}`.trim()
                ) : (
                  'Guest User'
                )}
              </div>
            )}
          </button>
          {isDropdownOpen && (
            <ul className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-lg py-2 z-10">
              {/* <li className="flex items-center gap-2 px-4 py-2 border-b border-gray-100">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img src="/api/placeholder/40/40" alt="avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h6 className="text-base font-semibold text-gray-800">John Doe</h6>
                  <small className="text-gray-500">Admin</small>
                </div>
              </li>
              <li>
                <a className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700" href="#">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
                    <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
                  </svg>
                  My Profile
                </a>
              </li>
              <li>
                <a className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700" href="#">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"></path>
                    <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
                  </svg>
                  Settings
                </a>
              </li>
              <li>
                <a className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700" href="#">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"></path>
                    <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"></path>
                    <path d="M14 11h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-2.5"></path>
                    <path d="M12 17v1m0 -8v1"></path>
                  </svg>
                  Billing
                </a>
              </li>
              <li>
                <a className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700" href="#">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M12 16l-3 -8l-3 8"></path>
                    <path d="M6 16l6 -8l6 8"></path>
                    <path d="M15 16h-4"></path>
                  </svg>
                  FAQs
                </a>
              </li> */}
              <li className="px-4 py-2 border-t-0 border-gray-100 mt-2">
                <button className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors" onClick={() => { navigate("/"), dispatch(logout()) }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"></path>
                    <path d="M9 12h12l-3 -3"></path>
                    <path d="M18 15l3 -3"></path>
                  </svg>
                  Log out
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;