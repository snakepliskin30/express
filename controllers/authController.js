import bcrypt from 'bcrypt';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const usersDB = {
  users: require('../model/users.json'),
  setUsers: function (data) {
    this.users = data;
  },
};

export const handleLogin = async (req, res) => {
  console.log('test', usersDB);
  const { user, pwd } = req.body;
  console.log('username, password', user, pwd);
  if (!user || !pwd) return res.status(400).json({ message: 'Username and password are required.' });

  // Search for the user
  const userFound = usersDB.users.find((person) => person.username === user);
  console.log('userFound', userFound);
  if (!userFound) return res.sendStatus(401); // unauthorized
  console.log('userFound', userFound);
  // macth password
  const match = await bcrypt.compare(pwd, userFound.password);
  console.log('match', match);
  if (match) {
    // create JWT
    res.json({ success: `Username ${user} is logged in!` });
  } else {
    res.sendStatus(401);
  }
};
