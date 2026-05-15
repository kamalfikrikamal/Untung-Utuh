const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ status: 'error', message: 'Email already in use' });
    }

    const user = await User.create({ name, email, password });
    const token = signToken(user._id);

    res.status(201).json({ status: 'success', token, data: { user } });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ status: 'error', message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ status: 'error', message: 'Account is deactivated' });
    }

    const token = signToken(user._id);
    res.json({ status: 'success', token, data: { user } });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res) => {
  res.json({ status: 'success', data: { user: req.user } });
};

module.exports = { register, login, getMe };
