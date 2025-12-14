import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";

import Login from "./Login";
import Tabs from "./Tabs";
import Dashboard from "./Dashboard";
import Calendar from "./Calendar";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) return null;
  if (!user) return <Login onLogin={setUser} />;

  return (
    <div style={{ maxWidth: "760px", margin: "auto", padding: "40px" }}>
      <header>
        <h1 style={{ fontWeight: "normal" }}>Private Memory Log</h1>
        <button onClick={() => signOut(auth)}>Logout</button>
      </header>

      <Tabs active={activeTab} onChange={setActiveTab} />

      {activeTab === "dashboard" && <Dashboard />}
      {activeTab === "calendar" && <Calendar />}

    </div>
  );
}

export default App;
