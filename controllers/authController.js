import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fsPromises from 'fs/promises';
import { createRequire } from 'module';

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
    const roles = Object.values(userFound.roles);
    // create JWT
    const accessToken = jwt.sign({ UserInfo: { username: userFound.username, roles: roles } }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
    const refreshToken = jwt.sign({ username: userFound.username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

    const filterUsers = usersDB.users.filter((person) => person.username !== userFound.username);
    const loggedInUser = { ...userFound, refreshToken };
    const updatedUsers = [...filterUsers, loggedInUser];
    usersDB.setUsers(updatedUsers);
    await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(usersDB.users));
    // Dave says the code below will fix browser error but this causes error when logging out via REST Client extension
    // res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
    res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    res.json({ accessToken });
  } else {
    res.sendStatus(401);
  }
};
