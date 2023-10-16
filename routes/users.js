var express = require('express');
const userHelpers = require("../helpers/user-helpers");
const { response } = require('../app');
var router = express.Router();

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
  userHelpers.findUser(req.body.keyword)
    .then(response => {
      console.log(response);
      res.json(response)
    })
    .catch(err => {
      console.log(err);
      res.json(response)
    })
})
module.exports = router;
