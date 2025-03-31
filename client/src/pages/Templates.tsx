import { FC, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaFileAlt,
  FaClone,
  FaDownload
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useProvince } from "@/contexts/ProvinceContext";
import { Template } from "@shared/schema";

const Templates: FC = () => {
  const { province } = useProvince();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const { data: templates, isLoading } = useQuery<Template[]>({
    queryKey: ['/api/templates', { province: province }],
  });

  const filteredTemplates = templates?.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType ? template.type === selectedType : true;
    return matchesSearch && matchesType;
  });

  const documentTypes = [
    { value: "Employment", label: "Employment" },
    { value: "NDA", label: "Non-Disclosure" },
    { value: "Lease", label: "Lease" },
    { value: "Partnership", label: "Partnership" },
    { value: "Service", label: "Service Agreement" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 font-sans">Templates</h2>
          <p className="text-neutral-500 text-sm mt-1">
            Start with pre-built templates for various Canadian legal documents
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button className="flex items-center">
            <FaPlus className="mr-2" />
            <span>Create Template</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="Search templates..."
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
            <DropdownMenuCheckboxItem 
              checked={!selectedType}
              onCheckedChange={() => setSelectedType(null)}
            >
              All Types
            </DropdownMenuCheckboxItem>
            {documentTypes.map(type => (
              <DropdownMenuCheckboxItem 
                key={type.value}
                checked={selectedType === type.value}
                onCheckedChange={() => setSelectedType(type.value)}
              >
                {type.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Tabs defaultValue={province}>
        <TabsList className="mb-4">
          <TabsTrigger value="Ontario">Ontario</TabsTrigger>
          <TabsTrigger value="British Columbia">British Columbia</TabsTrigger>
          <TabsTrigger value="Alberta">Alberta</TabsTrigger>
          <TabsTrigger value="Quebec">Quebec</TabsTrigger>
          <TabsTrigger value="all">All Provinces</TabsTrigger>
        </TabsList>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="h-64">
                <CardHeader className="pb-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-24 w-full" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-9 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : filteredTemplates && filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="border border-neutral-200 hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{template.title}</CardTitle>
                      <CardDescription>{template.province}</CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-primary/10 text-primary">
                      {template.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-600 line-clamp-3">
                    {template.content.slice(0, 150)}...
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" className="flex items-center">
                    <FaClone className="mr-2" />
                    <span>Use Template</span>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <FaDownload />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8 text-center border border-neutral-200">
            <div className="mx-auto h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <FaFileAlt className="text-primary text-xl" />
            </div>
            <h3 className="text-lg font-medium text-neutral-800">No Templates Found</h3>
            <p className="text-neutral-500 mt-2">
              {searchQuery 
                ? `No templates matching "${searchQuery}" for the selected filters` 
                : `No templates available for the selected filters`}
            </p>
            <Button className="mt-4" onClick={() => {
              setSearchQuery("");
              setSelectedType(null);
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </Tabs>
    </div>
  );
};

export default Templates;
