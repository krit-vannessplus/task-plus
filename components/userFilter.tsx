"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronsUpDown } from "lucide-react";
import { useUsers } from "@/components/userContext"; // <-- Import our new custom hook

interface UserFilterProps {
  selectedUsers: string[];
  onSelectAction: (users: string[]) => void;
}

export function UserFilter({ selectedUsers, onSelectAction }: UserFilterProps) {
  // Get users and loading state from the global context
  const { users: allUsers, isLoading: isLoadingUsers } = useUsers();
  const [searchQuery, setSearchQuery] = useState("");

  const handleUserToggle = (name: string) => {
    const newSelection = selectedUsers.includes(name)
      ? selectedUsers.filter((id) => id !== name)
      : [...selectedUsers, name];
    onSelectAction(newSelection);
  };

  const filteredUsers = allUsers.filter((user) =>
    user.Name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between"
          disabled={isLoadingUsers} // Disable button while the initial fetch is happening
        >
          {isLoadingUsers
            ? "Loading Users..."
            : `Select Users (${selectedUsers.length})`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-[--radix-dropdown-menu-trigger-width] max-h-[300px] overflow-y-auto"
      >
        <div className="p-2">
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <DropdownMenuSeparator />
        {!isLoadingUsers && filteredUsers.length === 0 && (
          <div className="px-2 py-1.5 text-sm text-muted-foreground">
            No users found.
          </div>
        )}
        {filteredUsers.slice(0, 100).map((user) => (
          <DropdownMenuCheckboxItem
            key={user.Name}
            checked={selectedUsers.includes(user.Name)}
            onSelect={(e) => {
              e.preventDefault();
              handleUserToggle(user.Name);
            }}
          >
            {user.Name}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
