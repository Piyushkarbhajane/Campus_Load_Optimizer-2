// controllers/authController.js
const supabase = require('../config/supabase');
const User = require('../models/user');

exports.signup = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ 
        error: 'Email, password, and name are required' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters' 
      });
    }

    // Create user in Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: role || 'student'
        },
        emailRedirectTo: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/callback`
      }
    });

    if (authError) {
      console.error('Supabase signup error:', authError);
      return res.status(400).json({ 
        error: authError.message 
      });
    }

    if (!authData.user) {
      return res.status(400).json({ 
        error: 'Failed to create user' 
      });
    }

    // ✅ ALWAYS create user in MongoDB regardless of email confirmation
    // Check if user already exists (in case of retry)
    let user = await User.findOne({ supabase_id: authData.user.id });
    
    if (!user) {
      user = await User.create({
        supabase_id: authData.user.id,
        email: authData.user.email,
        name,
        role: role || 'student'
      });
      console.log('✅ User created in MongoDB:', user._id);
    } else {
      console.log('✅ User already exists in MongoDB:', user._id);
    }
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        supabase_id: user.supabase_id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

  } catch (err) {
    console.error('Signup error:', err);
    
    if (err.code === 11000) {
      return res.status(400).json({ 
        error: 'Email already registered in database' 
      });
    }
    
    res.status(500).json({ 
      error: 'Registration failed',
      details: err.message 
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    // Authenticate with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      console.error('Login error:', authError);
      
      // Check if email not confirmed
      if (authError.message.includes('Email not confirmed') || 
          authError.message.includes('email_not_confirmed')) {
        return res.status(401).json({ 
          error: 'Please confirm your email before logging in. Check your inbox for the verification link.',
          email_not_confirmed: true
        });
      }
      
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }

    if (!authData.session || !authData.user) {
      return res.status(401).json({ 
        error: 'Login failed - unable to create session' 
      });
    }

    // Get user from MongoDB
    let user = await User.findOne({ supabase_id: authData.user.id });

    // If user doesn't exist in MongoDB (edge case - should not happen with new signup flow)
    if (!user) {
      console.log('⚠️ User exists in Supabase but not in MongoDB, creating...');
      user = await User.create({
        supabase_id: authData.user.id,
        email: authData.user.email,
        name: authData.user.user_metadata?.name || 'User',
        role: authData.user.user_metadata?.role || 'student'
      });
    }

    res.json({
      message: 'Login successful',
      token: authData.session.access_token,
      refresh_token: authData.session.refresh_token,
      user: {
        id: user._id,
        supabase_id: user.supabase_id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      error: 'Login failed',
      details: err.message 
    });
  }
};

exports.logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      await supabase.auth.signOut(token);
    }

    res.json({ message: 'Logout successful' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ error: 'Logout failed' });
  }
};


exports.getCurrentUser = async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        supabase_id: req.user.supabase_id,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        created_at: req.user.created_at
      }
    });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ error: 'Failed to get user' });
  }
};

