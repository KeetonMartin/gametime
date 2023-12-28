import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Define the types for the props
interface JsonCardProps {
  username: string;
  data: null | any; // Replace 'any' with a more specific type if you know the structure of 'data'
  userId: string | null;
}

const JsonCard: React.FC<JsonCardProps> = ({ username, data, userId }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Username</CardTitle>
        <CardDescription>{username}</CardDescription>
        <CardDescription>{userId}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>API Response:</p>
        {data && typeof data === "object" ? (
          <pre>{JSON.stringify(data, null, 2)}</pre>
        ) : (
          <p>No data or invalid format</p>
        )}
        {/* Display user_id if available */}
        {userId && <p>User ID: {userId}</p>}
      </CardContent>
    </Card>
  );
};

export default JsonCard;
