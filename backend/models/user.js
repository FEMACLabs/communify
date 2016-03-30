'use strict';


//////////////////////////////////////////////////////////////////
// WATERLINE MODEL
//////////////////////////////////////////////////////////////////


var Waterline = require('waterline');

var User = Waterline.Collection.extend({

  identity: 'user',
  connection: 'myLocalPostgres',

  attributes: {
    email: 'string',
    password: 'string',
    name: 'string',
    zip: 'string',
    userDescript: 'string',
    userImg: 'string',

    events: {
      collection: 'event',
      via: 'owners',
      dominant: true
    }

  }

});

module.exports = User;
