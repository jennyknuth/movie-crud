var routes = require('routes')(),
    fs = require('fs'),
    qs = require('qs'),
    db = require('monk')('localhost/movies'), // Syncs up with mongo
    movies = db.get('movies'), // grabs a collection from the music database
    view = require('./view'),
    mime = require('mime')

routes.addRoute('/movies', (req, res, url) => {
  console.log(req.url)
  res.setHeader('Content-Type', 'text/html')
  if (req.method === 'GET') {
    console.log(req.method)
    movies.find({}, function(err, docs) {
      var template = view.render('movies/index', {movies: docs}) // called docs, an array from mongo
      res.end(template)
    })
  }
  if (req.method === 'POST') {
    console.log(req.method)
    // quirks about how data comes in from Node: as a readable stream
    var data = ''
    req.on('data', function(chunk) {
      data += chunk
    })
    req.on('end', function(){
      var movie = qs.parse(data)
      movies.insert(movie, function(err, doc) {
        if (err) res.end('oops')
        res.writeHead(302, {'Location': '/movies'})
        res.end()
      })
    })
  }
})
routes.addRoute('/movies/new', function (req,res,url) {
  console.log(req.url)
  res.setHeader('Content-Type', 'text/html')
  if (req.method === 'GET') {
    console.log(req.method)
    var template = view.render('movies/new', {})
    res.end(template)
  }
})
routes.addRoute('/movies/:id', function(req, res, url) {
  console.log(req.url)
  res.setHeader('Content-Type', 'text/html')
  if (req.method === 'GET') {
    console.log(req.method);
    movies.findOne({_id: url.params.id}, function(err, doc) {
      if (err) res.end('It broke')
      var template = view.render('movies/show', doc)
      res.end(template)
    })
  }
})
routes.addRoute('/movies/:id/delete', (req, res, url) => {
  if (req.method === 'POST') {
    movies.remove({_id: url.params.id}, function(err, doc) {
      if (err) console.log(err)
      res.writeHead(302, {'Location': '/movies'})
      res.end()
    })
  }
})
routes.addRoute('/public/*', function (req, res, url) { // dynamically selecting public anything
  console.log(req.url)
  res.setHeader('Content-Type', mime.lookup(req.url)) // needed because of the splat
  fs.readFile('.'+ req.url, function (err, file) { // the dynamic part for our static files
    if (err) {
      res.setHeader('Content-Type', 'text/html')
      res.end('404')
    }
    res.end(file)
  })
})
routes.addRoute('/', function (req, res, url) {
  res.setHeader('Content-Type', 'text/html')
  fs.readFile('home.html', function (err, file) {
    if (err) {
      res.end('404')
    }
    res.end(file.toString())
  })
})



module.exports = routes
