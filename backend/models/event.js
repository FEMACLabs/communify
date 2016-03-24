'use strict';


//////////////////////////////////////////////////////////////////
// WATERLINE MODEL
//////////////////////////////////////////////////////////////////


var Waterline = require('waterline');

var Event = Waterline.Collection.extend({

  identity: 'event',
  connection: 'myLocalDisk',

  attributes: {
    title: 'string',
    date: 'string',
    time: 'string',
    location: 'string',
    eventDescript: 'string',
    eventImg: 'string',

    owners: {
      collection: 'user',
      via: 'events'
    }
  }

});

module.exports = Event;
