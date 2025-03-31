import { FC, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useProvince } from "@/contexts/ProvinceContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { 
  FaExclamationTriangle, 
  FaCheck, 
  FaFileAlt, 
  FaClipboardCheck, 
  FaChartLine 
} from "react-icons/fa";
import { Loader2 } from "lucide-react";

interface RiskAnalysisResult {
  overallRisk: string;
  riskAreas: Array<{ area: string; severity: string; description: string }>;
  suggestions: string[];
}

interface RiskSeverityConfig {
  color: string;
  bgColor: string;
  borderColor: string;
  icon: JSX.Element;
  label: string;
  progress: number;
}

const RiskAnalysis: FC = () => {
  const { province } = useProvince();
  const [documentContent, setDocumentContent] = useState("");
  const [analysisResult, setAnalysisResult] = useState<RiskAnalysisResult | null>(null);
  
  const riskSeverityConfig: Record<string, RiskSeverityConfig> = {
    "High": {
      color: "text-error",
      bgColor: "bg-error/10",
      borderColor: "border-error/20",
      icon: <FaExclamationTriangle className="text-error" />,
      label: "High Risk",
      progress: 90
    },
    "Medium": {
      color: "text-warning",
      bgColor: "bg-warning/10",
      borderColor: "border-warning/20",
      icon: <FaExclamationTriangle className="text-warning" />,
      label: "Medium Risk",
      progress: 50
    },
    "Low": {
      color: "text-success",
      bgColor: "bg-success/10",
      borderColor: "border-success/20",
      icon: <FaCheck className="text-success" />,
      label: "Low Risk",
      progress: 20
    }
  };
  
  const analyzeRiskMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/ai/analyze-risk", {
        documentContent,
        province,
      });
      
      return response.json();
    },
    onSuccess: (data: RiskAnalysisResult) => {
      setAnalysisResult(data);
      toast({
        title: "Analysis Complete",
        description: "Your document has been analyzed for legal risks.",
      });
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze document. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const handleAnalyzeRisk = () => {
    if (documentContent.trim()) {
      analyzeRiskMutation.mutate();
    } else {
      toast({
        title: "Empty Document",
        description: "Please enter document content to analyze.",
        variant: "destructive",
      });
    }
  };

  const getRiskConfig = (severity: string): RiskSeverityConfig => {
    return riskSeverityConfig[severity] || riskSeverityConfig["Medium"];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 font-sans">Risk Analysis</h2>
          <p className="text-neutral-500 text-sm mt-1">
            Analyze legal risks in your documents based on {province} law
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center p-2 rounded-md bg-primary/10 text-primary">
          <FaChartLine className="mr-2" />
          <span className="text-sm font-medium">AI-Powered Risk Assessment</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Document Risk Analysis</CardTitle>
              <CardDescription>
                Paste your document content to analyze potential legal risks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Textarea 
                  placeholder="Paste your legal document content here..."
                  className="min-h-[300px] font-mono text-sm"
                  value={documentContent}
                  onChange={(e) => setDocumentContent(e.target.value)}
                />
              </div>
              
              <Button 
                className="w-full"
                onClick={handleAnalyzeRisk}
                disabled={!documentContent.trim() || analyzeRiskMutation.isPending}
              >
                {analyzeRiskMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <FaClipboardCheck className="mr-2" />
                    Analyze Legal Risks
                  </>
                )}
              </Button>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-neutral-500">
                Analysis is performed based on {province} provincial laws and Canadian federal regulations.
              </p>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Risk Analysis Guide</CardTitle>
              <CardDescription>
                Understanding the risk analysis report
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-error/20 flex items-center justify-center mt-0.5 mr-2">
                    <FaExclamationTriangle className="text-error text-xs" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">High Risk Areas</h4>
                    <p className="text-xs text-neutral-600">
                      Critical issues that require immediate attention and modification
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-warning/20 flex items-center justify-center mt-0.5 mr-2">
                    <FaExclamationTriangle className="text-warning text-xs" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Medium Risk Areas</h4>
                    <p className="text-xs text-neutral-600">
                      Potential issues that should be reviewed and addressed
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-success/20 flex items-center justify-center mt-0.5 mr-2">
                    <FaCheck className="text-success text-xs" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Low Risk Areas</h4>
                    <p className="text-xs text-neutral-600">
                      Minor concerns or areas that meet legal requirements
                    </p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <p className="text-sm text-neutral-700">
                The analysis provides an overall risk assessment and breaks down specific areas of concern with actionable suggestions for improvement.
              </p>
              
              <div className="rounded-md border border-neutral-200 p-3">
                <h4 className="text-sm font-medium">Privacy Policy</h4>
                <p className="text-xs text-neutral-500 mt-1">
                  All document content is processed securely and not stored after analysis.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {analysisResult && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Risk Analysis Results</CardTitle>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskConfig(analysisResult.overallRisk).bgColor} ${getRiskConfig(analysisResult.overallRisk).color}`}>
                {analysisResult.overallRisk} Risk Level
              </div>
            </div>
            <CardDescription>
              Based on analysis of your document in the context of {province} law
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Overall Risk Level</h3>
                <span className="text-sm">{analysisResult.overallRisk}</span>
              </div>
              <Progress 
                value={getRiskConfig(analysisResult.overallRisk).progress} 
                className={`h-2 ${
                  analysisResult.overallRisk === "Low" 
                    ? "bg-success/20" 
                    : analysisResult.overallRisk === "Medium" 
                      ? "bg-warning/20" 
                      : "bg-error/20"
                }`}
                indicatorClassName={
                  analysisResult.overallRisk === "Low" 
                    ? "bg-success" 
                    : analysisResult.overallRisk === "Medium" 
                      ? "bg-warning" 
                      : "bg-error"
                }
              />
            </div>
            
            <Tabs defaultValue="risk-areas">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="risk-areas">Risk Areas</TabsTrigger>
                <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
              </TabsList>
              <TabsContent value="risk-areas" className="space-y-4 mt-4">
                {analysisResult.riskAreas.map((area, index) => {
                  const config = getRiskConfig(area.severity);
                  
                  return (
                    <div 
                      key={index} 
                      className={`p-4 rounded-md ${config.bgColor} border ${config.borderColor}`}
                    >
                      <div className="flex items-center">
                        <div className="h-6 w-6 rounded-full bg-white/60 flex items-center justify-center mr-2">
                          {config.icon}
                        </div>
                        <h4 className={`text-sm font-medium ${config.color}`}>
                          {area.area} <span className="text-xs font-normal">({area.severity} Risk)</span>
                        </h4>
                      </div>
                      <p className="text-sm mt-2 ml-8">{area.description}</p>
                    </div>
                  );
                })}
              </TabsContent>
              <TabsContent value="suggestions" className="mt-4">
                <div className="space-y-2">
                  {analysisResult.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 mr-2">
                        <FaCheck className="text-primary text-xs" />
                      </div>
                      <p className="text-sm">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" className="flex items-center">
              <FaFileAlt className="mr-2" />
              Export Report
            </Button>
            <p className="text-xs text-neutral-500">
              This analysis is provided as guidance and does not constitute legal advice.
            </p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default RiskAnalysis;
