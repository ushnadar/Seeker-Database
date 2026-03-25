import { useState } from "react";

function Signup() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!data.name || !data.email || !data.password) {
      alert("All fields required");
      return;
    }

    const res = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    alert(result.message);
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Create Account 🚀</h2>
        <p className="subtitle">Join Lost & Found System</p>

        <input name="name" placeholder="Full Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} />
        <input name="phone" placeholder="Phone Number" onChange={handleChange} />

        <button onClick={handleSubmit}>Signup</button>

        <p className="switch">
          Already have an account? <a href="/">Login</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;