
function Database() {}

Database.prototype.initialise = function(options) {
	var self = this;

	self.mongoose = require('mongoose');
	self.Promise = require('node-promise').Promise;
	self.uuid = require('node-uuid');

	var promise = new self.Promise();

	self.mongoose.connect(options.uri);

	// Set up schemas
	
	self.schemas = {
		post: self.mongoose.Schema({
			uuid: { type: String, "default": self.uuid.v4() },
			slug: String,
			title: String,
			date: { type: Date, "default": Date.now },
			publised: Boolean,
			format: String,
			content: String
		})
	};

	// Set up models
	
	self.models = {
		Post: self.mongoose.model('Post', self.schemas.post)
	};

	self.db = self.mongoose.connection;
	self.db.on('error', self.handleConnectionError);
	self.db.once('open', function() {
		promise.resolve("Database initialised");
	});

	return promise;
};

Database.prototype.handleConnectionError = function(what) {
	console.log(what);
}

Database.prototype.getPosts = function(params) {
	var self = this;

	var promise = new self.Promise();

	self.models.Post.find(params, function(err, posts) {
		if (err) promise.reject("Failed to find any posts");
		else promise.resolve(posts);
	});

	return promise;
};

Database.prototype.putPost = function(post) {
	var self = this;

	var promise = new self.Promise();

	if (post.uuid) {
		// Editing
		self.models.Post.update(
			{ uuid:post.uuid }, 
			{ $set: post }, 
			function(err, p) {
				if (err) promise.reject("Failed to update post");
				else promise.resolve("Post updated");
			}
		);
	} else {
		var p = new self.models.Post(post);
		p.save(function(err) {
			if (err) promise.reject("Failed to create post");
			else promise.resolve("Post created");
		});
	}

	return promise;
};

Database.prototype.removePost = function(params) {
	var self = this;

	var promise = new self.Promise();

	self.models.Post.remove(params, function(err) {
		if (err) promise.reject("Failed to remove post");
		else promose.resolve("Post removed");
	});

	return promise;
};


module.exports = new Database();