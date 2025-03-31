import { FC } from "react";
import { useProvince } from "@/contexts/ProvinceContext";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useProvinces } from "@/hooks/useProvinces";

interface ProvinceSelectorProps {
  minimal?: boolean;
}

const ProvinceSelector: FC<ProvinceSelectorProps> = ({ minimal = false }) => {
  const { province, setProvince } = useProvince();
  const { provinces } = useProvinces();
  
  return (
    <Select value={province} onValueChange={setProvince}>
      <SelectTrigger 
        className={minimal ? "bg-transparent border-0 focus:ring-0 p-0" : ""}
      >
        <SelectValue placeholder="Select province" />
      </SelectTrigger>
      <SelectContent>
        {provinces.map((prov) => (
          <SelectItem key={prov.value} value={prov.value}>
            {prov.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ProvinceSelector;
