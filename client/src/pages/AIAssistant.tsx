import { FC, useState } from "react";
import { useProvince } from "@/contexts/ProvinceContext";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import DocumentSummarizer from "@/components/documents/DocumentSummarizer";
import DocumentGenerator from "@/components/documents/DocumentGenerator";
import { FaRobot, FaFileAlt, FaFileSignature, FaComments, FaHistory } from "react-icons/fa";

const AIAssistant: FC = () => {
  const { province } = useProvince();
  const [activeTab, setActiveTab] = useState("summarize");
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 font-sans">AI Legal Assistant</h2>
          <p className="text-neutral-500 text-sm mt-1">
            Powerful AI tools to assist with your legal documents
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <FaRobot className="mr-2 text-primary" />
                AI Tools
              </CardTitle>
              <CardDescription>
                Specialized legal AI tools
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs
                orientation="vertical"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="flex flex-col items-stretch h-auto">
                  <TabsTrigger 
                    value="summarize" 
                    className="flex items-center justify-start text-left py-3 px-4"
                  >
                    <FaFileAlt className="mr-2" />
                    Document Summarizer
                  </TabsTrigger>
                  <TabsTrigger 
                    value="generator" 
                    className="flex items-center justify-start text-left py-3 px-4"
                  >
                    <FaFileSignature className="mr-2" />
                    Document Generator
                  </TabsTrigger>
                  <TabsTrigger 
                    value="chat" 
                    className="flex items-center justify-start text-left py-3 px-4"
                  >
                    <FaComments className="mr-2" />
                    Legal Chat Assistant
                  </TabsTrigger>
                  <TabsTrigger 
                    value="history" 
                    className="flex items-center justify-start text-left py-3 px-4"
                  >
                    <FaHistory className="mr-2" />
                    AI History
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-3">
          {activeTab === "summarize" && <DocumentSummarizer />}
          
          {activeTab === "generator" && <DocumentGenerator />}
          
          {activeTab === "chat" && (
            <Card>
              <CardHeader>
                <CardTitle>Legal Chat Assistant</CardTitle>
                <CardDescription>
                  Ask questions about legal matters in {province}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-white rounded-lg p-8 text-center border border-neutral-200">
                  <div className="mx-auto h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <FaComments className="text-primary text-xl" />
                  </div>
                  <h3 className="text-lg font-medium text-neutral-800">Chat Assistant Available</h3>
                  <p className="text-neutral-500 mt-2 mb-4">
                    The chat assistant is available using the floating assistant button in the bottom right corner
                  </p>
                  <p className="text-xs text-neutral-500">
                    Powered by AI with {province} legal knowledge
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
          
          {activeTab === "history" && (
            <Card>
              <CardHeader>
                <CardTitle>AI Interaction History</CardTitle>
                <CardDescription>
                  View your past AI interactions and generated content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-neutral-200">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <FaFileAlt className="text-primary" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Document Summarization</h4>
                        <p className="text-xs text-neutral-500">Today, 10:30 AM</p>
                      </div>
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{province}</span>
                  </div>
                  <Separator className="my-3" />
                  <p className="text-sm text-neutral-600">
                    Summarized Employment Agreement document of 2,540 words
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-neutral-200">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <FaComments className="text-primary" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Legal Chat Session</h4>
                        <p className="text-xs text-neutral-500">Yesterday, 2:15 PM</p>
                      </div>
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{province}</span>
                  </div>
                  <Separator className="my-3" />
                  <p className="text-sm text-neutral-600">
                    Chat session about remote worker requirements in {province}
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-neutral-200">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <FaFileSignature className="text-primary" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Document Generation</h4>
                        <p className="text-xs text-neutral-500">Apr 15, 2023</p>
                      </div>
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{province}</span>
                  </div>
                  <Separator className="my-3" />
                  <p className="text-sm text-neutral-600">
                    Generated NDA document for technology company
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
