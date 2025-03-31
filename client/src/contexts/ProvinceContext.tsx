import { createContext, useContext, useState, FC, ReactNode } from "react";

interface ProvinceContextType {
  province: string;
  setProvince: (province: string) => void;
}

const ProvinceContext = createContext<ProvinceContextType>({
  province: "Ontario",
  setProvince: () => {},
});

interface ProvinceProviderProps {
  children: ReactNode;
  initialProvince?: string;
}

export const ProvinceProvider: FC<ProvinceProviderProps> = ({ 
  children, 
  initialProvince = "Ontario" 
}) => {
  const [province, setProvince] = useState<string>(initialProvince);
  
  return (
    <ProvinceContext.Provider value={{ province, setProvince }}>
      {children}
    </ProvinceContext.Provider>
  );
};

export const useProvince = () => useContext(ProvinceContext);
