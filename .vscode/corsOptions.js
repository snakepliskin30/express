const whitelist = ['http://127.0.0.1/5500', 'http://127.0.0.1/3000'];

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionSuccessStatus: 200,
};

export default corsOptions;
