const sql = require("../db");
const bcrypt = require("bcrypt");

// SIGNUP
exports.signup = async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const allowedRoles = ["user", "admin"];
  const assignedRole = allowedRoles.includes(role) ? role : "user";

  try {
    // Check if email already exists for the SAME role
    const checkUser = await sql.query`
      SELECT * FROM users WHERE email = ${email} AND role = ${assignedRole}
    `;

    if (checkUser.recordset.length > 0) {
      return res.status(400).json({ message: "Email already registered for this role" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await sql.query`
      INSERT INTO users (name, email, password, phone, role)
      VALUES (${name}, ${email}, ${hashedPassword}, ${phone}, ${assignedRole})
    `;

    res.json({ message: "User registered successfully" });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// LOGIN
exports.login = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    // Fetch user matching BOTH email AND role
    const result = await sql.query`
      SELECT * FROM users WHERE email = ${email} AND role = ${role}
    `;

    if (result.recordset.length === 0) {
      return res.status(400).json({ message: "No account found for this role" });
    }

    const user = result.recordset[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};