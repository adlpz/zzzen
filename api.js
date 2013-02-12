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

// Permanence
var database = require('./database.js');

// Configuration
var config = require('./config.js');


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

function except(res) {
	return function(ex) {
		res.json({
			error: ex.type,
			internal: ex.internal
		});
	};
}

function response(res) {
	return function(obj) {
		res.send(obj);
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
		response(res),
		except(res)
	);
});

app.get('/posts', function(req, res) {
	database.getPosts()
	.then(
		response(res),
		except(res)
	);
});

app.post('/post/:id', express.basicAuth(authenticate), function(req, res) {
	database.updatePost(req.params.id, req.body)
	.then(
		response(res),
		except(res)
	);
});

app.post('/posts', express.basicAuth(authenticate), function(req, res) {
	database.addPost(req.body)
	.then(
		response(res),
		except(res)
	);
});

app.del('/post/:id', express.basicAuth(authenticate), function(req, res) {
	database.deletePost(req.params.id)
	.then(
		response(res),
		except(res)
	);
});

// Statics

app.use('/public', express.static(__dirname + '/public'));
app.use('/client', express.static(__dirname + '/client'));

// Run

app.listen(config.port);