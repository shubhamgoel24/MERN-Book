const express = require('express');
const router = express.Router();
const homecontroller = require('../controllers/home_controller');

console.log('Router loaded');

router.get('/', homecontroller.home);
router.use('/users', require('./users'));
router.use('/posts', require('./posts'));
router.use('/comments', require('./comments'));
router.use('/resetpass', require('./resetpass'))

router.use('/api', require('./api'));


module.exports= router;

