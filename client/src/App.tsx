import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Documents from "@/pages/Documents";
import Templates from "@/pages/Templates";
import AIAssistant from "@/pages/AIAssistant";
import ContractGenerator from "@/pages/ContractGenerator";
import LegalResearch from "@/pages/LegalResearch";
import Collaboration from "@/pages/Collaboration";
import RiskAnalysis from "@/pages/RiskAnalysis";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import AIChatAssistant from "@/components/layout/AIChatAssistant";
import { ProvinceProvider } from "@/contexts/ProvinceContext";
import { UserProvider } from "@/contexts/UserContext";
import { useState } from "react";

function Router() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <div className="flex flex-1 h-[calc(100vh-55px)]">
        <Sidebar isOpen={isSidebarOpen} />
        
        <main className="flex-1 overflow-y-auto bg-neutral-50 h-full">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/documents" component={Documents} />
              <Route path="/templates" component={Templates} />
              <Route path="/ai-assistant" component={AIAssistant} />
              <Route path="/contract-generator" component={ContractGenerator} />
              <Route path="/legal-research" component={LegalResearch} />
              <Route path="/collaboration" component={Collaboration} />
              <Route path="/risk-analysis" component={RiskAnalysis} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </main>
      </div>
      
      <AIChatAssistant />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <ProvinceProvider>
          <Router />
          <Toaster />
        </ProvinceProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
