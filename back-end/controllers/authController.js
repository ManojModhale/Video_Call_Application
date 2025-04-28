const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
  const { firstName, lastName, gender, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email is already taken' });
    }

    const newUser = new User({
      firstName,
      lastName,
      gender,
      email,
      password, // it will be hashed in the model
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: savedUser._id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        gender: savedUser.gender,
        email: savedUser.email
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Failed to register user', error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Use bcrypt.compare to compare the provided password with the hashed password from the database
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Authentication successful
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      // token: 'your_generated_jwt_token_here', // Consider adding JWT later
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};