const supabase = require("../config/supabase");
const User = require("../models/user");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token with Supabase
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Fetch user from MongoDB
    let user = await User.findOne({ supabase_id: data.user.id });

    // Auto-create user if missing (handles edge cases)
    if (!user) {
      user = await User.create({
        supabase_id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || 'User',
        role: data.user.user_metadata?.role || 'student'
      });
    }

    req.user = user; // MongoDB user with role
    req.supabaseUser = data.user; // Supabase user data
    next();

  } catch (err) {
    console.error("Auth error:", err);
    res.status(500).json({ error: "Authentication failed" });
  }
};

module.exports = authMiddleware;