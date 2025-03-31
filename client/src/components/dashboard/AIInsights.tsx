import { FC } from "react";
import { FaLightbulb, FaExclamationTriangle, FaCheck } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Insight {
  type: "tip" | "warning" | "success";
  title: string;
  content: string;
  icon: JSX.Element;
  bgClass: string;
  borderClass: string;
  titleClass: string;
}

const AIInsights: FC = () => {
  const insights: Insight[] = [
    {
      type: "tip",
      title: "Contract Term Optimization",
      content: "Your employment agreements could benefit from updated termination clauses based on recent Ontario court decisions.",
      icon: <FaLightbulb className="text-primary text-xs" />,
      bgClass: "bg-primary/5",
      borderClass: "border-primary/20",
      titleClass: "text-primary",
    },
    {
      type: "warning",
      title: "Risk Alert",
      content: "Your NDA contains clauses that may not be enforceable under British Columbia law. Review recommended.",
      icon: <FaExclamationTriangle className="text-warning text-xs" />,
      bgClass: "bg-warning/5",
      borderClass: "border-warning/20",
      titleClass: "text-warning",
    },
    {
      type: "success",
      title: "Compliance Update",
      content: "All your active documents are compliant with the latest PIPEDA amendments effective April 2023.",
      icon: <FaCheck className="text-success text-xs" />,
      bgClass: "bg-success/5",
      borderClass: "border-success/20",
      titleClass: "text-success",
    },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">AI Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => (
          <div 
            key={index}
            className={`p-3 ${insight.bgClass} border ${insight.borderClass} rounded-md`}
          >
            <div className="flex items-center">
              <div className={`h-6 w-6 rounded-full ${insight.bgClass.replace('5', '20')} flex items-center justify-center mr-2`}>
                {insight.icon}
              </div>
              <h4 className={`text-sm font-medium ${insight.titleClass}`}>{insight.title}</h4>
            </div>
            <p className="text-xs text-neutral-600 mt-2">{insight.content}</p>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-primary/10 text-primary hover:bg-primary/20"
          variant="ghost"
        >
          Generate Full Report
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AIInsights;
