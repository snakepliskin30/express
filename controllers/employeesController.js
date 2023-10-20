import Employee from '../model/Employee.js';

export const getAllEmployees = async (req, res) => {
  const employees = await Employee.find();
  if (!employees) res.status(204).json({ message: 'No employees found.' });
  res.json(employees);
};

export const addEmployee = async (req, res) => {
  if (!req.body.firstname || !req.body.lastname) {
    res.status(400).json({ message: 'First and last names are required.' });
  }

  const newEmployee = await Employee.create({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  });

  if (newEmployee) {
    res.status(201).json({ message: `Employee ${req.body.firstname} ${req.body.lastname} was created.` });
  } else res.status(400).json({ message: `Something went wrong creating the new employees.` });
};

export const updateEmployee = async (req, res) => {
  const employee = await Employee.findById(req.body.id);
  if (!employee) {
    res.status(400).json({ message: `Employee ID ${req.body.id} not found` });
  }
  console.log(employee);
  if (req.body.firstname) employee.firstname = req.body.firstname;
  if (req.body.lastname) employee.lastname = req.body.lastname;
  if (result) res.json({ message: `Employee with id ${req.body.id} was updated.` });
  else res.status(400).json({ message: `Something went wrong updating employee with id ${req.body.id}.` });
};

export const deleteEmployee = async (req, res) => {
  const employee = await Employee.findById(req.body.id);
  if (!employee) {
    res.status(400).json({ message: `Employee ID ${req.body.id} not found` });
  }

  const result = await Employee.findByIdAndDelete(req.body.id);
  if (result) res.json({ message: `Employee with id ${req.body.id} was deleted.` });
  else res.status(400).json({ message: `Something went wrong deleting employee with id ${req.body.id}.` });
};

export const getEmployeeById = async (req, res) => {
  const employee = await Employee.findById(req.body.id);
  if (!employee) {
    res.status(400).json({ message: `Employee ID ${req.params.id} not found` });
  }
  res.json(employee);
};
