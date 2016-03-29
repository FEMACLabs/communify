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
    date: 'Date',
    time: 'Date',
    location: 'string',
    zip: 'string',
    eventDescript: 'string',
    eventImg: 'string',
    owner_id: 'string',

    owners: {
      collection: 'user',
      via: 'events'
    }
  }

});

module.exports = Event;
