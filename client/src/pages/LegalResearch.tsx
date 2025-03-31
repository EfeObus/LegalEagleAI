import { FC, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { FaSearch, FaGavel, FaBalanceScale, FaNewspaper, FaExclamationTriangle } from "react-icons/fa";
import { Loader2 } from "lucide-react";

interface LegalInfo {
  keyProvisions: string[];
  relevantCases: string[];
  recentChanges: string[];
}

const legalTopics = [
  { value: "employment", label: "Employment Law" },
  { value: "privacy", label: "Privacy & Data Protection" },
  { value: "corporate", label: "Corporate Law" },
  { value: "real-estate", label: "Real Estate Law" },
  { value: "contracts", label: "Contract Law" },
  { value: "intellectual-property", label: "Intellectual Property" },
  { value: "family", label: "Family Law" },
  { value: "tax", label: "Tax Law" },
];

const LegalResearch: FC = () => {
  const { province } = useProvince();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string>("employment");
  
  const { data: legalInfo, isLoading } = useQuery<LegalInfo>({
    queryKey: ['/api/legal-info', province, selectedTopic],
    enabled: !!selectedTopic,
  });
  
  const searchMutation = useMutation({
    mutationFn: async (query: string) => {
      const response = await apiRequest("POST", "/api/ai/chat", {
        messages: [
          {
            role: "user",
            content: `Research the following legal topic in ${province}, Canada: ${query}`
          }
        ],
        province,
      });
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Research Complete",
        description: "Your legal research results are ready.",
      });
    },
    onError: (error) => {
      toast({
        title: "Research Failed",
        description: "Unable to complete legal research. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchMutation.mutate(searchQuery);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 font-sans">Legal Research</h2>
          <p className="text-neutral-500 text-sm mt-1">
            Research Canadian legal information for {province}
          </p>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Legal Information</CardTitle>
          <CardDescription>
            Search for specific legal topics or questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <Input
                placeholder="Search for legal information..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={!searchQuery.trim() || searchMutation.isPending}
            >
              {searchMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : "Search"}
            </Button>
          </div>
          
          {searchMutation.data && (
            <div className="mt-6 p-4 bg-primary/5 rounded-md border border-primary/20">
              <h3 className="text-lg font-medium mb-2">Research Results</h3>
              <p className="text-sm whitespace-pre-line">{searchMutation.data.response}</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Legal Topics</CardTitle>
              <CardDescription>
                Select a legal area to explore
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a legal topic" />
                </SelectTrigger>
                <SelectContent>
                  {legalTopics.map((topic) => (
                    <SelectItem key={topic.value} value={topic.value}>
                      {topic.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="mt-4">
                <Tabs defaultValue="provincial">
                  <TabsList className="w-full">
                    <TabsTrigger value="provincial" className="flex-1">Provincial</TabsTrigger>
                    <TabsTrigger value="federal" className="flex-1">Federal</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <FaBalanceScale className="text-primary" />
                  <span>Laws & Regulations</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <FaGavel className="text-primary" />
                  <span>Case Law</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <FaNewspaper className="text-primary" />
                  <span>Recent Updates</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {legalTopics.find(t => t.value === selectedTopic)?.label} in {province}
              </CardTitle>
              <CardDescription>
                Key legal information and updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoading ? (
                <div className="space-y-6">
                  <div>
                    <Skeleton className="h-6 w-40 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                  <Separator />
                  <div>
                    <Skeleton className="h-6 w-40 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ) : legalInfo ? (
                <>
                  <div>
                    <h3 className="text-lg font-medium mb-3">Key Provisions</h3>
                    <ul className="space-y-2">
                      {legalInfo.keyProvisions.map((provision, index) => (
                        <li key={index} className="flex items-start">
                          <FaBalanceScale className="text-primary mr-2 mt-1 flex-shrink-0" />
                          <span className="text-sm">{provision}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Relevant Cases</h3>
                    <ul className="space-y-2">
                      {legalInfo.relevantCases.map((case_, index) => (
                        <li key={index} className="flex items-start">
                          <FaGavel className="text-primary mr-2 mt-1 flex-shrink-0" />
                          <span className="text-sm">{case_}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Recent Changes</h3>
                    <ul className="space-y-2">
                      {legalInfo.recentChanges.map((change, index) => (
                        <li key={index} className="flex items-start">
                          <FaNewspaper className="text-primary mr-2 mt-1 flex-shrink-0" />
                          <span className="text-sm">{change}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="h-12 w-12 rounded-full bg-warning/20 flex items-center justify-center mb-4">
                    <FaExclamationTriangle className="text-warning" />
                  </div>
                  <h3 className="text-lg font-medium text-center">
                    Unable to load legal information
                  </h3>
                  <p className="text-neutral-500 text-center mt-2">
                    Please try selecting a different topic or province
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <p className="text-xs text-neutral-500">
                Legal information is updated regularly based on changes to Canadian law
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LegalResearch;
