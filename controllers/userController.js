const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const {email, password, name, lastname} = req.body;

    if (!email || !password || !name || !lastname) {
      return res.status(400).json({ message: 'Email, password, name and last name are required' });
    }

    const userD = await User.findOne({ where: { email: email } });
    if (userD) return res.status(400).json({ message: 'Email already registered.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: email,
      password: hashedPassword,
      name: name,
      lastname: lastname
    });
    res.status(201).json("User registered successfully");
  }
   catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ where: { email: email } });
    if (!user) return res.status(400).json({ message: 'Invalid credentials.' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ message: 'Invalid credentials.' });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
  res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//TODO: testear esto
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    console.log('Email is required');
    res.status(400);
    throw new Error('Email is required');
  }

  try {
    const user = await User.findOne({ email }).orFail();
    const token = jwt.sign(
      { password: user.password },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    // const link = `${process.env.CLIENT_URL}/reset-password/${user._id}/${token}`;

    // await mail.send(passwordResetTemplate(user.toObject(), link));
    // res.status(200).json('Password reset details sent to your email');
  } catch (err) {
    console.log(err);
    throw err;
  }
};

//TODO: testear esto

exports.resetPassword = async (req, res) => {
  const { password } = req.body;
  if (!password) {
    console.log('Password is required');
    res.status(400);
    throw new Error('Password is required');
  }

  const { userId, token } = req.params;
  try {
    const user = await User.findById(userId).orFail();
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
    if (decoded.password !== user.password) {
      console.log('Invalid token');
      res.status(400);
      throw new Error('Invalid token');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findOneAndUpdate(
      { _id: userId },
      {
        password: hashedPassword,
      }
    ).orFail();
    // await mail.send(passwordResetConfirmationTemplate(user.toObject()));
    // res.status(201).json('Password reset successful');
  } catch (err) {
    console.log(err);
    throw err;
  }
};