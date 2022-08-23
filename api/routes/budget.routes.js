const router = require('express').Router();
const { authorizeUser } = require('../middlewares/authorize');
const {createBudget, getBudgets, getBudget, editBudget, deleteBudget, deleteAllBudgets} = require("../controller/budget.controller");

router.post('/:id/budgets',authorizeUser, createBudget);
router.get('/:id/budgets',authorizeUser, getBudgets);
router.delete('/:id/budgets',authorizeUser, deleteAllBudgets);
router.get('/:id/budgets/:bu_id',authorizeUser, getBudget);
router.put('/:id/budgets/:bu_id',authorizeUser, editBudget);
router.delete('/:id/budgets/:bu_id',authorizeUser, deleteBudget);

module.exports = router