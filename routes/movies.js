var fs = require('fs'),
    qs = require('qs'),
    db = require('monk')('localhost/movies'), // Syncs up with mongo
    movies = db.get('movies'), // grabs a collection from the music database
    view = require('./../view'),
    mime = require('mime')

module.exports = {
  index: function(req, res, url) {
    console.log(req.url)
    res.setHeader('Content-Type', 'text/html')
    if (req.method === 'GET') {
      console.log(req.method)
      movies.find({}, function (err, docs) {
        if (err) return ('no movies found')
        var template = view.render('movies/index', {movies: docs}) // called docs, an array from mongo
        res.end(template)
      })
    }
    if (req.method === 'POST') {
      console.log(req.method)
      // quirks about how data comes in from Node: as a readable stream
      var data = ''
      req.on('data', function (chunk) {
        data += chunk
      })
      req.on('end', function () {
        var movie = qs.parse(data)
        movies.insert(movie, function (err, doc) {
          if (err) res.end('oops')
          res.writeHead(302, {'Location': '/movies'})
          res.end()
        })
      })
    }
  },
  new: function (req, res, url) {
    console.log(req.url)
    res.setHeader('Content-Type', 'text/html')
    if (req.method === 'GET') {
      console.log(req.method)
      var template = view.render('movies/new', {})
      res.end(template)
    }
  },
  id: function (req, res, url) {
    console.log(req.url)
    res.setHeader('Content-Type', 'text/html')
    if (req.method === 'GET') {
      console.log(req.method)
      movies.findOne({_id: url.params.id}, function (err, doc) {
        if (err) res.end('It broke')
        var template = view.render('movies/show', doc)
        res.end(template)
      })
    }
  },
  delete: function (req, res, url) {
    if (req.method === 'POST') {
      movies.remove({_id: url.params.id}, function (err, doc) {
        if (err) console.log(err)
        res.writeHead(302, {'Location': '/movies'})
        res.end()
      })
    }
  },
  edit: function (req, res, url) {
    if (req.method === 'GET') {
      console.log(req.method)
      movies.findOne({_id: url.params.id}, function (err, doc) {
        if (err) return ('movie not found')
        var template = view.render('movies/edit', doc)
        res.end(template)
      })
    }
  },
  update: function (req, res, url) {
    if (req.method === 'POST') {
      var data = '' // query string coming in from the form
      req.on('data', function (chunk) {
        data += chunk
      })
      req.on('end', function () {
        var movie = qs.parse(data)
        movies.update({_id: url.params.id}, movie, function (err, doc) {
          if (err) throw console.error
          res.writeHead(302, {'Location': '/movies'})
          res.end()
        })
      })
    }
  },
}
