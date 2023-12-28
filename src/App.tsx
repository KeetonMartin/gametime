import { useState } from 'react'
import './App.css'
import Heading from './components/ui/heading'
import { Title } from './components/ui/title'
import { InputWithButton } from './components/ui/inputWithButton'
import JsonCard from './components/ui/jsonCard'

function App() {
  const [username, setUsername] = useState("");
  const [apiResponse, setApiResponse] = useState(null);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`https://api.sleeper.app/v1/user/${username}`);
      const data = await response.json();
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