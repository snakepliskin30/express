import User from '../model/User.js';
import jwt from 'jsonwebtoken';

export const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    res.sendStatus(401);
  } else {
    const token = cookies.jwt;
    console.log('token', token);
    const userFound = await User.findOne({ refreshToken: token });
    if (!userFound) res.sendStatus(403);

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      console.log('decoded', decoded);
      if (err || decoded.username !== userFound.username) res.sendStatus(403);
      const refreshedAccessToken = jwt.sign({ UserInfo: { username: decoded.username, roles: decoded.roles } }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '30m',
      });
      res.json({ accessToken: refreshedAccessToken });
    });
  }
};
