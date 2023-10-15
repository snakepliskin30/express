import express from 'express';
import { getAllEmployees, addEmployee, updateEmployee, deleteEmployee, getEmployeeById } from '../../controllers/employeesController.js';
const router = express.Router();

router.route('/').get(getAllEmployees).post(addEmployee).put(updateEmployee).delete(deleteEmployee);

router.route('/:id').get(getEmployeeById);

export default router;
