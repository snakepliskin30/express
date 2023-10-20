import User from '../model/User.js';

export const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  console.log(cookies);
  if (!cookies?.jwt) res.sendStatus(204);

  const token = cookies.jwt;
  console.log('token', token);

  const userFound = await User.findOne({ refreshToken: token });
  if (!userFound) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.sendStatus(204);
  }

  await userFound.updateOne({ refreshToken: '' });

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  res.sendStatus(204);
};
