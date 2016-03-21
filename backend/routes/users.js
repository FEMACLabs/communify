'use strict';

var express = require('express');
var router = express.Router();

var secret = 'temporarySecret';

// function checkErr(res, err){
//   var fail = false;
//   if(err){
//     fail = true;
//     res.send(err);
//   }
//   return fail;
// }

router.get('/', function(req, res) {
  req.models.user.find().populate('events').exec(function(err, users) {
    if(err) return res.json({ err: err }, 500);
    res.json(users);
  });
});

router.post('/', function(req, res) {
  req.models.user.create(req.body, function(err, user) {
    if(err) return res.json({ err: err }, 500);
    res.json(user);
  });
});

router.get('/:id', function(req, res) {
  req.models.user.findOne({ id: req.params.id }).populate('events').exec(function(err, user) {
    if(err) return res.json({ err: err }, 500);
    delete user.password;
    res.json(user);
  });
});

router.delete('/:id', function(req, res) {
  req.models.user.destroy({ id: req.params.id }, function(err) {
    if(err) return res.json({ err: err }, 500);
    res.json({ status: 'ok' });
  });
});

router.put('/:id', function(req, res) {
  // Don't pass ID to update
  // delete req.body.id;
  req.models.user.update({ id: req.params.id }, req.body, function(err, user) {
    if(err) return res.json({ err: err }, 500);
    res.json(user);
  });
});

// this route allows you to create events for a specific user
router.post('/:id/events', function(req, res) {
  req.models.user.findOne({ id: req.params.id }, function(err, user) {
    if(err) return res.json({ err: err }, 500);
    console.log(req.body);
    user.events.add(req.body);
    user.save(function(err) {
      if(err) return res.json({ err: err }, 500);
      res.json(user);
    });
  });
});

module.exports = router;
