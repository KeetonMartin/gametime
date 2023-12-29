import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Define the types for the props
interface UserCardProps {
  username: string;
  userId: string | null;
  displayName: string | null;
  avatar: string | null;
}

const UserCard: React.FC<UserCardProps> = ({
  username,
  userId,
  displayName,
  avatar,
}) => {
  return (
    <Card style={{ width: "33.33%" }}>
      <CardHeader>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {avatar && (
            <Avatar>
              <AvatarImage
                src={"https://sleepercdn.com/avatars/" + avatar}
                alt="@avatar"
              />
              <AvatarFallback>{username}</AvatarFallback>
            </Avatar>
          )}
        </div>

        <CardTitle>{username}</CardTitle>
        <CardDescription>{userId}</CardDescription>
        <CardDescription>Display Name: {displayName}</CardDescription>
      </CardHeader>
    </Card>
  );
};

export default UserCard;