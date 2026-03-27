import { useState } from "react";
import "../App.css";

function Login() {
  const [data, setData] = useState({
    email: "",
    password: "",
    role: "user",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let err = {};

    if (!data.email) err.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(data.email))
      err.email = "Invalid email format";

    if (!data.password) err.password = "Password is required";
    else if (data.password.length < 6)
      err.password = "Minimum 6 characters required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data), 
      });

      const result = await res.json();

      if (result.message === "Login successful") {
        localStorage.setItem("user", JSON.stringify(result.user));

        // login based on role
        if (result.user.role === "admin") {
          window.location.href = "/admin-dashboard";
        } else {
          window.location.href = "/user-dashboard";
        }
      } else {
        alert(result.message);
      }
    } catch {
      alert("Server error");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Login </h2>

        <select name="role" onChange={handleChange}>
          <option value="user">User Login</option>
          <option value="admin">Admin Login</option>
        </select>

        <input name="email" placeholder="Email" onChange={handleChange} />
        {errors.email && <span className="error">{errors.email}</span>}

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        />
        {errors.password && (
          <span className="error">{errors.password}</span>
        )}

        <button onClick={handleLogin}>Login</button>

        <p className="switch">
          Don't have an account? <a href="/signup">Signup</a>
        </p>
      </div>
    </div>
  );
}

export default Login;