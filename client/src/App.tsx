import { Switch, Route, useLocation } from "wouter";
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
import Auth from "@/pages/Auth";
import Home from "@/pages/Home";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import AIChatAssistant from "@/components/layout/AIChatAssistant";
import { ProvinceProvider } from "@/contexts/ProvinceContext";
import { UserProvider } from "@/contexts/UserContext";
import { useUser } from "@/contexts/UserContext";
import { useState, useEffect } from "react";

// Protected route component
function ProtectedRoute({ component: Component, ...rest }: { component: React.ComponentType<any>; [key: string]: any }) {
  const { user } = useUser();
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    if (!user) {
      setLocation("/auth");
    }
  }, [user, setLocation]);
  
  if (!user) return null;
  
  return <Component {...rest} />;
}

function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user } = useUser();
  const [location] = useLocation();
  
  // Don't show the main app layout on public pages
  if (location === "/auth" || location === "/" || location === "/privacy-policy" || location === "/terms-of-service") {
    return (
      <Switch>
        <Route path="/auth" component={Auth} />
        <Route path="/" component={Home} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/terms-of-service" component={TermsOfService} />
      </Switch>
    );
  }
  
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
              <Route path="/">
                {() => <Dashboard />}
              </Route>
              <Route path="/documents">
                {() => <ProtectedRoute component={Documents} />}
              </Route>
              <Route path="/templates">
                {() => <ProtectedRoute component={Templates} />}
              </Route>
              <Route path="/ai-assistant">
                {() => <ProtectedRoute component={AIAssistant} />}
              </Route>
              <Route path="/contract-generator">
                {() => <ProtectedRoute component={ContractGenerator} />}
              </Route>
              <Route path="/legal-research">
                {() => <ProtectedRoute component={LegalResearch} />}
              </Route>
              <Route path="/collaboration">
                {() => <ProtectedRoute component={Collaboration} />}
              </Route>
              <Route path="/risk-analysis">
                {() => <ProtectedRoute component={RiskAnalysis} />}
              </Route>
              <Route component={NotFound} />
            </Switch>
          </div>
        </main>
      </div>
      
      {user && <AIChatAssistant />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <ProvinceProvider>
          <AppContent />
          <Toaster />
        </ProvinceProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
