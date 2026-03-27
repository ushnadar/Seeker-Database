import { useState } from "react";
import "../App.css";

function Signup() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "user",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let err = {};

    if (!data.name) err.name = "Name is required";

    if (!data.email) err.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(data.email))
      err.email = "Invalid email";

    if (!data.password) err.password = "Password is required";
    else if (data.password.length < 6)
      err.password = "Minimum 6 characters required";

    if (!data.phone) err.phone = "Phone is required";
    else if (!/^\d{10,13}$/.test(data.phone))
      err.phone = "Invalid phone number";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data), // sends role too
      });

      const result = await res.json();
      alert(result.message);

      if (result.message === "User registered successfully") {
        window.location.href = "/";
      }
    } catch {
      alert("Server error");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Signup 🚀</h2>

        <select name="role" onChange={handleChange}>
          <option value="user">User Signup</option>
          <option value="admin">Admin Signup</option>
        </select>

        <input name="name" placeholder="Full Name" onChange={handleChange} />
        {errors.name && <span className="error">{errors.name}</span>}

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

        <input
          name="phone"
          placeholder="Phone Number"
          onChange={handleChange}
        />
        {errors.phone && <span className="error">{errors.phone}</span>}

        <button onClick={handleSubmit}>Signup</button>

        <p className="switch">
          Already have an account? <a href="/">Login</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;