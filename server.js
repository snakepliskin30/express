import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import cors from 'cors';
import logger from './middleware/logEvents.js';
import errorHandler from './middleware/errorHandler.js';
import corsOptions from './.vscode/corsOptions.js';

// Routes
import subdirRoute from './routes/subdir.js';
import rootRoute from './routes/root.js';
import employeeApiRoute from './routes/api/employees.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(__dirname);

const PORT = process.env.PORT || 3500;
const app = express();

// custom middleware logger
app.use(logger);

// cors = cross origin resource sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded data
// in other words, form data:
// content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// serve static files
app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/subdir', express.static(path.join(__dirname, '/public')));

// routes
app.use('/', rootRoute);
app.use('/subdir', subdirRoute);
app.use('/employees', employeeApiRoute);

app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ error: '404 Not Found' });
  } else {
    res.type('txt').send('404 Not Found');
  }
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
