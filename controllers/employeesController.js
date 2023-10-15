import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const employees = require('../model/employees.json');
const data = {
  employees,
  setEmployees: function (data) {
    this.employees = data;
  },
};

export const getAllEmployees = (req, res) => {
  res.json(data.employees);
};

export const addEmployee = (req, res) => {
  const newEmployee = {
    id: data.employees[data.employees.length - 1].id + 1 || 1,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  };

  if (!req.body.firstName || !req.body.lastName) {
    res.status(400).json({ message: 'First and last names are required.' });
  }

  data.setEmployees([...data.employees, newEmployee]);
  res.status(201).json(data.employees);
};

export const updateEmployee = (req, res) => {
  const employee = data.employees.find((emp) => emp.id === parseInt(req.body.id));
  if (!employee) {
    res.status(400).json({ message: `Employee ID ${req.body.id} not found` });
  }
  if (req.body.firstName) employee.firstName = req.body.firstName;
  if (req.body.lastName) employee.lastName = req.body.lastName;
  const filterEmployees = data.employees.filter((emp) => emp.id !== parseInt(req.body.id));
  const unsortedEmployees = [...filterEmployees, employee];
  const sortedEmployees = unsortedEmployees.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
  data.setEmployees([...sortedEmployees]);
  res.json(data.employees);
};

export const deleteEmployee = (req, res) => {
  const employee = data.employees.find((emp) => emp.id === parseInt(req.body.id));
  if (!employee) {
    res.status(400).json({ message: `Employee ID ${req.body.id} not found` });
  }
  const filterEmployees = data.employees.filter((emp) => emp.id !== parseInt(req.body.id));
  const sortedEmployees = filterEmployees.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
  data.setEmployees([...sortedEmployees]);
  res.json(data.employees);
};

export const getEmployeeById = (req, res) => {
  const employee = data.employees.find((emp) => emp.id === parseInt(req.params.id));
  if (!employee) {
    res.status(400).json({ message: `Employee ID ${req.params.id} not found` });
  }
  res.json(employee);
};
