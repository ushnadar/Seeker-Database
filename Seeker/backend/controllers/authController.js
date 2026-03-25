const sql = require("../db");
const bcrypt = require("bcrypt");

// SIGNUP
exports.signup = async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    // Check duplicate email
    const checkUser = await sql.query`
      SELECT * FROM users WHERE email = ${email}
    `;

    if (checkUser.recordset.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await sql.query`
      INSERT INTO users (name, email, password, phone)
      VALUES (${name}, ${email}, ${hashedPassword}, ${phone})
    `;

    res.json({ message: "Signup successful" });

  } catch (err) {
    res.status(500).json(err);
  }
};


// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await sql.query`
      SELECT * FROM users WHERE email = ${email}
    `;

    if (result.recordset.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
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
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json(err);
  }
};