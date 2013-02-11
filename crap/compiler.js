
exports.Compiler = Compiler;


var fs = require('fs');
var file = require('file');
var yaml = require('js-yaml');

function Compiler(posts) {
	this.compiler = require('showdown').Showdown.makeHtml;
	this.templater = require('mustache').render;
	this.templates = {
		index: 'templates/index.mustache',
		post: 'templates/post.mustache'
	};
	this.sources = 'sources';
	this.compiled = 'compiled';
	this.abs = __dirname;
};

Compiler.prototype.compile = function() {

	// Render posts
	file.walk(this.sources, function(_, dirPath, dirs, files) {
		file.mkdirsSync(dirPath);
		for (var i = 0; i < files.length; i++) {
			var post = yaml.load(files[i]);
			var cpath = file.path.relpath(this.abs + this.sources, dirPath);
			var stat = fs.statSync(cpath);
			if (stat.isFile()) {
				if(post.mtime) {
					if(util.inspect(stat).mtime < post.mtime) {
						fs.writeFile(filename, 
							this.templater(post, templates.post)
						);
					}
				}
			}
		};
	})

	// Render index
	self.renderIndex(this.posts);
}

Compiler.prototype.renderPost = function(filename, post, callback) {
	fs.writeFile(filename, 
		this.templater(post, templates.post),
		callback()
	);
}

Compiler.prototype.renderIndex = function(posts) {
	fs.writeFile(filename,
		this.templater(post, templates.index),
		function() {
			// Callback
		}
	);
}
