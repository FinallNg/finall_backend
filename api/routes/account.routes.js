const router = require('express').Router();
const { authorizeUser } = require('../middlewares/authorize');
const {bankConnect, getTotalBalance, getTransactions, getTransaction, getBalance, getAccounts, getAccount, getStatement,
getCredits, getDebits} = require('../controller/account.controller');

// router.use(authorizeUser)
router.post('/:id/connect', bankConnect)
router.get('/:id/accounts', getAccounts)
router.get('/:id/accounts/totalbalance', getTotalBalance)
router.get('/:id/accounts/:acc_id', getAccount)
router.get('/:id/accounts/:acc_id/transactions', getTransactions)
router.get('/:id/accounts/:acc_id/transactions/:trans_id', getTransaction)
router.get('/:id/accounts/:acc_id/balance', getBalance)
router.get('/:id/accounts/:acc_id/statement', getStatement)
router.get('/:id/accounts/:acc_id/credits', getCredits)
router.get('/:id/accounts/:acc_id/debits', getDebits)

module.exports = router