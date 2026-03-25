import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    // SAFELY skip fetch for now to avoid crash
    if (email && password) {
      localStorage.setItem("user", JSON.stringify({ name: "Demo User" }));
      navigate("/dashboard");
    } else {
      alert("Enter email and password");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Login</h2>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        <div className="link" onClick={() => navigate("/signup")}>
          Don't have an account? Signup
        </div>
      </div>
    </div>
  );
}

export default Login;