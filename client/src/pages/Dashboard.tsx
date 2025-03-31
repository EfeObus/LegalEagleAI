import { FC } from "react";
import { Link } from "wouter";
import { FaPlus, FaUpload } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import DashboardStats from "@/components/dashboard/DashboardStats";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentDocuments from "@/components/dashboard/RecentDocuments";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import AIInsights from "@/components/dashboard/AIInsights";

const Dashboard: FC = () => {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 font-sans">Dashboard</h2>
          <p className="text-neutral-500 text-sm mt-1">
            Overview of your legal documents and activities
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button className="flex items-center" asChild>
            <Link href="/documents">
              <FaPlus className="mr-2" />
              <span>New Document</span>
            </Link>
          </Button>
          
          <Button variant="outline" className="flex items-center">
            <FaUpload className="mr-2" />
            <span>Upload</span>
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <DashboardStats />
      
      {/* Quick Actions */}
      <QuickActions />
      
      {/* Recent Documents */}
      <RecentDocuments />
      
      {/* Activity Feed & AI Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="md:col-span-2">
          <ActivityFeed />
        </div>
        
        {/* AI Insights */}
        <div>
          <AIInsights />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
