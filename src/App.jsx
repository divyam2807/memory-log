import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";

import Login from "./Login";
import MemoryList from "./MemoryList";
import MemoryModal from "./MemoryModal";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

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
      {/* HEADER */}
      <header>
        <h1 style={{ fontWeight: "normal" }}>Private Memory Log</h1>

        <button
          onClick={() => {
            signOut(auth);
          }}
        >
          Logout
        </button>
      </header>

      {/* WRITE MEMORY */}
      <button onClick={() => setModal({ mode: "new" })}>
        + Write a memory
      </button>

      {/* TIMELINE */}
      <MemoryList
        onEdit={(m) => setModal({ mode: "edit", memory: m })}
      />

      {/* MODAL */}
      {modal && (
        <MemoryModal
          mode={modal.mode}
          memory={modal.memory}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

export default App;
