import { Outlet } from 'react-router-dom';
import Sidebar from '../components/sidebar/Sidebar';
import Header from '../components/header/Header';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Footer } from '../components';

const PrivateLayout = () => {
  const { userDetails } = useSelector((state: RootState) => state.auth);
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      {userDetails?.user_role === "user" && <Header />}
      
      {/* Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {userDetails?.user_role === "admin" && <Sidebar />}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Main Content - Only this area should scroll */}
          <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
      
      {/* Footer - Always visible */}
      <Footer />
    </div>
  );
};

export default PrivateLayout;