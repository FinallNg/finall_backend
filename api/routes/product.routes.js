const router = require('express').Router();
const { authorizeUser } = require('../middlewares/authorize');
const {bankConnect, getTotalBalance, getTransactions, getTransaction, getBalance, getAccounts, getAccount} = require('../controller/product.controller');

// router.use(authorizeUser)
router.post('/:id/connect', bankConnect)
router.get('/:id/accounts', getAccounts)
router.get('/:id/accounts/totalbalance', getTotalBalance)
router.get('/:id/accounts/:acc_id', getAccount)
router.get('/:id/accounts/:acc_id/transactions', getTransactions)
router.get('/:id/accounts/:acc_id/transactions/:trans_id', getTransaction)
router.get('/:id/accounts/:acc_id/balance', getBalance)

module.exports = router