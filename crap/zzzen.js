
function Server() {}

Server.prototype.initialise = function() {
	var self = this;

	self.restify = require('restify');
	self.server = self.restify.createServer();
	self.db = require('./database.js')
	

	self.server.use(self.restify.bodyParser());
}

Server.prototype.serve = function(host, port) {
	var self = this;

	self.db.initialise({
		uri: 'mongodb://localhost/zzzen'
	}).then(function() {

		// Set up routes
		
		self.server.get('/posts/:uuid', function(req, res, next){ self.getPost(self, req, res, next); });
		self.server.get('/posts', function(req, res, next){ self.getPost(self, req, res, next); });
		self.server.post('/posts', function(req, res, next){ self.getPost(self, req, res, next); });

		// self.server.put('/posts/:uuid', self.putPost);

		// self.server.del('/posts/:uuid', self.deletePost);

		self.server.listen(port);
	});
}

Server.prototype.getPost = function(self, req, res, next) {
	var uuid = req.params.uuid;

	var posts = [];

	if (uuid) {
		posts = self.db.getPosts({
			uuid: uuid
		})
	} else {
		posts = self.db.getPosts({});
	}

	if (posts.length > 0) {
		res.send(200, posts);
	} else {
		res.send(404, {error: "Not Found", code: 404});
	}
}

Server.prototype.putPost = function(req, res, next) {
	var self = this;
	var uuid = req.params.uuid;

	if (uuid) {

	}
}



// Administration API

var server = new Server();
server.initialise();
server.serve('', 8080);