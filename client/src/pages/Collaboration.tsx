import { FC, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  FaUsers, 
  FaUserPlus, 
  FaEnvelope, 
  FaEllipsisV,
  FaFileAlt,
  FaUsersCog
} from "react-icons/fa";
import { toast } from "@/hooks/use-toast";
import { Document } from "@shared/schema";

interface CollaborationProps {}

const Collaboration: FC<CollaborationProps> = () => {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  
  const { data: documents, isLoading } = useQuery<Document[]>({
    queryKey: ['/api/documents'],
  });

  const handleInvite = () => {
    toast({
      title: "Invitation Sent",
      description: "Your collaboration invitation has been sent successfully.",
    });
    setIsInviteDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 font-sans">Collaboration</h2>
          <p className="text-neutral-500 text-sm mt-1">
            Collaborate with colleagues and legal professionals
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center">
                <FaUserPlus className="mr-2" />
                <span>Invite Collaborator</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite a Collaborator</DialogTitle>
                <DialogDescription>
                  Add a colleague or legal professional to collaborate on your documents.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input type="email" placeholder="colleague@example.com" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Document</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a document" />
                    </SelectTrigger>
                    <SelectContent>
                      {documents?.map(doc => (
                        <SelectItem key={doc.id} value={doc.id.toString()}>
                          {doc.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Access Level</label>
                  <Select defaultValue="viewer">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viewer">Viewer (can view and comment)</SelectItem>
                      <SelectItem value="editor">Editor (can make changes)</SelectItem>
                      <SelectItem value="admin">Admin (full access)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message (Optional)</label>
                  <Input placeholder="Add a personal message..." />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleInvite}>Send Invitation</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Tabs defaultValue="shared">
        <TabsList className="mb-4">
          <TabsTrigger value="shared">Shared with Me</TabsTrigger>
          <TabsTrigger value="my-shares">My Shares</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
        </TabsList>
        
        <TabsContent value="shared">
          <Card>
            <CardHeader>
              <CardTitle>Documents Shared with Me</CardTitle>
              <CardDescription>
                Documents that others have shared with you for collaboration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Your Role</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <FaFileAlt className="text-primary mr-2" />
                          <span>Service Agreement for XYZ Corp</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarFallback>SJ</AvatarFallback>
                          </Avatar>
                          <span>Sarah Johnson</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-primary/10 text-primary">
                          Reviewer
                        </Badge>
                      </TableCell>
                      <TableCell>Today, 11:30 AM</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <FaFileAlt className="text-primary mr-2" />
                          <span>Partnership Agreement Draft</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarFallback>MT</AvatarFallback>
                          </Avatar>
                          <span>Michael Thomas</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-success/10 text-success">
                          Editor
                        </Badge>
                      </TableCell>
                      <TableCell>Yesterday, 3:45 PM</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="my-shares">
          <Card>
            <CardHeader>
              <CardTitle>My Shared Documents</CardTitle>
              <CardDescription>
                Documents you've shared with others for collaboration
              </CardDescription>
            </CardHeader>
            <CardContent>
              {documents && documents.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Document</TableHead>
                        <TableHead>Shared With</TableHead>
                        <TableHead>Their Role</TableHead>
                        <TableHead>Shared On</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documents.slice(0, 1).map(doc => (
                        <TableRow key={doc.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <FaFileAlt className="text-primary mr-2" />
                              <span>{doc.title}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <div className="flex items-center">
                                <Avatar className="h-6 w-6 mr-2">
                                  <AvatarFallback>LW</AvatarFallback>
                                </Avatar>
                                <span>Lisa Wong</span>
                              </div>
                              <div className="text-xs text-neutral-500 mt-1">
                                lisa.wong@example.com
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-primary/10 text-primary">
                              Reviewer
                            </Badge>
                          </TableCell>
                          <TableCell>Apr 12, 2023</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <FaEllipsisV />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Change Permissions</DropdownMenuItem>
                                <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-error">
                                  Revoke Access
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <FaUsers className="text-primary text-lg" />
                  </div>
                  <h3 className="text-lg font-medium text-neutral-800">No Shared Documents</h3>
                  <p className="text-neutral-500 mt-2 max-w-sm mx-auto">
                    You haven't shared any documents yet. Share a document to start collaborating.
                  </p>
                  <Button className="mt-4" onClick={() => setIsInviteDialogOpen(true)}>
                    <FaUserPlus className="mr-2" />
                    Share a Document
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="teams">
          <Card>
            <CardHeader>
              <CardTitle>Collaboration Teams</CardTitle>
              <CardDescription>
                Manage your collaboration teams for more efficient workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">Legal Department</CardTitle>
                      <Badge>5 Members</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex -space-x-2 mb-4">
                      <Avatar className="border-2 border-white">
                        <AvatarFallback>JS</AvatarFallback>
                      </Avatar>
                      <Avatar className="border-2 border-white">
                        <AvatarFallback>LW</AvatarFallback>
                      </Avatar>
                      <Avatar className="border-2 border-white">
                        <AvatarFallback>MT</AvatarFallback>
                      </Avatar>
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-100 border-2 border-white text-xs font-medium">
                        +2
                      </div>
                    </div>
                    <p className="text-sm text-neutral-500">
                      Internal legal team for document review and approval
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <FaUsersCog className="mr-2" />
                      Manage
                    </Button>
                    <Button variant="ghost" size="sm">
                      <FaEnvelope className="mr-2" />
                      Message
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">External Advisors</CardTitle>
                      <Badge>3 Members</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex -space-x-2 mb-4">
                      <Avatar className="border-2 border-white">
                        <AvatarFallback>SJ</AvatarFallback>
                      </Avatar>
                      <Avatar className="border-2 border-white">
                        <AvatarFallback>RB</AvatarFallback>
                      </Avatar>
                      <Avatar className="border-2 border-white">
                        <AvatarFallback>DM</AvatarFallback>
                      </Avatar>
                    </div>
                    <p className="text-sm text-neutral-500">
                      External legal consultants and advisors
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <FaUsersCog className="mr-2" />
                      Manage
                    </Button>
                    <Button variant="ghost" size="sm">
                      <FaEnvelope className="mr-2" />
                      Message
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <div className="mt-6 text-center">
                <Button variant="outline">
                  <FaUserPlus className="mr-2" />
                  Create New Team
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Collaboration Features</CardTitle>
          <CardDescription>
            Ways to collaborate on your legal documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg border border-neutral-200">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <FaUsers className="text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Real-time Collaboration</h3>
              <p className="text-sm text-neutral-600">
                Work together with your team in real-time on legal documents with comments and suggestions.
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-neutral-200">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <FaUsersCog className="text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Permission Controls</h3>
              <p className="text-sm text-neutral-600">
                Set granular access permissions to control who can view, comment, or edit your documents.
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-neutral-200">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <FaEnvelope className="text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Notification System</h3>
              <p className="text-sm text-neutral-600">
                Stay informed with instant notifications about document changes and comments.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Collaboration;
