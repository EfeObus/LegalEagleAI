import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useProvince } from "@/contexts/ProvinceContext";
import { useDocumentTypes } from "@/hooks/useDocumentTypes";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  documentType: z.string({
    required_error: "Please select a document type",
  }),
  title: z.string().min(3, {
    message: "Title must be at least 3 characters",
  }),
  parties: z.string().min(3, {
    message: "Please provide the parties involved",
  }),
  description: z.string().optional(),
  additionalTerms: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const DocumentGenerator: FC = () => {
  const { province } = useProvince();
  const { documentTypes } = useDocumentTypes();
  const [generatedContent, setGeneratedContent] = useState("");
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentType: "",
      title: "",
      parties: "",
      description: "",
      additionalTerms: "",
    },
  });
  
  const generateMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await apiRequest("POST", "/api/ai/generate-document", {
        documentType: data.documentType,
        province,
        parameters: {
          title: data.title,
          parties: data.parties,
          description: data.description,
          additionalTerms: data.additionalTerms,
        },
      });
      
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedContent(data.content);
      toast({
        title: "Document Generated",
        description: "Your legal document has been generated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to generate document. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: FormValues) => {
    generateMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Legal Document</CardTitle>
          <CardDescription>
            Create a new legal document with AI assistance, customized for {province} law.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="form">
            <TabsList className="mb-4">
              <TabsTrigger value="form">Document Details</TabsTrigger>
              <TabsTrigger value="preview" disabled={!generatedContent}>
                Generated Document
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="form">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="documentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Document Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a document type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {documentTypes.map((type) => (
                              <SelectItem key={type.id} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select the type of legal document you need to create.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Document Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Employment Agreement for ABC Inc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="parties"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parties Involved</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. ABC Inc. and John Smith" {...field} />
                        </FormControl>
                        <FormDescription>
                          List all parties that will be included in this document.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Purpose & Scope</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the purpose and scope of this document..." 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="additionalTerms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Terms (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Any specific terms or conditions you want to include..." 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={generateMutation.isPending}
                  >
                    {generateMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : "Generate Document"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="preview">
              {generatedContent && (
                <div className="border rounded-md p-4 bg-white">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {generatedContent}
                  </pre>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-xs text-neutral-500">
            Powered by AI with {province} legal knowledge
          </p>
          {generatedContent && (
            <Button variant="outline">
              Save Document
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default DocumentGenerator;
