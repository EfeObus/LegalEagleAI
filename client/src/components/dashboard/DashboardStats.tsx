import { FC } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FaFileAlt, FaRobot, FaUserFriends, FaArrowUp, FaArrowDown } from "react-icons/fa";

interface Stat {
  title: string;
  value: number;
  icon: JSX.Element;
  change: {
    value: number;
    increased: boolean;
  };
  iconBgClass: string;
  iconClass: string;
}

const DashboardStats: FC = () => {
  const stats: Stat[] = [
    {
      title: "Active Documents",
      value: 8,
      icon: <FaFileAlt className="text-primary text-xl" />,
      change: {
        value: 12,
        increased: true,
      },
      iconBgClass: "bg-primary/10",
      iconClass: "text-primary",
    },
    {
      title: "AI Operations",
      value: 42,
      icon: <FaRobot className="text-primary text-xl" />,
      change: {
        value: 24,
        increased: true,
      },
      iconBgClass: "bg-primary/10",
      iconClass: "text-primary",
    },
    {
      title: "Collaboration Requests",
      value: 3,
      icon: <FaUserFriends className="text-accent text-xl" />,
      change: {
        value: 5,
        increased: false,
      },
      iconBgClass: "bg-accent/10",
      iconClass: "text-accent",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {stats.map((stat, i) => (
        <Card key={i} className="border-neutral-200">
          <CardContent className="p-5">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-neutral-500 font-medium">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1 text-neutral-900">{stat.value}</h3>
              </div>
              <div className={`h-12 w-12 ${stat.iconBgClass} flex items-center justify-center rounded-md`}>
                {stat.icon}
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <span className={`${stat.change.increased ? 'text-success' : 'text-error'} font-medium flex items-center`}>
                {stat.change.increased ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                {stat.change.value}%
              </span>
              <span className="ml-2 text-neutral-500">from last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
