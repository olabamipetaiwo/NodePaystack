var express = require('express');
var router = express.Router();
const PaymentController = require('../controllers/paymentController')
const { 
  get_homepage,
  paystack_page,
  paystack_callback,
  receipt,
  render_error} = PaymentController;


router.get('/', get_homepage );
router.post('/paystack/pay', paystack_page );
router.get('/paystack/callback',paystack_callback);
router.get('/receipt/:id', receipt);
router.get('/error',render_error );

module.exports = router;
