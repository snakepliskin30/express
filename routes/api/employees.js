import express from 'express';
import { getAllEmployees, addEmployee, updateEmployee, deleteEmployee, getEmployeeById } from '../../controllers/employeesController.js';
const router = express.Router();

import ROLES_LIST from '../../config/roles_list.js';
import verifyRoles from '../../middleware/verifyRoles.js';

router
  .route('/')
  .get(getAllEmployees)
  .post(verifyRoles(ROLES_LIST.User), addEmployee)
  .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), updateEmployee)
  .delete(verifyRoles(ROLES_LIST.Admin), deleteEmployee);

router.route('/:id').get(getEmployeeById);

export default router;
