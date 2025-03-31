import { FC } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy: FC = () => {
  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="border-neutral-200">
          <CardHeader className="border-b pb-8">
            <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <CardTitle className="text-3xl">Privacy Policy</CardTitle>
            <CardDescription>Last Updated: March 31, 2025</CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="prose max-w-none">
              <p>
                At Tekevwe, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered legal document assistant service, accessible from our website or application (the "Service").
              </p>
              
              <h2>Information We Collect</h2>
              
              <p>We collect information that you provide directly to us when you:</p>
              <ul>
                <li>Create an account</li>
                <li>Upload documents</li>
                <li>Generate legal documents</li>
                <li>Use our AI research assistant</li>
                <li>Communicate with us</li>
              </ul>
              
              <p>This information may include:</p>
              <ul>
                <li>Personal identifiers (name, email address, account credentials)</li>
                <li>Professional information (organization, role)</li>
                <li>Content of documents and information you upload or generate</li>
                <li>Communication content and metadata when you contact us</li>
              </ul>
              
              <p>We also collect certain information automatically when you use our Service, including:</p>
              <ul>
                <li>Log data (IP address, browser type, pages visited, time spent)</li>
                <li>Device information (device type, operating system)</li>
                <li>Usage patterns and preferences</li>
              </ul>
              
              <h2>How We Use Your Information</h2>
              
              <p>We use the information we collect to:</p>
              <ul>
                <li>Provide, maintain, and improve our Service</li>
                <li>Process and complete transactions</li>
                <li>Send administrative information, including updates to our terms and policies</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Develop new products and services</li>
                <li>Detect and prevent fraudulent or illegal activity</li>
                <li>Monitor and analyze usage patterns and trends</li>
              </ul>
              
              <h2>Data Security</h2>
              
              <p>
                We implement reasonable and appropriate security measures to protect your personal information from unauthorized access, disclosure, and destruction. However, no security system is impenetrable, and we cannot guarantee the absolute security of your data.
              </p>
              
              <h2>Data Sharing</h2>
              
              <p>We may share your information with:</p>
              <ul>
                <li>Service providers who perform services on our behalf</li>
                <li>Professional advisors, such as lawyers, auditors, and insurers</li>
                <li>Authorities when required by law or to protect our rights</li>
                <li>Business partners with your consent or at your direction</li>
              </ul>
              
              <h2>Your Choices</h2>
              
              <p>You can control your information in the following ways:</p>
              <ul>
                <li>Account Settings: Update or correct your personal information</li>
                <li>Email Communications: Opt out of marketing emails</li>
                <li>Cookies: Modify browser settings to refuse cookies</li>
                <li>Access and Export: Request a copy of your data</li>
                <li>Deletion: Request deletion of your account and associated data</li>
              </ul>
              
              <h2>Changes to This Policy</h2>
              
              <p>
                We may update this Privacy Policy from time to time to reflect changes to our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our website with a new effective date.
              </p>
              
              <h2>Contact Us</h2>
              
              <p>
                If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
              </p>
              
              <p>
                <a href="mailto:efe.obukohwo@outlook.com" className="text-primary hover:underline">
                  efe.obukohwo@outlook.com
                </a>
              </p>
              
              <hr className="my-8" />
              
              <div className="text-center">
                <p className="mb-6">
                  By using our Service, you acknowledge that you have read and understand this Privacy Policy.
                </p>
                
                <Button asChild className="mx-auto">
                  <Link href="/">Return to Home</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;