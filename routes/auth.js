const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { check, validationResult } = require('express-validator');

// Post login
router.post('/login', function(req, res){
  // validation on the form
  req.checkBody('username', 'username cannot be empty').notEmpty();
  req.checkBody('password', 'password is required').notEmpty();

  // validate the errors
  var errors = req.validationErrors();

  if(errors){
    return res.status(403).json({ error: 'something went wrong'});
  } else {
      passport.authenticate('login', {session: false}, (err, user, info) => {
          if(err || !user){
            return res.status(403).json({
                message: info ? info.message : 'Login failed',
                user: user
            });
          }
          req.login(user, {session:false}, (err) => {
              if(err){
                  res.send(err);
              }
              // genrate a signed son web token with the contents of the user and return it in the reponse
              const token = jwt.sign(user.id, process.env.SECRET);
              return res.json({user: user.role, id: user._id, token});
              
          });
      })(req, res);
  }

});

router.post('/signup',function(req,res){

    req.checkBody('username', 'Invalid username').notEmpty();
    req.checkBody('email','invalid email').notEmpty().isEmail();
    req.checkBody('password','password must be alphanumeric').isLength({min: 5}).isAlphanumeric();
  
    //validate 
    var errors = req.validationErrors();
  
    if (errors) {
        return res.status(403).json({ error: 'something went wrong'});
  
    }
    else {
        passport.authenticate('signup',{
            successRedirect:'/auth/login',
            failureRedirect: '/auth/signup',
            failureFlash : true  
        })(req,res); // <---- ADDD THIS
    }
  });

module.exports = router;