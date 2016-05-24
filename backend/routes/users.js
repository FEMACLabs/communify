'use strict';

var express = require('express');
var router = express.Router();

// CHANGE THIS
var secret = 'temporarySecret';

// ADDING HEADER FOR CORS - TRY REMOVING
router.use(function(req,res,next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


// WATERLINE ROUTES

// GET ALL USERS
router.get('/', function(req, res) {
  req.models.user.find().populate('events').exec(function(err, users) {
    if(err) return res.json({ err: err }, 500);
    res.json(users);
  });
});

// CREATE NEW USER - MAY NOT BE USING - POSSIBLY DELETE
router.post('/', function(req, res) {
  req.models.user.create(req.body, function(err, user) {
    if(err) return res.json({ err: err }, 500);
    res.json(user);
  });
});

// GET USER PROFILE INFO
router.get('/:id', function(req, res) {
  req.models.user.findOne({ id: req.params.id }).populate('events').exec(function(err, user) {
    if(err) return res.json({ err: err }, 500);
    delete user.password;
    res.json(user);
  });
});

// DELETE USER
router.delete('/:id', function(req, res) {
  req.models.user.destroy({ id: req.params.id }, function(err) {
    if(err) return res.json({ err: err }, 500);
    res.json({ status: 'ok' });
  });
});

// UPDATE USER PROFILE INFO
router.put('/:id', function(req, res) {
  // delete req.body.id;
  req.models.user.update({ id: req.params.id }, req.body, function(err, user) {
    if(err) return res.json({ err: err }, 500);
    res.json(user);
  });
});

// USER ADD RSVP TO EVENT
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

// USER REMOVE RSVP FROM EVENT
router.delete('/:user_id/events/:event_id', function(req, res) {
  req.models.user.findOne({ id: req.params.user_id }, function(err, user) {
    if(err) return res.status(500).json({ err: err });
    console.log(req.params);
    user.events.remove(req.params.event_id);
    user.save(function(err) {
      if(err) return res.status(500).json({ err: err });
      res.json(user);
    });
  });
});


module.exports = router;
