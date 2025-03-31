import { FC } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaUserGraduate, FaUser, FaBuilding } from "react-icons/fa";
import { cn } from "@/lib/utils";

interface AccountTypeSelectorProps {
  selectedType: string;
  onSelect: (type: string) => void;
}

export const AccountTypeSelector: FC<AccountTypeSelectorProps> = ({
  selectedType,
  onSelect,
}) => {
  const accountTypes = [
    {
      id: "student",
      title: "Student",
      description: "For law students and legal education",
      icon: <FaUserGraduate className="h-8 w-8" />,
    },
    {
      id: "individual",
      title: "Individual",
      description: "For personal legal assistance",
      icon: <FaUser className="h-8 w-8" />,
    },
    {
      id: "business",
      title: "Business",
      description: "For companies and organizations",
      icon: <FaBuilding className="h-8 w-8" />,
    },
  ];

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Choose Account Type</CardTitle>
          <CardDescription>
            Select the type of account that best fits your needs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {accountTypes.map((type) => (
              <Button
                key={type.id}
                variant="outline"
                className={cn(
                  "h-auto p-4 justify-start items-center text-left flex gap-4 border-2",
                  selectedType === type.id
                    ? "border-primary bg-primary/5"
                    : "hover:border-primary/50"
                )}
                onClick={() => onSelect(type.id)}
              >
                <div
                  className={cn(
                    "p-2 rounded-full",
                    selectedType === type.id
                      ? "bg-primary text-white"
                      : "bg-neutral-100 text-neutral-500"
                  )}
                >
                  {type.icon}
                </div>
                <div>
                  <div className="font-medium">{type.title}</div>
                  <div className="text-sm text-neutral-500">
                    {type.description}
                  </div>
                  <div className="text-xs mt-1 text-primary font-medium">
                    Free plan
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountTypeSelector;