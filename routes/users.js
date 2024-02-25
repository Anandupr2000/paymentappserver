var express = require('express');
const userHelpers = require("../helpers/user-helpers");
const { response } = require('../app');
var router = express.Router();
const fast2sms = require('fast-two-sms')

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
router.post('/register', (req, res) => {
  console.log(req.body)
  userHelpers.doSignup(req.body)
    .then(response => {
      res.json({ success: true })
    })
    .catch(err => {
      console.log(err);
      res.json({ success: false, err: err.error })
    })
})
router.post('/login', (req, res) => {
  console.log(req.body)
  userHelpers.doLogin(req.body)
    .then(response => {
      console.log(response);
      res.json(response)
    })
    .catch(err => {
      console.log(err);
      res.json({ success: false, err: err.error })
    })
})
router.post('/search', (req, res) => {
  console.log(req.body);
  userHelpers.findUser(req.body.keyword, req.body.currentUserPhn)
    .then(response => {
      console.log(response);
      res.json(response)
    })
    .catch(err => {
      console.log(err);
      res.json(response)
    })
})
router.post('/fetch', (req, res) => {
  console.log(req.body);
  userHelpers.fetchUser(req.body.phn)
    .then(response => {
      console.log(response);
      res.json(response)
    })
    .catch(err => {
      console.log(err);
      res.json(response)
    })
})

router.put('/update', async (req, res) => {
  // const phn = req.body.id
  const { id, data } = req.body
  // const { id, data } = req.body
  // let phn = id
  if (!id || !data) {
    console.log("invalid format");
    res.json({ success: false, msg: "Invalid format" })
  }
  // else {
    console.log(req.body);
  // }
  res.json(await userHelpers.updateUser(id, data))
})

router.post('/sendOTP', async (req, res) => {
  let { type, value } = req.body
  // console.log(type, value);
  res.json(await userHelpers.sendOtp(type, value))
  // res.json(req.body)
})

router.post('/verifyOTP', async (req, res) => {
  console.log(req.params);
  console.log(req.body);
  // console.log(otpStore.otp);

  // res.json({ "verification": req.body.otp == otpStore.otp })
  let { otp, value } = req.body // value may be email or phn
  res.json(await userHelpers.verifyOTP(otp, value).catch(err => err))
})
router.post('/transactions', async (req, res) => {
  console.log(req.body);
  let phn = req.body.phn
  res.json(await userHelpers.getTransactions(phn))
})
module.exports = router;
