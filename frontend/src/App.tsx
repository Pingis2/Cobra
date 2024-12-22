import { useState, useEffect } from 'react'
import './App.css'

type User = {
  _id: string; // Assuming MongoDB returns an _id field
  firstName: string
}

type BackendData = {
  users?: User[];
  error?: boolean;
}

function App() {

  const [backendData, setBackendData] = useState<BackendData>({})

  useEffect(() => {
    fetch("https://express-test-pearl.vercel.app/api")
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(data => {
        console.log("Fetched data:", data); // Log the data
        setBackendData({ users: data.users });
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setBackendData({ error: true });
      });
  }, []);

  return (
    <>
      <div>
        {(typeof backendData.users === 'undefined') ? (
          <p>Loading...</p>
        ) : (
          backendData.users.map((user) => (
            <p key={user._id}>{user.firstName}</p>
          ))
        )}
      </div>
    </>
  )
}

export default App
