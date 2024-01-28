var express = require('express');
const { getAllUsers } = require('../helpers/user-helpers');
var router = express.Router();

const dotenv = require('dotenv');
dotenv.config();

/* GET home page. */
router.get('/', function (req, res, next) {
  // res.render('index', { title: 'Express' });
  res.json({ 'index': { title: 'Express' } });
});
router.get("/test", async (req, res) => {
  res.json({ "users": await getAllUsers() })
})
module.exports = router;
