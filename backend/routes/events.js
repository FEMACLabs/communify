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

// GET ALL EVENTS
router.get('/', function(req, res) {
  req.models.event.find().populate('owners').exec(function(err, events) {
    for (var i = 0; i < events.length; i++) {
      if (req.user.id.toString() === events[i].owner_id) {
        events[i].is_owner = true;
      }
      for (var j = 0; j < events[i].owners.length; j++) {
        var id = events[i].owners[j].id;
        if (req.user.id === id) {
          events[i].rsvp = true;
        }
      }
    }
    if(err) return res.json({ err: err }, 500);
    res.json(events);
  });
});

// CREATE NEW EVENT
router.post('/', function(req, res) {
  console.log(req.body);
  req.models.event.create(req.body, function(err, event) {
    console.log(req.user);
    if(err) return res.json({ err: err }, 500);
    res.json(event);
  });
});

// GET SPECIFIC EVENT
router.get('/:id', function(req, res) {
  req.models.event.findOne({ id: req.params.id }, function(err, event) {
    if(err) return res.json({ err: err }, 500);
    res.json(event);
  });
});

// DELETE SPECIFIC EVENT
router.delete('/:id', function(req, res) {
  req.models.event.destroy({ id: req.params.id }, function(err) {
    if(err) return res.json({ err: err }, 500);
    res.json({ status: 'ok' });
  });
});

// UPDATE SPECIFIC EVENT
router.put('/:id', function(req, res) {
  delete req.body.id;
  req.models.event.update({ id: req.params.id }, req.body, function(err, event) {
    if(err) return res.json({ err: err }, 500);
    res.json(event);
  });
});

module.exports = router;
