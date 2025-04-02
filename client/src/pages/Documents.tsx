import RecentDocuments from "@/components/dashboard/RecentDocuments";
import DocumentEditor from "@/components/documents/DocumentEditor";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Document } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { FC, useState } from "react";
import {
  FaFilter,
  FaPlus,
  FaSearch,
  FaSortAmountDown,
} from "react-icons/fa";

const Documents: FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openEditor, setOpenEditor] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | undefined>(undefined);
  
  const { data: documents, isLoading } = useQuery<Document[]>({
    queryKey: ['/api/documents'],
  });
  
  const handleCreateNew = () => {
    setSelectedDocument(undefined);
    setOpenEditor(true);
  };
  
  const handleEditDocument = (document: Document) => {
    setSelectedDocument(document);
    setOpenEditor(true);
  };
  
  const handleDocumentSaved = () => {
    setOpenEditor(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 font-sans">My Documents</h2>
          <p className="text-neutral-500 text-sm mt-1">
            Manage and organize your legal documents
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button className="flex items-center" onClick={handleCreateNew}>
            <FaPlus className="mr-2" />
            <span>New Document</span>
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="Search documents..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center">
              <FaFilter className="mr-2" />
              <span>Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Document Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked>
              All Types
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>
              Employment
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>
              NDA
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>
              Lease
            </DropdownMenuCheckboxItem>
            
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked>
              All Status
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>
              Active
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>
              Draft
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>
              Review Needed
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center">
              <FaSortAmountDown className="mr-2" />
              <span>Sort</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              Newest First
            </DropdownMenuItem>
            <DropdownMenuItem>
              Oldest First
            </DropdownMenuItem>
            <DropdownMenuItem>
              Alphabetical (A-Z)
            </DropdownMenuItem>
            <DropdownMenuItem>
              Alphabetical (Z-A)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="ai-generated">AI Generated</TabsTrigger>
          <TabsTrigger value="shared">Shared with Me</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <RecentDocuments />
        </TabsContent>
        
        <TabsContent value="recent">
          <RecentDocuments />
        </TabsContent>
        
        <TabsContent value="ai-generated">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <div className="bg-white rounded-lg p-8 text-center border border-neutral-200">
              <h3 className="text-lg font-medium text-neutral-800">No AI Generated Documents</h3>
              <p className="text-neutral-500 mt-2">
                Start creating AI-powered legal documents with our document generator
              </p>
              <Button className="mt-4" asChild>
                <a href="/contract-generator">Generate Document</a>
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="shared">
          <div className="bg-white rounded-lg p-8 text-center border border-neutral-200">
            <h3 className="text-lg font-medium text-neutral-800">No Shared Documents</h3>
            <p className="text-neutral-500 mt-2">
              Documents shared with you will appear here
            </p>
            <Button className="mt-4" variant="outline" asChild>
              <a href="/collaboration">Collaboration Settings</a>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      
      <Dialog open={openEditor} onOpenChange={setOpenEditor}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {selectedDocument ? "Edit Document" : "Create New Document"}
            </DialogTitle>
          </DialogHeader>
          <DocumentEditor 
            document={selectedDocument} 
            onSaved={handleDocumentSaved}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Documents;
