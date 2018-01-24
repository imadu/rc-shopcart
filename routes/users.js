const express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

/* GET user profile. */
router.get('/profile', function(req, res) {
    res.send(req.user);
});

module.exports = router;