'use strict';

var express = require('express');
var router = express.Router();

var secret = 'temporarySecret';


router.get('/', function(req, res) {
  req.models.event.find().exec(function(err, events) {
    if(err) return res.json({ err: err }, 500);
    res.json(events);
  });
});

router.post('/', function(req, res) {
  req.models.event.create(req.body, function(err, event) {
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
