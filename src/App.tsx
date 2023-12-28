import { useState } from 'react';
import './App.css';
import Heading from './components/ui/heading';
import { Title } from './components/ui/title';
import { InputWithButton } from './components/ui/inputWithButton';
import UserCard from './components/ui/userCard';
import JsonCard from './components/ui/jsonCard';

// Define a type for your API response
// Replace 'any' with a more specific type if you know the structure of your API response
type ApiResponse = any | null;

function App() {
  const [username, setUsername] = useState<string>("");
  const [apiResponse, setApiResponse] = useState<ApiResponse>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`https://api.sleeper.app/v1/user/${username}`);
      const data: ApiResponse = await response.json();
      setApiResponse(data);
      // Extract user_id and set it in state
      if (data && data.user_id) {
        setUserId(data.user_id);
      }
      if (data && data.display_name) {
        setDisplayName(data.display_name);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  return (
    <>
      <Heading />
      <Title />
      <InputWithButton username={username} setUsername={setUsername} fetchUserData={fetchUserData} />
      <UserCard username={username} userId={userId} displayName={displayName}/>
      <JsonCard username={username} data={apiResponse} userId={userId} />
    </>
  );
}

export default App;