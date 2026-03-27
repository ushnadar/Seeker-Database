import { useState } from "react";
import "../App.css";

function Signup() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "",
    color: "",
    hints: [],
    total: 5,
  });
  const [showStrength, setShowStrength] = useState(false);

  // password rules
  const passwordRules = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecial: true,
  };

  const checkPasswordStrength = (password) => {
    const hints = [];
    let score = 0;
    const total = 5; 

    if (password.length === 0) {
      setPasswordStrength({ score: 0, label: "", color: "", hints: [], total });
      return;
    }

    if (password.length >= passwordRules.minLength) score++;
    else hints.push(`At least ${passwordRules.minLength} characters long`);

    if (/[A-Z]/.test(password)) score++;
    else hints.push("At least one uppercase letter (A-Z)");

    if (/[a-z]/.test(password)) score++;
    else hints.push("At least one lowercase letter (a-z)");

    if (/[0-9]/.test(password)) score++;
    else hints.push("At least one number (0-9)");

    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;
    else hints.push("At least one special character (!@#$%^&*...)");

    const ratio = score / total;
    let label, color;

    if (ratio <= 0.2)      { label = "Very Weak";  color = "#e74c3c"; }
    else if (ratio <= 0.4) { label = "Weak";        color = "#e67e22"; }
    else if (ratio <= 0.6) { label = "Fair";        color = "#f1c40f"; }
    else if (ratio <= 0.8) { label = "Strong";      color = "#2ecc71"; }
    else                   { label = "Very Strong"; color = "#27ae60"; }

    setPasswordStrength({ score, label, color, hints, total });
  };

  const validate = () => {
    let err = {};

    if (!data.name) err.name = "Name is required";

    if (!data.email) err.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(data.email)) err.email = "Invalid email";

    if (!data.password) err.password = "Password is required";
    else if (passwordStrength.score < passwordStrength.total)
      err.password = "Password is too weak";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    if (name === "password") checkPasswordStrength(value);
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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
        <h2>Signup </h2>

        <select name="role" onChange={handleChange}>
          <option value="user">User Signup</option>
          <option value="admin">Admin Signup</option>
        </select>

        <input name="name" placeholder="Full Name" onChange={handleChange} />
        {errors.name && <span className="error">{errors.name}</span>}

        <input name="email" placeholder="Email" onChange={handleChange} />
        {errors.email && <span className="error">{errors.email}</span>}

        {}
        <div style={{ position: "relative" }}>
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            onFocus={() => setShowStrength(true)}
            onBlur={() => setShowStrength(false)}
            style={{ width: "100%" }}
          />

          {}
          {showStrength && data.password.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "110%",
                left: 0,
                width: "100%",
                background: "#fff",
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "10px 12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                zIndex: 100,
              }}
            >
              {}
              <div style={{ display: "flex", gap: "4px", marginBottom: "6px" }}>
                {Array.from({ length: passwordStrength.total }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: "5px",
                      borderRadius: "3px",
                      backgroundColor:
                        i < passwordStrength.score
                          ? passwordStrength.color
                          : "#eee",
                      transition: "background-color 0.3s",
                    }}
                  />
                ))}
              </div>

              {}
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  color: passwordStrength.color,
                }}
              >
                {passwordStrength.label}
              </span>

              {}
              {passwordStrength.hints.length > 0 ? (
                <ul style={{ margin: "6px 0 0 0", paddingLeft: "16px" }}>
                  {passwordStrength.hints.map((hint, i) => (
                    <li
                      key={i}
                      style={{
                        fontSize: "11px",
                        color: "#e74c3c",
                        marginBottom: "2px",
                      }}
                    >
                       {hint}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ fontSize: "11px", color: "#27ae60", margin: "6px 0 0 0" }}>
                   Password meets all requirements!
                </p>
              )}
            </div>
          )}
        </div>

        {errors.password && (
          <span className="error">{errors.password}</span>
        )}

        <button onClick={handleSubmit} style={{ marginTop: "10px" }}>
          Signup
        </button>

        <p className="switch">
          Already have an account? <a href="/">Login</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;