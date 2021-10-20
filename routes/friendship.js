const express = require('express');
const router = express.Router();
const passport = require('passport');

const friendshipController = require('../controllers/friendship_controller');

router.post('/newreq/:reqfor', friendshipController.newrequest);
router.post('/delreq/:reqfor', friendshipController.deletefre);


module.exports = router;