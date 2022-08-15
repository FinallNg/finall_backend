const router = require('express').Router();
const { authorizeUser } = require('../middlewares/authorize');
const {createBudget, getBudgets, getBudget, editBudget, deleteBudget} = require("../controller/budget.controller");
router.post('/:id/budgets', createBudget)
router.get('/:id/budgets', getBudgets)
router.get('/:id/budgets/:bu_id', getBudget)
router.put('/:id/budgets/:bu_id', editBudget)
router.delete('/:id/budgets/:bu_id', deleteBudget)

module.exports = router