const express = require('express');
const router = express.Router();

const resetpassController = require('../controllers/resetpass_controller');

router.get('/', resetpassController.home);
router.post('/email',resetpassController.passmail);
router.get('/:token', resetpassController.resetForm);
router.post('/submit',resetpassController.submit);

module.exports = router;