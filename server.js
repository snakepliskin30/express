import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(__dirname);

const PORT = process.env.PORT || 3500;

const app = express();

app.get('^/$|/index(.html)?', (req, res) => {
  //   res.sendFile('./views/index.html', { root: __dirname });
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/new-page(.html)?', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
});

app.get('/old-page(.html)?', (req, res) => {
  res.redirect(301, '/new-page.html');
});

const one = (req, res, next) => {
  console.log('one');
  next();
};

const two = (req, res, next) => {
  console.log('two');
  next();
};

const three = (req, res, next) => {
  console.log('three');
  res.send('finished');
};

// Route Handlers --> sample 1 --> comma separated
app.get(
  '/hello(.html)?',
  (req, res, next) => {
    console.log('attempted to load hello.html');
    next();
  },
  (req, res) => {
    res.send('hello world');
  },
);

// Route Handlers --> array
app.get('/chain(.html)?', [one, two, three]);

// custom 404 does not set header to 404 automatically
app.get('/*', (req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
