const router = require('express').Router();
const {getAllUsers, createUser, loginUser, token_refresh, updatePassword, getUser, updateUser, deleteUser} = require('../controller/user.controller')

router.get('/', getAllUsers)
router.post('/register', createUser)
router.post('/login', loginUser)
router.get('/refresh', token_refresh)
router.put('/:id/passwordUpdate', updatePassword)
router.get('/:id', getUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

module.exports = router;