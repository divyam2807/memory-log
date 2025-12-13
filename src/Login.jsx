import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async () => {
    setError("");
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      onLogin(res.user);
    } catch {
      setError("This space is only for us.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="login-card">
        <h2>Private Memory Log</h2>
        <p>A space that belongs only to us</p>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div style={{ height: "14px" }} />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div style={{ height: "24px" }} />

        <button onClick={login} style={{ width: "100%" }}>
          Enter
        </button>

        {error && (
          <p style={{ color: "#ff6ec7", marginTop: "16px" }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
