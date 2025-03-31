import { FC, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useProvince } from "@/contexts/ProvinceContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Loader2, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SummaryResult {
  summary: string;
  keyPoints: string[];
  risks: string[];
}

const DocumentSummarizer: FC = () => {
  const { province } = useProvince();
  const [documentContent, setDocumentContent] = useState("");
  const [summaryResult, setSummaryResult] = useState<SummaryResult | null>(null);
  const [detailLevel, setDetailLevel] = useState<"brief" | "detailed">("detailed");
  
  const summarizeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/ai/summarize", {
        documentContent,
        detailLevel,
      });
      
      return response.json();
    },
    onSuccess: (data: SummaryResult) => {
      setSummaryResult(data);
      toast({
        title: "Document Summarized",
        description: "Your document has been analyzed and summarized.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to summarize document. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Legal Document Summarizer</CardTitle>
          <CardDescription>
            Get a concise summary, key points, and potential issues from any legal document.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="input">
            <TabsList className="mb-4">
              <TabsTrigger value="input">Document Input</TabsTrigger>
              <TabsTrigger value="summary" disabled={!summaryResult}>
                Summary
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="input">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Detail Level</Label>
                    <div className="flex space-x-2">
                      <Button 
                        variant={detailLevel === "brief" ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setDetailLevel("brief")}
                      >
                        Brief
                      </Button>
                      <Button 
                        variant={detailLevel === "detailed" ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setDetailLevel("detailed")}
                      >
                        Detailed
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="document">Paste your document content</Label>
                  <Textarea 
                    id="document"
                    placeholder="Paste the legal document you want to summarize here..."
                    className="min-h-[300px] font-mono text-sm"
                    value={documentContent}
                    onChange={(e) => setDocumentContent(e.target.value)}
                  />
                </div>
                
                <Button 
                  onClick={() => summarizeMutation.mutate()}
                  disabled={!documentContent.trim() || summarizeMutation.isPending}
                  className="w-full"
                >
                  {summarizeMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : "Summarize Document"}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="summary">
              {summaryResult && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Document Summary</h3>
                    <div className="bg-primary/5 p-4 rounded-md border border-primary/20">
                      <p className="text-sm leading-relaxed">{summaryResult.summary}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium flex items-center">
                      <Info className="h-5 w-5 mr-2 text-primary" />
                      Key Points
                    </h3>
                    <ul className="space-y-2">
                      {summaryResult.keyPoints.map((point, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 mr-2 text-success flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-warning" />
                      Potential Risks
                    </h3>
                    {summaryResult.risks.length > 0 ? (
                      <ul className="space-y-2">
                        {summaryResult.risks.map((risk, index) => (
                          <li key={index} className="flex items-start">
                            <AlertTriangle className="h-5 w-5 mr-2 text-warning flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{risk}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertTitle>No significant risks detected</AlertTitle>
                        <AlertDescription>
                          This document appears to have no major legal issues based on our analysis.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-neutral-500">
            Analysis based on {province} provincial law and Canadian federal regulations.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DocumentSummarizer;
