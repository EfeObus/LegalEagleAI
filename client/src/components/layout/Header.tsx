import { FC } from "react";
import { useProvince } from "@/contexts/ProvinceContext";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { FaBars, FaBell, FaMapMarkerAlt, FaChevronDown } from "react-icons/fa";
import ProvinceSelector from "@/components/documents/ProvinceSelector";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: FC<HeaderProps> = ({ toggleSidebar }) => {
  const { province } = useProvince();
  const { user } = useUser();
  
  const notificationCount = 3; // This would come from a real notification service

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-2 lg:px-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden text-neutral-500 hover:bg-neutral-100"
            onClick={toggleSidebar}
          >
            <FaBars />
          </Button>
          
          <div className="flex items-center ml-2 lg:ml-0">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white font-bold">
              T
            </div>
            <h1 className="ml-2 text-xl font-bold text-primary font-sans">Tekevwe</h1>
            <span className="hidden md:inline-block ml-2 text-xs font-medium bg-primary/10 text-primary-foreground px-2 py-0.5 rounded">
              AI Legal Assistant
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <div className="hidden md:block">
            <div className="flex items-center px-3 py-1.5 bg-neutral-100 rounded-md">
              <FaMapMarkerAlt className="text-primary mr-2" />
              <ProvinceSelector minimal />
            </div>
          </div>
          
          <Button variant="ghost" size="icon" className="relative text-neutral-500 hover:bg-neutral-100">
            <FaBell />
            <span className="absolute top-0 right-0 block w-4 h-4 bg-accent rounded-full text-xs text-white">
              {notificationCount}
            </span>
          </Button>
          
          <div className="hidden md:flex items-center p-1 rounded-md hover:bg-neutral-100">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-medium text-sm">
              {user?.name?.split(' ').map(n => n[0]).join('') || 'JS'}
            </div>
            <span className="ml-2 text-sm font-medium">{user?.name || 'John Smith'}</span>
            <FaChevronDown className="ml-2 text-xs text-neutral-400" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
