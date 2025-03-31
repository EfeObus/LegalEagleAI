import { createContext, useContext, useState, useEffect, FC, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  role: string;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: false,
  error: null,
  setUser: () => {},
  logout: () => {},
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  // TODO: Replace with actual authentication when implemented
  // This is a mock for demonstration purposes
  const mockUser: User = {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    username: "johnsmith",
    role: "user"
  };
  
  useEffect(() => {
    // Set mock user for demonstration
    setUser(mockUser);
  }, []);
  
  const logout = () => {
    setUser(null);
  };
  
  return (
    <UserContext.Provider value={{ user, isLoading: false, error: null, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
