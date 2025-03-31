import { useMemo } from "react";

interface DocumentType {
  id: string;
  value: string;
  label: string;
  description?: string;
}

export function useDocumentTypes() {
  const documentTypes: DocumentType[] = useMemo(() => [
    {
      id: "employment",
      value: "Employment",
      label: "Employment Agreement",
      description: "Standard employment contracts with customizable terms"
    },
    {
      id: "nda",
      value: "NDA",
      label: "Non-Disclosure Agreement",
      description: "Confidentiality agreements to protect sensitive information"
    },
    {
      id: "lease",
      value: "Lease",
      label: "Lease Agreement",
      description: "Residential and commercial property lease contracts"
    },
    {
      id: "service",
      value: "Service",
      label: "Service Agreement",
      description: "Contracts for providing professional services"
    },
    {
      id: "partnership",
      value: "Partnership",
      label: "Partnership Agreement",
      description: "Legal agreements between business partners"
    },
    {
      id: "ip",
      value: "IP",
      label: "Intellectual Property",
      description: "IP licensing and transfer agreements"
    },
    {
      id: "consulting",
      value: "Consulting",
      label: "Consulting Agreement",
      description: "Contracts for consulting services"
    },
    {
      id: "shareholder",
      value: "Shareholder",
      label: "Shareholder Agreement",
      description: "Agreements between company shareholders"
    }
  ], []);

  return {
    documentTypes
  };
}
