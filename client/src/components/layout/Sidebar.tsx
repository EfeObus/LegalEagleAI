import { FC, useEffect, useState } from "react";
import { 
  FaTachometerAlt, 
  FaFileAlt, 
  FaCopy, 
  FaRobot, 
  FaFileContract, 
  FaSearch, 
  FaUsers, 
  FaChartLine,
  FaHeadset,
  FaHome
} from "react-icons/fa";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
}

const sidebarItems = [
  {
    heading: "Main",
    items: [
      { icon: <FaHome />, name: "Home", href: "/" },
      { icon: <FaTachometerAlt />, name: "Dashboard", href: "/dashboard" },
      { icon: <FaFileAlt />, name: "My Documents", href: "/documents" },
      { icon: <FaCopy />, name: "Templates", href: "/templates" },
      { icon: <FaRobot />, name: "AI Assistant", href: "/ai-assistant" },
    ],
  },
  {
    heading: "Legal Tools",
    items: [
      { icon: <FaFileContract />, name: "Contract Generator", href: "/contract-generator" },
      { icon: <FaSearch />, name: "Legal Research", href: "/legal-research" },
      { icon: <FaUsers />, name: "Collaboration", href: "/collaboration", badge: "New" },
      { icon: <FaChartLine />, name: "Risk Analysis", href: "/risk-analysis" },
    ],
  },
];

const Sidebar: FC<SidebarProps> = ({ isOpen }) => {
  const [currentPath, setCurrentPath] = useState("/");
  
  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);
  
  return (
    <aside 
      className={cn(
        "w-64 bg-white border-r border-neutral-200 pt-2 pb-4 flex flex-col h-full transition-all duration-300 transform z-40 fixed lg:static lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex flex-col flex-1 overflow-y-auto px-3 space-y-1">
        {sidebarItems.map((section, i) => (
          <div key={i}>
            <h3 className="text-xs font-medium uppercase text-neutral-500 px-3 mt-4 mb-2">
              {section.heading}
            </h3>
            
            {section.items.map((item, j) => (
              <a 
                key={j}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                  currentPath === item.href 
                    ? "bg-primary/10 text-primary border-l-4 border-primary" 
                    : "text-neutral-700 hover:bg-neutral-100"
                )}
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = item.href;
                }}
              >
                <span className={cn(
                  "w-5",
                  currentPath === item.href ? "text-primary" : "text-neutral-500"
                )}>
                  {item.icon}
                </span>
                <span className="ml-3">{item.name}</span>
                {item.badge && (
                  <span className="ml-auto bg-primary/20 text-primary text-xs py-0.5 px-1.5 rounded">
                    {item.badge}
                  </span>
                )}
              </a>
            ))}
          </div>
        ))}
      </div>
      
      <div className="px-3 mt-6">
        <div className="rounded-lg bg-primary/10 p-3">
          <div className="flex items-center">
            <FaHeadset className="text-primary text-lg" />
            <h4 className="ml-2 text-sm font-medium text-primary">Need Help?</h4>
          </div>
          <p className="mt-2 text-xs text-neutral-600">
            Contact our legal support team for assistance
          </p>
          <Button 
            variant="outline" 
            className="mt-2 w-full py-1.5 bg-white text-primary text-sm font-medium border-primary/30 hover:bg-primary/5"
            onClick={() => window.location.href = "mailto:efe.obukohwo@outlook.com?subject=Tekevwe Legal Assistant Support Request"}
          >
            Get Support
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
