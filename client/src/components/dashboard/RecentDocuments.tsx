import { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaFileAlt, FaEdit, FaDownload, FaEllipsisV } from "react-icons/fa";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Document } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

const statusColors = {
  Active: "bg-success/10 text-success",
  "Review Needed": "bg-warning/10 text-warning",
  Draft: "bg-neutral-100 text-neutral-800",
};

const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return `Today, ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
  } else if (diffDays === 1) {
    return `Yesterday, ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
};

const RecentDocuments: FC = () => {
  const { data: documents, isLoading } = useQuery<Document[]>({
    queryKey: ['/api/documents'],
  });

  if (isLoading) {
    return (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-neutral-800 font-sans">Recent Documents</h3>
        </div>
        <Card className="border-neutral-200">
          <div className="p-6 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-neutral-800 font-sans">Recent Documents</h3>
        <Button variant="link" className="text-primary text-sm">
          View all
        </Button>
      </div>
      
      <Card className="border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-neutral-50">
              <TableRow>
                <TableHead className="text-neutral-500 uppercase text-xs font-medium">Document Name</TableHead>
                <TableHead className="text-neutral-500 uppercase text-xs font-medium">Type</TableHead>
                <TableHead className="text-neutral-500 uppercase text-xs font-medium">Province</TableHead>
                <TableHead className="text-neutral-500 uppercase text-xs font-medium">Status</TableHead>
                <TableHead className="text-neutral-500 uppercase text-xs font-medium">Last Updated</TableHead>
                <TableHead className="text-neutral-500 uppercase text-xs font-medium text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents?.map((doc) => (
                <TableRow key={doc.id} className="hover:bg-neutral-50 transition-colors">
                  <TableCell>
                    <div className="flex items-center">
                      <FaFileAlt className="text-primary mr-3" />
                      <div>
                        <div className="text-sm font-medium text-neutral-900">{doc.title}</div>
                        <div className="text-xs text-neutral-500">
                          {doc.isAIGenerated ? "AI-generated" : "Template-based"}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-neutral-500">
                    {doc.type}
                  </TableCell>
                  <TableCell className="text-sm text-neutral-500">
                    {doc.province}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`px-2 font-semibold text-xs ${statusColors[doc.status as keyof typeof statusColors] || "bg-neutral-100 text-neutral-800"}`}
                    >
                      {doc.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-neutral-500">
                    {formatDate(doc.updatedAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon" className="text-primary hover:text-primary-foreground">
                        <FaEdit />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-neutral-600 hover:text-neutral-900">
                        <FaDownload />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-neutral-600 hover:text-neutral-900">
                            <FaEllipsisV />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Share</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuItem>Archive</DropdownMenuItem>
                          <DropdownMenuItem className="text-error">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default RecentDocuments;
