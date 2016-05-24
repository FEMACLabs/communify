'use strict';


//////////////////////////////////////////////////////////////////
// WATERLINE CONFIG
//////////////////////////////////////////////////////////////////


// Require any waterline compatible adapters here
var diskAdapter = require('sails-disk'),
    postgresqlAdapter = require('sails-postgresql');

// Build A Config Object
var config = {

  // Setup Adapters
  // Creates named adapters that have been required
  adapters: {
    'default': diskAdapter,
    disk: diskAdapter,
    postgres: postgresqlAdapter
  },

  // Build Connections Config
  // Setup connections using the named adapter configs
  connections: {
    myLocalDisk: {
      adapter: 'disk'
    },

    myLocalPostgres: {
      adapter: 'postgres',
      url: process.env.DATABASE_URL
    }
  },

  defaults: {
    migrate: 'safe'
  }

};

module.exports = config;
