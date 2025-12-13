import { useState } from "react";
import Login from "./Login";

function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Welcome</h1>
      <p>You are logged in.</p>
    </div>
  );
}

export default App;
