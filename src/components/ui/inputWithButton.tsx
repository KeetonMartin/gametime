import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function InputWithButton({ username, setUsername, fetchUserData }) {
  const handleButtonClick = () => {
    fetchUserData();
  };

  return (
    <div className="flex w-full max-w-sm items-center space-x-2 p-4">
      <Input
        type="search"
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Button type="submit" onClick={handleButtonClick}>
        Game Time
      </Button>
    </div>
  );
}
