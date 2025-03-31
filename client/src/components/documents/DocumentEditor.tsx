import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Loader2, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useProvince } from "@/contexts/ProvinceContext";

interface DocumentEditorProps {
  document?: {
    id?: number;
    title: string;
    content: string;
    type: string;
    province: string;
    status: string;
  };
  onSaved?: (document: any) => void;
}

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters",
  }),
  content: z.string().min(10, {
    message: "Content must be at least 10 characters",
  }),
  type: z.string({
    required_error: "Please select a document type",
  }),
  status: z.string({
    required_error: "Please select a status",
  }),
});

const statusOptions = [
  { value: "Draft", label: "Draft" },
  { value: "Active", label: "Active" },
  { value: "Review Needed", label: "Review Needed" },
  { value: "Archived", label: "Archived" },
];

const DocumentEditor: FC<DocumentEditorProps> = ({ document, onSaved }) => {
  const { province } = useProvince();
  const queryClient = useQueryClient();
  const isEditing = !!document?.id;
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: document?.title || "",
      content: document?.content || "",
      type: document?.type || "",
      status: document?.status || "Draft",
    },
  });
  
  const saveDocumentMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      if (isEditing) {
        const response = await apiRequest("PUT", `/api/documents/${document.id}`, {
          ...values,
          province,
        });
        return response.json();
      } else {
        const response = await apiRequest("POST", "/api/documents", {
          ...values,
          province,
        });
        return response.json();
      }
    },
    onSuccess: (savedDocument) => {
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      toast({
        title: isEditing ? "Document Updated" : "Document Created",
        description: `Your document has been ${isEditing ? "updated" : "created"} successfully.`,
      });
      
      if (onSaved) {
        onSaved(savedDocument);
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} document. Please try again.`,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    saveDocumentMutation.mutate(values);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Document" : "Create New Document"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Employment">Employment</SelectItem>
                        <SelectItem value="NDA">Non-Disclosure</SelectItem>
                        <SelectItem value="Lease">Lease</SelectItem>
                        <SelectItem value="Service">Service Agreement</SelectItem>
                        <SelectItem value="Partnership">Partnership</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      className="min-h-[300px] font-mono text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full"
                disabled={saveDocumentMutation.isPending}
              >
                {saveDocumentMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isEditing ? "Update Document" : "Save Document"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-neutral-500">
          This document will be saved for {province} jurisdiction.
        </p>
      </CardFooter>
    </Card>
  );
};

export default DocumentEditor;
