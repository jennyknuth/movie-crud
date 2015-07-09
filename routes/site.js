var fs = require('fs'),
    qs = require('qs'),
    db = require('monk')('localhost/movies'), // Syncs up with mongo
    movies = db.get('movies'), // grabs a collection from the music database
    view = require('./../view'),
    mime = require('mime')

module.exports = {
  public: function (req, res, url) { // dynamically selecting public anything
    console.log(req.url)
    res.setHeader('Content-Type', mime.lookup(req.url)) // needed because of the splat
    fs.readFile('.' + req.url, function (err, file) { // the dynamic part for our static files
      if (err) {
        res.setHeader('Content-Type', 'text/html')
        res.end('404')
      }
      res.end(file)
    })
  },
  home: function (req, res, url) {
    res.setHeader('Content-Type', 'text/html')
    fs.readFile('home.html', function (err, file) {
      if (err) {
        res.end('404')
      }
      res.end(file.toString())
    })
  }
}
