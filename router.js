var routes = require('routes')(),
    fs = require('fs'),
    qs = require('qs'),
    db = require('monk')('localhost/movies'), // Syncs up with mongo
    movies = db.get('movies'), // grabs a collection from the music database
    view = require('./view'),
    mime = require('mime'),
    movieRoutes = require('./routes/movies'),
    siteRoutes = require('./routes/site')

routes.addRoute('/movies', movieRoutes.index)
routes.addRoute('/movies/new', movieRoutes.new)
routes.addRoute('/movies/:id', movieRoutes.id)
routes.addRoute('/movies/:id/delete', movieRoutes.delete)
routes.addRoute('/movies/:id/edit', movieRoutes.edit)
routes.addRoute('/movies/:id/update', movieRoutes.update)

routes.addRoute('/public/*', siteRoutes.public)
routes.addRoute('/', siteRoutes.home)
})

module.exports = routes
