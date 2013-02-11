


// Web I/O
var express = require('express');
var app = express();

app.use(express.json());

// Permanence
var database = require('./database.js');


// Zzzen implements a simple sort-of-REST API through GET/POST/DELETE requests to endpoints
// 
// GET /post/:id => Retrieves a single post
// GET /posts => Retrieves all posts (in excerpt form)
// POST /post/:id => Overwrites a single post
// POST /posts => Adds a post to the collection
// DELETE /post/:id => Deletes a single post
// 
// No PUT verbs are allowed. No collection creation/destruction is allowed.


///////////
// Verbs //
///////////

app.get('/post/:id', function(req, res) {
	res.json(database.getPost(req.param.id))
})