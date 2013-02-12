/////////////////////////////////////////////////////////////////////////////
//                                                                         //
// Zzzen - database.js                                                     //
//                                                                         //
// Encapsulates all logic and code needed for the integration with MongoDB //
//                                                                         //
// Requires:                                                               //
//    - mogoose: MongoDB ODM                                               //
//    - q: Promises for nice async                                         //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////


//////////////////
// Ins and Outs //
//////////////////

var mongoose = require('mongoose');
var Q = require('q');
var config = require('./config.js');
mongoose.connect(config.host, config.db);

module.exports = new Database();

/////////////////
// Post schema //
/////////////////

var post_schema = mongoose.Schema({
	title: 'String',
	created: { type: 'Date', 'default': Date.now },
	updated: { type: 'Date', 'default': Date.now },
	format:  { type: 'String', 'default': 'markdown' },
	content: 'String',
	published: { type: 'Boolean', 'default': false },
	comments: [
		{
			host: 'String',
			date: 'Date',
			content: 'String'
		}
	]
});

var Post = mongoose.model('Post', post_schema);

////////////////
// Exceptions //
////////////////

function DatabaseError(internal) {
	this.type = 'Database Error';
	this.internal = internal;
}

function NotFoundError() {
	this.type = 'Not Found Error';
}

function BadFormatError(post) {
	this.type = 'Bad Format Error';
	this.internal = post;
}

//////////////
// Database //
//////////////

function Database() {}

// CRUD functions

Database.prototype.getPost = function(id) {
	// Retrieves a single post by its MongoDB _id

	var deferred = Q.defer();

	Post.findById(id, function(err, post) {
		if (err) deferred.reject(new DatabaseError(err));
		else {
			if (post) deferred.resolve(post);
			else deferred.reject(new NotFoundError());
		}
	});

	return deferred.promise;
};

Database.prototype.getPosts = function() {
	// Retrieves all posts

	var deferred = Q.defer();

	Post.find({}, "title created format published", function(err, posts) {
		if (err) deferred.reject(new DatabaseError(err));
		else {
			if (posts.length > 0) {
				deferred.resolve(posts);
			} else {
				deferred.reject(new NotFoundError());
			}
		}
	});

	return deferred.promise;
};

Database.prototype.updatePost = function(id, post) {
	// Update an existing post by ID

	var deferred = Q.defer();

	Post.update({
		_id: id
	}, post, function(err, numberAffected, raw) {
		if (err) deferred.reject(new DatabaseError(err));
		else {
			if (numberAffected) deferrd.resolve({ updated: numberAffected });
			else deferred.reject(new NotFoundError());
		}
	});

	return deferred.promise;
};


Database.prototype.addPost = function(post) {
	// Adds new post

	var deferred = Q.defer();

	if (this.__is_valid_post(post)) {
		var npost = new Post(post);
		npost.save(function (err) {
			if (err) deferred.reject(new DatabaseError(err));
			else {
				deferred.resolve(npost);
			}
		});
	} else {
		deferred.reject(new BadFormatError(post));
	}

	return deferred.promise;
};


Database.prototype.deletePost = function(id) {
	// Delete a single post

	var deferred = Q.defer();

	Post.findById(id, function(err, post) {
		if (err) deferred.reject(new DatabaseError(err));
		else if (!post) deferred.reject(new NotFoundError());
		else {
			post.remove(function(err, _) {
				if (err) deferred.reject(new DatabaseError(err));
				else deferred.resolve({ deleted: id });
			});
		}
	});

	return deferred.promise;
};

// Helper functions

Database.prototype.__is_valid_post = function(post) {
	if (
		post.title &&
		post.content
	) {
		return true;
	}
	return false;
};