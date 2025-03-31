import { FC } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';
import { FaFileAlt, FaBook, FaUserShield, FaShieldAlt, FaBalanceScale, FaChartLine, FaUsers } from 'react-icons/fa';

const Home: FC = () => {
  const { user } = useUser();
  const [, setLocation] = useLocation();

  const features = [
    {
      icon: <FaFileAlt className="h-10 w-10 text-primary" />,
      title: 'AI-Powered Document Generation',
      description: 'Generate legal documents tailored to Canadian provincial and federal laws with just a few clicks.'
    },
    {
      icon: <FaBook className="h-10 w-10 text-primary" />,
      title: 'Provincial Law Integration',
      description: 'Access legal information specific to your province, with automatic updates as laws change.'
    },
    {
      icon: <FaBalanceScale className="h-10 w-10 text-primary" />,
      title: 'Legal Research Assistant',
      description: 'Research laws, cases, and legal updates across 21 different areas of Canadian law.'
    },
    {
      icon: <FaChartLine className="h-10 w-10 text-primary" />,
      title: 'Risk Analysis',
      description: 'Identify potential legal risks in your documents with AI-powered analysis.'
    },
    {
      icon: <FaUsers className="h-10 w-10 text-primary" />,
      title: 'Collaboration Tools',
      description: 'Work with your team on legal documents in real-time with comments and version control.'
    },
    {
      icon: <FaShieldAlt className="h-10 w-10 text-primary" />,
      title: 'Document Templates',
      description: 'Access province-specific templates for all common legal documents and contracts.'
    }
  ];

  const handleGetStarted = () => {
    setLocation(user ? '/dashboard' : '/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 text-transparent bg-clip-text">
            Canadian AI-Powered Legal Document Assistant
          </h1>
          
          <p className="text-xl text-neutral-600 mb-10 max-w-3xl mx-auto">
            Tekevwe helps you generate, analyze, and collaborate on legal documents
            tailored to Canadian provincial and federal laws.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" onClick={handleGetStarted} className="text-lg px-8">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" asChild>
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
          
          {!user && (
            <div className="mt-10 p-6 max-w-2xl mx-auto rounded-lg bg-gradient-to-br from-primary/10 to-blue-500/10 border border-primary/20">
              <h3 className="text-xl font-semibold mb-2">Don't have an account yet?</h3>
              <p className="text-neutral-600 mb-4">
                Create a free account in seconds to start using Tekevwe's AI-powered legal tools.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Button onClick={() => setLocation('/auth')} variant="secondary" size="lg" className="px-8 text-lg">
                  Sign In
                </Button>
                <Button onClick={() => setLocation('/auth')} size="lg" className="px-8 text-lg bg-primary text-white hover:bg-primary/90">
                  Register Now
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Comprehensive Legal Document Solutions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-neutral-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-neutral-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Simplify Your Legal Document Workflow?
          </h2>
          
          <p className="text-lg text-neutral-600 mb-8">
            Join Tekevwe today and experience the power of AI-driven legal assistance
            tailored to Canadian law.
          </p>
          
          <Button 
            size="lg" 
            onClick={() => user ? setLocation('/dashboard') : setLocation('/auth')} 
            className="text-lg px-8"
          >
            {user ? 'Go to Dashboard' : 'Sign Up Now'}
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-10 px-4 bg-neutral-900 text-neutral-200">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold text-white">Tekevwe</h3>
              <p className="mt-2 text-neutral-400">
                Canadian AI-powered legal document assistant
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-lg font-medium mb-4">Product</h4>
                <ul className="space-y-2">
                  <li><Link href="#features" className="text-neutral-400 hover:text-white">Features</Link></li>
                  <li><span className="text-neutral-400 cursor-pointer" onClick={handleGetStarted}>Pricing</span></li>
                  <li><Link href="#features" className="text-neutral-400 hover:text-white">FAQ</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-medium mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li><span className="text-neutral-400 cursor-pointer" onClick={handleGetStarted}>Blog</span></li>
                  <li><span className="text-neutral-400 cursor-pointer" onClick={handleGetStarted}>Legal Guides</span></li>
                  <li><Link href="/templates" className="text-neutral-400 hover:text-white">Templates</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-medium mb-4">Company</h4>
                <ul className="space-y-2">
                  <li><span className="text-neutral-400 cursor-pointer" onClick={handleGetStarted}>About</span></li>
                  <li><span className="text-neutral-400 cursor-pointer" onClick={handleGetStarted}>Contact</span></li>
                  <li>
                    <a 
                      href="mailto:efe.obukohwo@outlook.com" 
                      className="text-neutral-400 hover:text-white"
                    >
                      Support
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-10 pt-6 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-400 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Tekevwe. All rights reserved.
            </p>
            
            <div className="flex space-x-4">
              <Link href="/privacy-policy" className="text-neutral-400 hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-neutral-400 hover:text-white">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;