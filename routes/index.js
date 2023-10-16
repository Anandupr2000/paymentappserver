var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post("/test", (req, res) => {
  res.json({ "success": true })
})
module.exports = router;
