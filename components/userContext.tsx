"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { User } from "@/components/types"; // Assuming your types file is in components

interface UserContextType {
  users: User[];
  isLoading: boolean;
}

// Create a context with a default value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a provider component
export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This useEffect runs only once when the provider is first mounted
    // because its dependency array [] is empty.
    const fetchUsers = async () => {
      try {
        const GAS_URL = process.env.NEXT_PUBLIC_GAS_URL!;
        const resp = await axios.get(GAS_URL, {
          params: { action: "getUsers" },
        });
        setUsers(Array.isArray(resp.data) ? resp.data : []);
      } catch (error) {
        console.error("Error fetching users from context:", error);
        setUsers([]); // Set to empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []); // <-- Empty dependency array is the key to fetching only once

  const value = { users, isLoading };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// Create a custom hook for easy access to the context
export function useUsers() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUsers must be used within a UserProvider");
  }
  return context;
}
