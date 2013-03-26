//////////////////////////////////////////////////////////
//                                                      //
// Zzzen - api.js                                       //
//                                                      //
// This is the main entry and exit point for documents  //
// stored on Zzzen. Implements public access and secure //
// modification of posts.                               //
//                                                      //
//////////////////////////////////////////////////////////



// Web I/O
var express = require('express');
var app = express();

app.use(express.bodyParser());
app.set("jsonp callback", true);

// Permanence
var database = require('./database.js');

// Configuration
var config = require('./config.js');

// Renderer
var renderer = require('./renderer.js');

// CORS Middleware
var allowCORS = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
    next();
}
app.use(allowCORS);

// Zzzen implements a simple sort-of-REST API through GET/POST/DELETE requests to endpoints
//
// GET /post/:id => Retrieves a single post
// GET /posts => Retrieves all posts (in excerpt form)
// POST /post/:id => Overwrites a single post
// POST /posts => Adds a post to the collection
// DELETE /post/:id => Deletes a single post
//
// No PUT verbs are allowed. No collection creation/destruction is allowed.
//
// Insertion and deletion require HTTP Basic authentication. If you don't like that, use SSL.
// It's not like digest/md5 is a lot more secure nowadays, and I like the whole stateless
// deal

function except(res, jsonp) {
	return function(ex) {
		var o = {
			error: ex.type,
			internal: ex.internal.toString()
		};
		if (!jsonp) res.json(o);
		else res.jsonp(o);

	};
}

function response(res, jsonp) {
	return function(obj) {
		if (!jsonp)	res.json(obj);
		else res.jsonp(obj);
	};
}

function authenticate(user, pass) {
	// Oh noes! No databases!
	return user == config.user && pass == config.pass;
}


///////////
// Verbs //
///////////

app.get('/post/:id', function(req, res) {
	database.getPost(req.params.id)
	.then(
		response(res, req.query.callback),
		except(res, req.query.callback)
	);
});

app.get('/posts', function(req, res) {
	database.getPosts()
	.then(
		response(res, req.query.callback),
		except(res, req.query.callback)
	);
});

app.post('/post/:id', express.basicAuth(authenticate), function(req, res) {
	database.updatePost(req.params.id, req.body)
	.then(
		response(res, req.query.callback),
		except(res, req.query.callback)
	);
});

app.post('/posts', express.basicAuth(authenticate), function(req, res) {
	database.addPost(req.body)
	.then(
		response(res, req.query.callback),
		except(res, req.query.callback)
	);
});

app.del('/post/:id', express.basicAuth(authenticate), function(req, res) {
	database.deletePost(req.params.id)
	.then(
		response(res, req.query.callback),
		except(res, req.query.callback)
	);
});

// Extra verb: render
app.get('/render', express.basicAuth(authenticate), function(req, res) {
	res.type('text/plain');
	res.status(200);
	renderer.doRender()
	.then(
		function(x){ res.end(x);},
		function(x){ res.end(x);},
		function(x){ res.write(x+'\n'); }
	);
});

app.options('/*', function(req, res) {
	res.status(200);
	res.end();
});

// Run

app.listen(config.port);
