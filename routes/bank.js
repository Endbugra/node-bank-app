const router = require('express').Router();
const { getBalance, transfer } = require('../controllers/bankController');
const auth = require('../middleware/authMiddleware');

router.get('/balance', auth, getBalance);
router.post('/transfer', auth, transfer);

module.exports = router;