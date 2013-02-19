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
	post: 'templates/post.html.mustache',
	front: 'templates/front.html.mustache',
	header: 'templates/header.html.mustache',
	footer: 'templates/footer.html.mustache'
};

var about = {
	title: '0x41//eu',
	author: 'Adria Lopez',
	twitter: '@adlpz',
	email: '41@prealfa.com',
	base: 'http://zzzen.local/',
	posts_dir: '../posts/',
	front_page: '../index.html'
};

///////////
// Parts //
///////////

function renderPostBody(post, template) {
	try{ 
		post.content = converter.makeHtml(post.content);
	} catch(err) {
		console.log('Showdown Error: ' + err);
		console.log('On: ' + post);
	}
	return Mustache.render(fs.readFileSync(template,'utf8'), post);
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
			for (var i = 0; i < posts.length; i++) {
				var p = posts[i];
				var fn = p.title.toLowerCase().replace(/\s/g, '-') + '.html';
				posts[i].permalink = about.base + fn;
				var stats = false;
				try{
					stats = fs.statSync(about.posts_dir + fn);
				} catch(err) {
					stats = false;
				}
				if (stats && stats.isFile()) {
					if (p.updated > stats.mtime) {
						try {
							fs.writeFileSync(about.posts_dir + fn, renderPost(p));
						} catch(err) {
							deferred.reject('Error on file update: ' + err.message);
						}
						deferred.notify(fn + ": Updated");
					} else {
						deferred.notify(fn + ": Up to date");
					}
				} else {
					try {
						fs.writeFileSync(about.posts_dir + fn, renderPost(p), 'utf8');
					} catch(err) {
						deferred.reject('Error on file creation: ' + err.message);
					}
					deferred.notify(fn + ": Created");
				}
			}
			// Render front page
			try {
				fs.writeFileSync(about.front_page, renderFront(posts),  'utf8');
			} catch(err) {
				deferred.reject('Error on frontpage write: ' + err.message);
			}
			deferred.resolve('Finished rendering');
		});
	});
	return deferred.promise;
}
