const router = require('express').Router();
const {getAllAdmins, createAdmin, loginAdmin, token_refresh, updatePassword, getAdmin, updateAdmin, deleteAdmin} = require('../controller/admin.controller')

router.get('/', getAllAdmins)
router.post('/auth/register', createAdmin)
router.post('/auth/login', loginAdmin)
router.get('auth/refresh', token_refresh)
router.put('/:id/passwordUpdate', updatePassword)
router.get('/:id', getAdmin)
router.put('/:id', updateAdmin)
router.delete('/:id', deleteAdmin)

module.exports = router;