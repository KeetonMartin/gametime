import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Define the types for the props
interface UserCardProps {
    data: null | any; // Replace 'any' with a more specific type if you know the structure of 'data'
}

const UserCard: React.FC<UserCardProps> = ({
  data,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Leagues</CardTitle>
        <CardDescription></CardDescription>
        <CardDescription>League Data</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{data}</p>
      </CardContent>
    </Card>
  );
};

export default UserCard;
