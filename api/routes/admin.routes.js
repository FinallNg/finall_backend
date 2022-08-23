const router = require('express').Router();
const {getAllAdmins, createAdmin, loginAdmin, token_refresh, updatePassword, getAdmin, updateAdmin, deleteAdmin, logOut} = require('../controller/admin.controller')
const {authorizeAdmin} = require('../middlewares/authorize');
router.get('/', authorizeAdmin, getAllAdmins)
router.post('/auth/register', createAdmin)
router.post('/auth/login', loginAdmin)
router.get('auth/refresh',authorizeAdmin, token_refresh)
router.get('auth/logout', logOut)
router.put('/:id/passwordUpdate',authorizeAdmin, updatePassword)
router.get('/:id',authorizeAdmin, getAdmin)
router.put('/:id',authorizeAdmin, updateAdmin)
router.delete('/:id',authorizeAdmin, deleteAdmin)



module.exports = router;