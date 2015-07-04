var routes = require('routes')(),
    fs = require('fs'),
    qs = require('qs'),
    db = require('monk')('localhost/music'), // Syncs up with mongo
    bands = db.get('bands'), // grabs a collection from the music database
    view = require('./view'),
    mime = require('mime')


module.exports = routes
