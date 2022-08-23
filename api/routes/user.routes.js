const router = require('express').Router();
const {getAllUsers, createUser, loginUser, token_refresh, updatePassword, getUser, updateUser, deleteUser, logOut} = require('../controller/user.controller')
const {authorizeAdmin, authorizeUser} = require("../middlewares/authorize");
router.get('/',authorizeAdmin, getAllUsers)
router.post('/register', createUser)
router.post('/login', loginUser)
router.get('/logout',logOut)
router.get('/refresh',authorizeUser, token_refresh)
router.put('/:id/passwordUpdate',authorizeUser, updatePassword)
router.get('/:id',authorizeUser, getUser)
router.put('/:id',authorizeUser, updateUser)
router.delete('/:id',authorizeUser, deleteUser)

module.exports = router;