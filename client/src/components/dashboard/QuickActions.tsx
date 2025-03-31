import { FC } from "react";
import { useLocation } from "wouter";
import { FaFileContract, FaSearch, FaMicrophone, FaFileSignature } from "react-icons/fa";
import { Button } from "@/components/ui/button";

interface QuickAction {
  title: string;
  description: string;
  icon: JSX.Element;
  path: string;
}

const QuickActions: FC = () => {
  const [, setLocation] = useLocation();
  
  const actions: QuickAction[] = [
    {
      title: "Generate Contract",
      description: "AI-powered contract creator",
      icon: <FaFileContract className="text-primary" />,
      path: "/contract-generator",
    },
    {
      title: "Legal Research",
      description: "Search laws and precedents",
      icon: <FaSearch className="text-primary" />,
      path: "/legal-research",
    },
    {
      title: "Dictate Document",
      description: "Speech-to-text functionality",
      icon: <FaMicrophone className="text-primary" />,
      path: "/documents",
    },
    {
      title: "Analyze Risk",
      description: "Legal risk assessment",
      icon: <FaFileSignature className="text-primary" />,
      path: "/risk-analysis",
    },
  ];

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4 text-neutral-800 font-sans">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            className="flex flex-col h-auto py-4 bg-white hover:bg-neutral-50 border border-neutral-200 rounded-lg text-center transition-all shadow-sm hover:shadow"
            onClick={() => setLocation(action.path)}
          >
            <div className="mx-auto h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mb-3">
              {action.icon}
            </div>
            <h4 className="text-sm font-medium text-neutral-800">{action.title}</h4>
            <p className="text-xs text-neutral-500 mt-1">{action.description}</p>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
