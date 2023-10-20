import path from 'path';
import { fileURLToPath } from 'url';
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

export const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  console.log(cookies);
  if (!cookies?.jwt) res.sendStatus(204);

  const token = cookies.jwt;
  console.log('token', token);
  const userFound = usersDB.users.find((person) => person.refreshToken === token);
  if (!userFound) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.sendStatus(204);
  }

  const filteredUsers = usersDB.users.filter((person) => person?.refreshToken !== token);
  const userFoundUpdated = { ...userFound, refreshToken: '' };
  usersDB.setUsers([...filteredUsers, userFoundUpdated]);

  // Update file
  console.log('usersDB.users', usersDB.users);
  await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(usersDB.users));

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  res.sendStatus(204);
};
