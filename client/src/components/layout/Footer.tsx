import { FC } from "react";

const Footer: FC = () => {
  return (
    <footer className="py-6 px-4 border-t border-neutral-200 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <h3 className="text-lg font-bold text-neutral-900">Tekevwe</h3>
            <p className="mt-1 text-neutral-600">
              Canadian AI-powered legal document assistant
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-medium mb-3 text-neutral-900">Product</h4>
              <ul className="space-y-1">
                <li>
                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); window.location.href = "/"; }}
                    className="text-sm text-neutral-600 hover:text-primary"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); window.location.href = "/"; }}
                    className="text-sm text-neutral-600 hover:text-primary"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); window.location.href = "/"; }}
                    className="text-sm text-neutral-600 hover:text-primary"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-3 text-neutral-900">Resources</h4>
              <ul className="space-y-1">
                <li>
                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); window.location.href = "/"; }}
                    className="text-sm text-neutral-600 hover:text-primary"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); window.location.href = "/legal-research"; }}
                    className="text-sm text-neutral-600 hover:text-primary"
                  >
                    Legal Guides
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); window.location.href = "/templates"; }}
                    className="text-sm text-neutral-600 hover:text-primary"
                  >
                    Templates
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-3 text-neutral-900">Company</h4>
              <ul className="space-y-1">
                <li>
                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); window.location.href = "/"; }}
                    className="text-sm text-neutral-600 hover:text-primary"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); window.location.href = "/"; }}
                    className="text-sm text-neutral-600 hover:text-primary"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a 
                    href="mailto:efe.obukohwo@outlook.com"
                    className="text-sm text-neutral-600 hover:text-primary"
                  >
                    Support
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-neutral-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-neutral-500 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Tekevwe. All rights reserved.
          </p>
          
          <div className="flex space-x-4">
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); window.location.href = "/privacy-policy"; }}
              className="text-sm text-neutral-500 hover:text-primary"
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); window.location.href = "/terms-of-service"; }}
              className="text-sm text-neutral-500 hover:text-primary"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;