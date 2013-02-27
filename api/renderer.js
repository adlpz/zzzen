/////////////////////////////////////////////////////////////////////////////
//                                                                         //
// Zzzen - renderer.js                                                     //
//                                                                         //
// Renders the current post database into a static site                    //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////


var Mustache = require('mustache');
var Database = require('./database.js');
var fs = require('fs');
var util = require('util');
var Showdown = require('showdown');
var Q = require('q');
var Configuration = require('./config.js');


exports.doRender = doRender;


var converter = new Showdown.converter({
	extensions: [
		'twitter',
		'github',
		'table',
		'prettify'
	]
});

var templates = {
	post: '../templates/post.html.mustache',
	front: '../templates/front.html.mustache',
	header: '../templates/header.html.mustache',
	footer: '../templates/footer.html.mustache'
};


var about = {
    title: Configuration.title,
    author: Configuration.author,
    twitter: Configuration.twitter,
    email: Configuration.email,
    base: Configuration.base_url,
    posts_dir: Configuration.posts_dir,
    front_page: Configuration.index_file
}

///////////
// Parts //
///////////

function preprocessMetadata(post) {
	post.date = (new Date(post.created)).toString("yyyy/MM/dd");
	post.file = post.title.toLowerCase().replace(/\s/g, '-') + '.html';
	post.permalink = about.base + post.file;
	return post;
}

function preprocessContent(post) {
	post.content = converter.makeHtml(post.content);
	return post;
}


function renderPostBody(post, template) {
	return Mustache.render(fs.readFileSync(template,'utf8'), preprocessContent(post));
}

function renderFrontBody(posts, template) {
	return Mustache.render(fs.readFileSync(template,'utf8'), {posts:posts});
}

function renderHeader(data, template) {
	return Mustache.render(fs.readFileSync(template, 'utf8'), data);
}

function renderFooter(data, template) {
	return Mustache.render(fs.readFileSync(template, 'utf8'), data);
}

///////////
// Pages //
///////////

function renderPost(post) {
	return renderHeader(about, templates.header) +
		   renderPostBody(post, templates.post) +
		   renderFooter(about, templates.footer);
}

function renderFront(posts) {
	return renderHeader(about, templates.header) +
		   renderFrontBody(posts, templates.front) +
		   renderFooter(about, templates.footer);
}

function doRender() {
	var deferred = Q.defer();
	Database.getPosts()
	.then(function(posts) {
		// Render each post to html
		Q.fcall(function() {
			var postproc_posts = [];
			for (var i = 0; i < posts.length; i++) {
				var p = preprocessMetadata(posts[i]);
				postproc_posts.push(p);
				var stats = false;
				try{
					stats = fs.statSync(about.posts_dir + p.file);
				} catch(err) {
					stats = false;
				}
				if (stats && stats.isFile()) {
					if (p.updated > stats.mtime) {
						try {
							fs.writeFileSync(
								about.posts_dir + p.file, 
								renderPost(preprocessContent(p))
							);
						} catch(err) {
							deferred.reject('Error on file update: ' + err.message);
						}
						deferred.notify(p.file + ": Updated");
					} else {
						deferred.notify(p.file + ": Up to date");
					}
				} else {
					try {
						fs.writeFileSync(about.posts_dir + fn, renderPost(p), 'utf8');
					} catch(err) {
						deferred.reject('Error on file creation: ' + err.message);
					}
					deferred.notify(p.file + ": Created");
				}
			}
			// Render front page
			try {
				fs.writeFileSync(about.front_page, renderFront(preproc_posts),  'utf8');
			} catch(err) {
				deferred.reject('Error on frontpage write: ' + err.message);
			}
			deferred.resolve('Finished rendering');
		});
	});
	return deferred.promise;
}
