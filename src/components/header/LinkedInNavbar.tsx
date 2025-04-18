import { useState } from 'react';
import { Search, MessageCircle, Bell, ChevronDown } from 'lucide-react';
import HomeSVG from '../../assets/home.svg';
import NetworkSVG from '../../assets/mynetwork.svg';
import JobSVG from '../../assets/jobs.svg';
import MessagingSVG from '../../assets/messaging.svg';
import NotificationsSVG from '../../assets/notifications.svg';
import BusinessSVG from '../../assets/business.svg';
import Interim_PwC_logo_rgb_colour_posSVG from '../../assets/interim_PwC_logo_rgb_colour_pos.svg';

type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  badge?: number;
  dropdown?: boolean;
  active?: boolean;
};

export default function LinkedInNavbar() {
  const [searchQuery, setSearchQuery] = useState<string>('');

  return (
    <nav>
      {/* className="w-full border-b border-gray-300 bg-white shadow-sm fixed top-0 z-10" */}
      <div className="max-w-7xl mx-auto px-0">
        <div className="flex items-center justify-between h-14">
          {/* Logo and Search */}
          <div className="flex items-center flex-1">
            <div className="flex-shrink-0">
              <div className="bg-blue-600 text-white h-9 w-9 rounded flex items-center justify-center text-xl font-bold">
                in
              </div>
            </div>
            <div className="ml-2 mr-2 flex-1 max-w-lg relative">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  disabled={true}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search"
                  className="block pl-10 pr-3 py-1.5 border border-gray-300 rounded-md bg-gray-100 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Navigation Icons */}
          <div className="flex space-x-1 md:space-x-2">
            <NavItem icon={<HomeIcon />} label="Home" active />
            <NavItem icon={<NetworkIcon />} label="My Network" badge={2} />
            <NavItem icon={<JobsIcon />} label="Jobs" />
            <NavItem icon={<MessageIcon />} label="Messaging" />
            <NavItem icon={<NotificationIcon />} label="Notifications" badge={25} />
            <NavItem icon={<ProfileIcon />} label="Me" dropdown />
          </div>

          {/* Right Section */}
          <div className="flex items-center border-l pl-3 ml-4 space-x-3">
            <NavItem icon={<GridIcon />} label="For Business" dropdown />
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavItem({ icon, label, badge, dropdown = false, active = false }: NavItemProps) {
  return (
    <div className="flex flex-col items-center px-2 relative cursor-pointer">
      <div className="relative">
        {badge !== undefined && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {badge}
          </span>
        )}
        <div className={`h-6 w-6 flex items-center justify-center ${active ? 'text-black' : 'text-gray-500'}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-center text-xs mt-0.5 text-gray-500">
        <span>{label}</span>
        {dropdown && <ChevronDown className="h-3 w-3 ml-0.5" />}
      </div>
    </div>
  );
}

// SVG and icon components

function HomeIcon() {
  return (
    <img src={HomeSVG} alt="PwC Logo" style={{ height: 50 }} />
  );
}

function NetworkIcon() {
  return (
    <img src={NetworkSVG} alt="PwC Logo" style={{ height: 50 }} />
  );
}

function JobsIcon() {
  return (
    <img src={JobSVG} alt="PwC Logo" style={{ height: 50 }} />
  );
}

function MessageIcon() {
  return <img src={MessagingSVG} alt="PwC Logo" style={{ height: 50 }} />;
}

function NotificationIcon() {
  return <img src={NotificationsSVG} alt="PwC Logo" style={{ height: 50 }} />;
}

function ProfileIcon() {
  return (
    <img src={Interim_PwC_logo_rgb_colour_posSVG} alt="PwC Logo" style={{ height: 50 }} />
  );
}

function GridIcon() {
  return (
    <img src={BusinessSVG} alt="PwC Logo" style={{ height: 50 }} />
  );
}
