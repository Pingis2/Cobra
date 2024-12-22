import { useState, useEffect } from 'react'
import './App.css'

type User = {
  _id: string; // Assuming MongoDB returns an _id field
  name: string
}

type BackendData = {
  users?: User[];
  error?: boolean;
}

function App() {

  const [backendData, setBackendData] = useState<BackendData>({})

  useEffect(() => {
    fetch("http://localhost:5000/api")
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
            <p key={user._id}>{user.name}</p>
          ))
        )}
      </div>
    </>
  )
}

export default App
