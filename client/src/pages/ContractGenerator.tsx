import { FC } from "react";
import { useProvince } from "@/contexts/ProvinceContext";
import DocumentGenerator from "@/components/documents/DocumentGenerator";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Info } from "lucide-react";
import { FaBalanceScale, FaShieldAlt, FaMapMarkerAlt } from "react-icons/fa";

const ContractGenerator: FC = () => {
  const { province } = useProvince();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 font-sans">Contract Generator</h2>
          <p className="text-neutral-500 text-sm mt-1">
            Create legally compliant contracts powered by AI
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center p-2 rounded-md bg-primary/10 text-primary">
          <FaMapMarkerAlt className="mr-2" />
          <span className="text-sm font-medium">Province: {province}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DocumentGenerator />
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Province-Specific Information</CardTitle>
              <CardDescription>
                Legal information relevant to {province}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-primary/5 border-primary/20">
                <FaBalanceScale className="h-4 w-4" />
                <AlertTitle>Legal Requirements</AlertTitle>
                <AlertDescription>
                  Contracts generated for {province} comply with the latest provincial regulations and standards.
                </AlertDescription>
              </Alert>
              
              <Alert className="bg-primary/5 border-primary/20">
                <FaShieldAlt className="h-4 w-4" />
                <AlertTitle>Data Protection</AlertTitle>
                <AlertDescription>
                  All contracts follow {province}'s privacy and data protection requirements under PIPEDA.
                </AlertDescription>
              </Alert>
              
              <Separator />
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Contract Types Available</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-6 text-sm space-y-1">
                      <li>Employment Agreements</li>
                      <li>Non-Disclosure Agreements</li>
                      <li>Lease Agreements</li>
                      <li>Partnership Agreements</li>
                      <li>Service Agreements</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>Special Requirements for {province}</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-neutral-600 mb-2">
                      {province} has specific requirements for legal documents that our AI takes into account:
                    </p>
                    <ul className="list-disc pl-6 text-sm space-y-1">
                      {province === "Quebec" ? (
                        <>
                          <li>Civil Code of Quebec considerations</li>
                          <li>Bilingual documentation requirements</li>
                          <li>Quebec-specific employment standards</li>
                        </>
                      ) : province === "Ontario" ? (
                        <>
                          <li>Ontario Employment Standards Act compliance</li>
                          <li>Ontario Business Corporations Act provisions</li>
                          <li>Ontario Consumer Protection Act requirements</li>
                        </>
                      ) : province === "British Columbia" ? (
                        <>
                          <li>BC Employment Standards Act compliance</li>
                          <li>BC Business Corporations Act provisions</li>
                          <li>BC Personal Information Protection Act requirements</li>
                        </>
                      ) : (
                        <>
                          <li>Provincial employment standards compliance</li>
                          <li>Business corporation regulations</li>
                          <li>Consumer protection requirements</li>
                        </>
                      )}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <div className="rounded-md border border-neutral-200 p-4 text-sm">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">Important Disclaimer</p>
                    <p className="text-neutral-600 mt-1">
                      While our AI-generated contracts are based on current provincial laws, they should be reviewed by a qualified legal professional before use.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContractGenerator;
