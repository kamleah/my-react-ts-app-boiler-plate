import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import sidebarData from '../../data/SidebarData';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const { userDetails } = useSelector((state: RootState) => state.auth);
  console.log(userDetails);
  console.log(userDetails?.user_role);
  
  const toggleSubMenu = (label: string) => {
    setExpandedItem(expandedItem === label ? null : label);
  };

  const menu = userDetails?.user_role === 'user' ? sidebarData.userMenu : sidebarData.adminMenu;
  console.log(menu);
  
  return (
    <div className="w-64 bg-white shadow-lg h-screen p-4 flex flex-col">
      {/* Logo and App Name */}
      <div className="flex items-center mb-6">
        <h1 className="ml-2 text-xl font-semibold text-gray-800">Header Graphic Generator</h1>
      </div>

      {/* Main Menu */}
      <div className="mb-4">
        <ul className="space-y-1">
          {menu.map((item) => (
            <li key={item.label}>
              <div
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                onClick={() => item.subItems && toggleSubMenu(item.label)}
              >
                <div className="flex items-center">
                  <span className="mr-2">{item.icon}</span>
                  <Link to={item.path || '#'} className="text-gray-700">
                    {item.label}
                  </Link>
                </div>
                {item.count && (
                  <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    {item.count}+
                  </span>
                )}
                {item.subItems && (
                  <span className="text-gray-500">
                    {expandedItem === item.label ? '▼' : '▶'}
                  </span>
                )}
              </div>
              {/* Submenu */}
              {item.subItems && expandedItem === item.label && (
                <ul className="ml-6 space-y-1">
                  {item.subItems.map((subItem) => (
                    <li key={subItem.label}>
                      <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100">
                        <div className="flex items-center">
                          <span
                            className={`w-2 h-2 rounded-full mr-2 bg-${subItem.color}-500`}
                          ></span>
                          <Link to={subItem.path} className="text-gray-700">
                            {subItem.label}
                          </Link>
                        </div>
                        {subItem.count && (
                          <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                            {subItem.count}+
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Secondary Menu (All Sent, Scheduled) */}
      {/* <div className="mb-4">
        <ul className="space-y-1">
          {sidebarData.secondaryMenu.map((item) => (
            <li key={item.label}>
              <Link
                to={item.path || '#'}
                className="flex items-center p-2 rounded-lg hover:bg-gray-100 text-gray-700"
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div> */}

      {/* Account Menu (Settings, Notifications) */}
      <div className="mt-auto">
        <h2 className="text-xs font-semibold text-gray-500 uppercase mb-2">Account</h2>
        <ul className="space-y-1">
          {sidebarData.accountMenu.map((item) => (
            <li key={item.label}>
              <Link
                onClick={() => dispatch(logout())}
                to={item.path || '#'}
                className="flex items-center p-2 rounded-lg hover:bg-gray-100 text-gray-700"
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
