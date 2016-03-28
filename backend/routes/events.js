'use strict';

var express = require('express');
var router = express.Router();

var secret = 'temporarySecret';


router.get('/', function(req, res) {
  req.models.event.find().populate('owners').exec(function(err, events) {
    for (var i = 0; i < events.length; i++) {
      console.log(events[i].owner_id);
      if (req.user.id.toString() === events[i].owner_id) {
        events[i].is_owner = true;
      }
      // console.log(events[i].owners);
      for (var j = 0; j < events[i].owners.length; j++) {
        var id = events[i].owners[j].id;
        if (req.user.id === id) {
          events[i].rsvp = true;
        }
      }
    }
    console.log(events);
    if(err) return res.json({ err: err }, 500);
    res.json(events);
  });
});

router.post('/', function(req, res) {
  console.log(req.body);
  req.models.event.create(req.body, function(err, event) {
    console.log(req.user);
    if(err) return res.json({ err: err }, 500);
    res.json(event);
  });
});

router.get('/:id', function(req, res) {
  req.models.event.findOne({ id: req.params.id }, function(err, event) {
    if(err) return res.json({ err: err }, 500);
    res.json(event);
  });
});

router.delete('/:id', function(req, res) {
  req.models.event.destroy({ id: req.params.id }, function(err) {
    if(err) return res.json({ err: err }, 500);
    res.json({ status: 'ok' });
  });
});

router.put('/:id', function(req, res) {
  // Don't pass ID to update
  delete req.body.id;

  req.models.event.update({ id: req.params.id }, req.body, function(err, event) {
    if(err) return res.json({ err: err }, 500);
    res.json(event);
  });
});

module.exports = router;
