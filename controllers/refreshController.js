import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { createRequire } from 'module';

config();

const require = createRequire(import.meta.url);
const usersDB = {
  users: require('../model/users.json'),
  setUsers: function (data) {
    this.users = data;
  },
};

export const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    res.sendStatus(401);
  } else {
    const token = cookies.jwt;
    console.log('token', token);
    const userFound = usersDB.users.find((person) => person.refreshToken === token);
    if (!userFound) res.sendStatus(403);

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err || decoded.username !== userFound.username) res.sendStatus(403);
      const refreshedAccessToken = jwt.sign({ username: decoded.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' });
      res.json({ accessToken: refreshedAccessToken });
    });
  }
};
