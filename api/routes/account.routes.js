const router = require('express').Router();
const { authorizeUser } = require('../middlewares/authorize');
const {bankConnect, getTotalBalance, getTransactions, getTransaction, getBalance, getAccounts, getAccount, getStatement,
getCredits, getDebits} = require('../controller/account.controller');

// router.use(authorizeUser)
router.post('/:id/connect',authorizeUser, bankConnect)
router.get('/:id/accounts', authorizeUser, getAccounts)
router.get('/:id/accounts/totalbalance', authorizeUser, getTotalBalance)
router.get('/:id/accounts/:acc_id', authorizeUser, getAccount)
router.get('/:id/accounts/:acc_id/transactions', authorizeUser, getTransactions)
router.get('/:id/accounts/:acc_id/transactions/:trans_id',authorizeUser, getTransaction)
router.get('/:id/accounts/:acc_id/balance',authorizeUser, getBalance)
router.get('/:id/accounts/:acc_id/statement', authorizeUser, getStatement)
router.get('/:id/accounts/:acc_id/credits', authorizeUser, getCredits)
router.get('/:id/accounts/:acc_id/debits', authorizeUser, getDebits)

module.exports = router