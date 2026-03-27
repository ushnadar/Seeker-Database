const sql = require("../db");
const bcrypt = require("bcrypt");

const passwordRules = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecial: true,
};

const validatePassword = (password) => {
  const errors = [];

  if (password.length < passwordRules.minLength)
    errors.push(`At least ${passwordRules.minLength} characters long`);

  if (passwordRules.requireUppercase && !/[A-Z]/.test(password))
    errors.push("At least one uppercase letter (A-Z)");

  if (passwordRules.requireLowercase && !/[a-z]/.test(password))
    errors.push("At least one lowercase letter (a-z)");

  if (passwordRules.requireNumber && !/[0-9]/.test(password))
    errors.push("At least one number (0-9)");

  if (passwordRules.requireSpecial && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
    errors.push("At least one special character (!@#$%^&*...)");

  return errors;
};

// SIGNUP
exports.signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const allowedRoles = ["user", "admin"];
  const assignedRole = allowedRoles.includes(role) ? role : "user";

  const passwordErrors = validatePassword(password);
  if (passwordErrors.length > 0) {
    return res.status(400).json({
      message: "Weak password. Please follow the rules:",
      errors: passwordErrors,
    });
  }

  try {
    const checkUser = await sql.query`
      SELECT * FROM users WHERE email = ${email} AND role = ${assignedRole}
    `;

    if (checkUser.recordset.length > 0) {
      return res.status(400).json({ message: "Email already registered for this role" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await sql.query`
      INSERT INTO users (name, email, password, role)
      VALUES (${name}, ${email}, ${hashedPassword}, ${assignedRole})
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
        role: user.role,
      },
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};