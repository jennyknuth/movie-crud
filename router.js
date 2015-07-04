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
        res.writeHead(302, {'Location': '/bands'})
        res.end()
      })
    })
    console.log('Thanks for the data!')
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




module.exports = routes
