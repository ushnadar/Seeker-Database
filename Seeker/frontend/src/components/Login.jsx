import { useState } from "react";

function Login() {
  const [data, setData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (result.message === "Login successful") {
      window.location.href = "/dashboard";
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Welcome Back 👋</h2>
        <p className="subtitle">Login to your account</p>

        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} />

        <button onClick={handleLogin}>Login</button>

        <p className="switch">
          Don't have an account? <a href="/signup">Signup</a>
        </p>
      </div>
    </div>
  );
}

export default Login;