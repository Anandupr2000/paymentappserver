var express = require('express');
const userHelpers = require("../helpers/user-helpers");
// const { response } = require('../app');
const paymentHelpers = require('../helpers/payment-helpers');
var router = express.Router();

router.post('/', (req, res) => {
    let { payorPhn, payeePhn, amount } = req.body
    console.log({ payorPhn, payeePhn, amount })
    paymentHelpers.doPayment(payorPhn, payeePhn, parseInt(amount))
        .then(response => {
            if (response.success)
                res.json(response)
            else
                res.json({ success: false })
        })
        .catch(err => {
            res.json({ success: false, err: err })
        })
})

router.post('/getAllTransactions', (req, res) => {
    console.log(req.body)
    const { phn } = req.body
    paymentHelpers.getTransactions(phn).then(
        response =>
            res.json(response)
    )
})

module.exports = router