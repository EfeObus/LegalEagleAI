import { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaRobot, FaUser, FaFileSignature } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return `Today, ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
  } else if (diffDays === 1) {
    return `Yesterday, ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
};

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'ai_analyzed':
    case 'ai_summarized':
    case 'ai_generated':
      return (
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <FaRobot className="text-primary" />
        </div>
      );
    case 'risk_analyzed':
      return (
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <FaFileSignature className="text-primary" />
        </div>
      );
    default:
      return (
        <div className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center">
          <FaUser className="text-neutral-600" />
        </div>
      );
  }
};

const ActivityFeed: FC = () => {
  const { data: activities, isLoading } = useQuery<Activity[]>({
    queryKey: ['/api/activities'],
  });

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities && activities.slice(0, 5).map((activity) => (
          <div className="flex space-x-3" key={activity.id}>
            <div className="flex-shrink-0">
              {getActivityIcon(activity.activityType)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-neutral-800">
                {activity.description}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                {formatDate(activity.createdAt)}
              </p>
            </div>
          </div>
        ))}
        
        <Button variant="ghost" className="mt-5 text-primary text-sm hover:underline w-full">
          View all activity
        </Button>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
