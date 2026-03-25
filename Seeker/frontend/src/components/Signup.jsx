import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const handleSignup = () => {
    if (name && email && password) {
      alert("Signup successful (demo)");
      navigate("/");
    } else {
      alert("Enter all details");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Signup</h2>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <button onClick={handleSignup}>Signup</button>
        <div className="link" onClick={() => navigate("/")}>
          Already have an account? Login
        </div>
      </div>
    </div>
  );
}

export default Signup;