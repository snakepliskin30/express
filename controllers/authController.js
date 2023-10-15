import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import fsPromises from 'fs/promises';
import { createRequire } from 'module';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const require = createRequire(import.meta.url);
const usersDB = {
  users: require('../model/users.json'),
  setUsers: function (data) {
    this.users = data;
  },
};

export const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) return res.status(400).json({ message: 'Username and password are required.' });

  // Search for the user
  const userFound = usersDB.users.find((person) => person.username === user);
  if (!userFound) return res.sendStatus(401); // unauthorized
  // macth password
  const match = await bcrypt.compare(pwd, userFound.password);
  if (match) {
    // create JWT
    const accessToken = jwt.sign({ username: userFound.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' });
    const refreshToken = jwt.sign({ username: userFound.username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

    const filterUsers = usersDB.users.filter((person) => person.username !== userFound.username);
    const loggedInUser = { ...userFound, refreshToken };
    const updatedUsers = [...filterUsers, loggedInUser];
    usersDB.setUsers(updatedUsers);
    await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(usersDB.users));
    res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    res.json({ accessToken });
  } else {
    res.sendStatus(401);
  }
};
