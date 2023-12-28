import { useState } from 'react';
import './App.css';
import Heading from './components/ui/heading';
import { Title } from './components/ui/title';
import { InputWithButton } from './components/ui/inputWithButton';
import JsonCard from './components/ui/jsonCard';

// Define a type for your API response
// Replace 'any' with a more specific type if you know the structure of your API response
type ApiResponse = any | null;

function App() {
  const [username, setUsername] = useState<string>("");
  const [apiResponse, setApiResponse] = useState<ApiResponse>(null);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`https://api.sleeper.app/v1/user/${username}`);
      const data: ApiResponse = await response.json();
      setApiResponse(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <>
      <Heading />
      <Title />
      <InputWithButton username={username} setUsername={setUsername} fetchUserData={fetchUserData} />
      <JsonCard username={username} data={apiResponse} />
    </>
  );
}

export default App;