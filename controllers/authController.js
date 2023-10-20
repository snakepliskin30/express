import User from '../model/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) return res.status(400).json({ message: 'Username and password are required.' });

  // Search for the user
  // const userFound = usersDB.users.find((person) => person.username === user);
  const userFound = await User.findOne({ username: user }).exec();
  if (!userFound) return res.sendStatus(401); // unauthorized
  // macth password
  const match = await bcrypt.compare(pwd, userFound.pwd);
  if (match) {
    const roles = Object.values(userFound.roles);
    // create JWT
    const accessToken = jwt.sign({ UserInfo: { username: userFound.username, roles: roles } }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
    const refreshToken = jwt.sign({ username: userFound.username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

    await userFound.updateOne({ refreshToken });

    res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    res.json({ accessToken });
  } else {
    res.sendStatus(401);
  }
};
