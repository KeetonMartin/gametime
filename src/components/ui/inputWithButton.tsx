import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { ChangeEvent } from "react";

// Define the types for the props
interface InputWithButtonProps {
  username: string;
  setUsername: (username: string) => void;
  fetchUserData: () => void;
}

export function InputWithButton({ username, setUsername, fetchUserData }: InputWithButtonProps) {
  const handleButtonClick = () => {
    fetchUserData();
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  return (
    <div className="flex w-full max-w-sm items-center space-x-2 p-4">
      <Input
        type="search"
        placeholder="username"
        value={username}
        onChange={handleInputChange}
      />
      <Button type="submit" onClick={handleButtonClick}>
        Game Time
      </Button>
    </div>
  );
}
