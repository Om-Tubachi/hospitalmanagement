const User = require('../models/User');
const { generateToken } = require('../lib/auth');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    console.log("Trying to find user with email:", email.toLowerCase());
    console.log("User result:", user);
    console.log('Incoming email:', email);
    console.log('Email used in query:', email.toLowerCase());

    if (!user) {
      console.log("User not existing");
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({
        error: 'Account is deactivated'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid email or password heheheheheh'
      });
    }

    // Update last login
    user.last_login = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken(user);

    // Return user data (without password)
    const userData = {
      id: user._id,
      email: user.email,
      role: user.role,
      profile: user.profile,
      is_active: user.is_active,
      last_login: user.last_login,
      created_at: user.created_at,
    };

    res.json({
      user: userData,
      token,
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

const register = async (req, res) => {
  try {
    const { email, password, role, profile } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        error: 'User with this email already exists'
      });
    }

    // Create new user
    const user = new User({
      email: email.toLowerCase(),
      password,
      role,
      profile
    });

    await user.save();

    // Generate token
    const token = generateToken(user);

    // Return user data
    const userData = {
      id: user._id,
      email: user.email,
      role: user.role,
      profile: user.profile,
      is_active: user.is_active,
      created_at: user.created_at,
    };

    res.status(201).json({
      user: userData,
      token,
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

module.exports = {
  login,
  register
};