
// Configuration. Yep, it's THIS complicated.

function Configuration() {
	// Database
	this.host = 'your_mongodb_host';
	this.db = 'zzzen';
	// Administration
	this.user = 'the_admin_username';
	this.pass = 'the_password';
	// Server
	this.port = 8080;
    // About
    this.title = 'Zzzen Blog';
    this.author = 'The Author';
    this.twitter = 'The Author\'s Twitter';
    this.email = 'the_author@example.com';
    this.base_url = 'http://your.domain/folder/';
    this.posts_dir = '/path/to/your/posts';
    this.index_file = '/path/to/the/index.html';
}

module.exports = new Configuration();
