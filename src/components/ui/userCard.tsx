import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Define the types for the props
interface UserCardProps {
  username: string;
  userId: string | null;
  displayName: string | null;
}

const UserCard: React.FC<UserCardProps> = ({ username, userId, displayName }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{username}</CardTitle>
        <CardDescription>{userId}</CardDescription>
        <CardDescription>Display Name: {displayName}</CardDescription>
      </CardHeader>
      <CardContent>
        <p></p>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
};

export default UserCard;
