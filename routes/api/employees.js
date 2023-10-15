import express from 'express';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
const require = createRequire(import.meta.url);
const employeeData = require('../../data/employees.json');
// import employeeData from '../../data/employees.json' assert { type: 'json' };
const data = {};
data.employees = employeeData;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

router
  .route('/')
  .get((req, res) => {
    res.json(data.employees);
  })
  .post((req, res) => {
    console.log('TESTSTEST');
    res.json({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });
  })
  .put((req, res) => {
    res.json({
      firsName: req.body.firstName,
    });
  })
  .delete((req, res) => {
    res.json({
      id: req.body.id,
    });
  });

router.route('/:id').get((req, res) => {
  res.json({
    id: req.params.id,
  });
});

export default router;
