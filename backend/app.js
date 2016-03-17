'use strict';

/**
 * A simple example of how to use Waterline v0.10 with Express
 */

var express = require('express'),
    _ = require('lodash'),
    app = express(),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    // passport = require('passport'),
    // session = require('express-session'),
    // GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    cors = require('cors');

// // load the user model
// var User = require('./models/user');
//
// // load the auth variables
// var configAuth = require('./config/auth');
//
//
// // used to serialize the user for the session
//    passport.serializeUser(function(user, done) {
//        done(null, user.id);
//    });
//
//    // used to deserialize the user
//    passport.deserializeUser(function(id, done) {
//        User.findById(id, function(err, user) {
//            done(err, user);
//        });
//    });
//
//    // =========================================================================
//    // GOOGLE ==================================================================
//    // =========================================================================
//    passport.use(new GoogleStrategy({
//
//        clientID        : configAuth.googleAuth.clientID,
//        clientSecret    : configAuth.googleAuth.clientSecret,
//        callbackURL     : configAuth.googleAuth.callbackURL,
//
//    },
//    function(token, refreshToken, profile, done) {
//
//        // make the code asynchronous
//        // User.findOne won't fire until we have all our data back from Google
//        process.nextTick(function() {
//
//            // try to find the user based on their google id
//            User.findOne({ 'google.id' : profile.id }, function(err, user) {
//                if (err)
//                    return done(err);
//
//                if (user) {
//
//                    // if a user is found, log them in
//                    return done(null, user);
//                } else {
//                    // if the user isnt in our database, create a new user
//                    var newUser          = new User();
//
//                    // set all of the relevant information
//                    newUser.google.id    = profile.id;
//                    newUser.google.token = token;
//                    newUser.google.name  = profile.displayName;
//                    newUser.google.email = profile.emails[0].value; // pull the first email
//
//                    // save the user
//                    newUser.save(function(err) {
//                        if (err)
//                            throw err;
//                        return done(null, newUser);
//                    });
//                }
//            });
//        });
//
//    }));


//////////////////////////////////////////////////////////////////
// EXPRESS SETUP
//////////////////////////////////////////////////////////////////


// Setup Express Application
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cors());

// // Setup Passport
// app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
// app.use(passport.initialize());
// app.use(passport.session()); // persistent login sessions

// Build Express Routes (CRUD routes for /users)

app.get('/', function(req, res) {
  res.send('This app is just an api. Use postman to create, edit, and delete resources. Then view the JSON in the browser. See the route handlers in app.js to determine what you can do.');
});

app.get('/users', function(req, res) {
  app.models.user.find().populate('events').exec(function(err, users) {
    if(err) return res.json({ err: err }, 500);
    res.json(users);
  });
});

app.post('/users', function(req, res) {
  app.models.user.create(req.body, function(err, user) {
    if(err) return res.json({ err: err }, 500);
    res.json(user);
  });
});

app.get('/users/:id', function(req, res) {
  app.models.user.findOne({ id: req.params.id }).populate('events').exec(function(err, user) {
    if(err) return res.json({ err: err }, 500);
    res.json(user);
  });
});

app.delete('/users/:id', function(req, res) {
  app.models.user.destroy({ id: req.params.id }, function(err) {
    if(err) return res.json({ err: err }, 500);
    res.json({ status: 'ok' });
  });
});

app.put('/users/:id', function(req, res) {
  // Don't pass ID to update
  delete req.body.id;

  app.models.user.update({ id: req.params.id }, req.body, function(err, user) {
    if(err) return res.json({ err: err }, 500);
    res.json(user);
  });
});

// this route allows you to create events for a specific user
app.post('/users/:id/events', function(req, res) {
  app.models.user.findOne({ id: req.params.id }, function(err, user) {
    if(err) return res.json({ err: err }, 500);
    user.events.add(req.body);
    user.save(function(err) {
      if(err) return res.json({ err: err }, 500);
      res.json(user);
    });
  });
});

// Build Express Routes (CRUD routes for /events)

app.get('/events', function(req, res) {
  app.models.event.find().exec(function(err, events) {
    if(err) return res.json({ err: err }, 500);
    res.json(events);
  });
});

app.post('/events', function(req, res) {
  app.models.event.create(req.body, function(err, event) {
    if(err) return res.json({ err: err }, 500);
    res.json(event);
  });
});

app.get('/events/:id', function(req, res) {
  app.models.event.findOne({ id: req.params.id }, function(err, event) {
    if(err) return res.json({ err: err }, 500);
    res.json(event);
  });
});

app.delete('/events/:id', function(req, res) {
  app.models.event.destroy({ id: req.params.id }, function(err) {
    if(err) return res.json({ err: err }, 500);
    res.json({ status: 'ok' });
  });
});

app.put('/events/:id', function(req, res) {
  // Don't pass ID to update
  delete req.body.id;

  app.models.event.update({ id: req.params.id }, req.body, function(err, event) {
    if(err) return res.json({ err: err }, 500);
    res.json(event);
  });
});

// manually join existing events
// this route won't work if you don't have two users (with ids 1 & 2) and two events (with ids 1 & 2) in the system
app.get('/connect_events', function(req, res) {
  app.models.user.findOne(1).exec(function(err, user){
    if(err) return res.json({ err: err }, 500);
    user.events.add(1);
    user.events.add(2);
    user.save(function(err) {
      if(err) return res.json({ err: err }, 500);
      app.models.user.findOne(2).exec(function(err, user){
        if(err) return res.json({ err: err }, 500);
        user.events.add(2);
        user.save(function(err) {
          if(err) return res.json({ err: err }, 500);
          res.json({status:'success'}, 200);
        });
      });
    });
  });
});

module.exports = app;


//////////////////////////////////////////////////////////////////
// START WATERLINE
//////////////////////////////////////////////////////////////////



// var express = require('express');
// var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');
//
// var routes = require('./routes/index');
// var users = require('./routes/users');
//
// var app = express();
//
// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hbs');
//
// // uncomment after placing your favicon in /public
// //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
//
// app.use('/', routes);
// app.use('/users', users);
//
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });
//
// // error handlers
//
// // development error handler
// // will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }
//
// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });
//
//
