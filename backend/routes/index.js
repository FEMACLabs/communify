'use strict';

var express = require('express');
var router = express.Router();
var jsonWebToken = require('jsonwebtoken');
var bcrypt = require('bcrypt');

var secret = 'temporarySecret';

// function checkErr(res, err){
//   var fail = false;
//   if(err){
//     fail = true;
//     res.send(err);
//   }
//   return fail;
// }

router.post('/signup', function(req, res, next) {

  var user = req.body;
  hashPassword(user, registerUser);

  function registerUser(user){
    req.models.user.create(user, function(err, user) {
      if(err) return res.json({ err: err }, 500);
      var expires = {
        expiresIn: 1600
      };
      var token = jsonWebToken.sign(user, secret, expires);
        res.json({token : token, user : user});
    });
    var newUser = user;
    console.log(newUser);
  }

  function hashPassword(user, callback){
    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(user.password, salt, function(err, hash){
        user.password = hash;
        callback(user);
      });
    });
  }
});

router.post('/signin', function(req, res, next) {
  req.models.user.findOne({ email: req.body.email }).exec(function(err, user) {
    if (user === undefined) {
      res.send(err);
    } else {
      bcrypt.compare(req.body.password, user.password, function(err, match) {
        if (match) {
          console.log('authentication successful');
          var expires = {
            expiresIn: 1600
          };
          delete user.password;
          console.log(user);
          var token = jsonWebToken.sign(user, secret, expires);
          res.json({token : token, user : user});
        } else {
          console.log('authentication failed');
          res.send('authentication failed');
        }
      });
    }
  });
});

module.exports = router;
