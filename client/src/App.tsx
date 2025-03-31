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
import Footer from "@/components/layout/Footer";
import { ProvinceProvider } from "@/contexts/ProvinceContext";
import { UserProvider } from "@/contexts/UserContext";
import { useUser } from "@/contexts/UserContext";
import { useState, useEffect } from "react";

// Protected route component
function ProtectedRoute({ component: Component, ...rest }: { component: React.ComponentType<any>; [key: string]: any }) {
  const { user } = useUser();
  
  useEffect(() => {
    if (!user) {
      window.location.href = "/auth";
    }
  }, [user]);
  
  if (!user) return null;
  
  return <Component {...rest} />;
}

function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user } = useUser();
  const [location] = useLocation();
  
  // Public pages (no layout)
  const isPublicPage = location === "/" || location === "/privacy-policy" || location === "/terms-of-service" || location === "/auth";
  
  // Check if page is a protected route that needs authentication
  const isProtectedPage = location === "/dashboard" || location === "/documents" || 
                       location === "/templates" || location === "/ai-assistant" || 
                       location === "/contract-generator" || location === "/legal-research" || 
                       location === "/collaboration" || location === "/risk-analysis";
  
  // If trying to access protected page without auth, redirect to auth
  useEffect(() => {
    if (isProtectedPage && !user) {
      window.location.href = "/auth";
    }
  }, [isProtectedPage, user, location]);
  
  // Public pages layout
  if (isPublicPage) {
    return (
      <>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/auth" component={Auth} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/terms-of-service" component={TermsOfService} />
          <Route component={NotFound} />
        </Switch>
        {location !== "/" && <Footer />}
      </>
    );
  }
  
  // Protected app layout
  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <div className="flex flex-1">
        <Sidebar isOpen={isSidebarOpen} />
        
        <div className="flex-1 flex flex-col">
          <main className="flex-1 overflow-y-auto bg-neutral-50">
            <div className="container mx-auto px-4 py-6 max-w-7xl">
              <Switch>
                <Route path="/dashboard" component={Dashboard} />
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
          <Footer />
        </div>
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
