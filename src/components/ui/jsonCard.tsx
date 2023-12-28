import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function JsonCard({ username, data }) {
    return (
    <Card>
      <CardHeader>
        <CardTitle>Username</CardTitle>
        <CardDescription>{username}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>API Response:</p>
        {/* Check if data exists and is an object before stringifying */}
        {data && typeof data === 'object' ? (
          <pre>{JSON.stringify(data, null, 2)}</pre>
        ) : (
          <p>No data or invalid format</p>
        )}
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
}

export default JsonCard;
