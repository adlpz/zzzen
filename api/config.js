
// Configuration. Yep, it's THIS complicated.

function Configuration() {
	// Database
	this.host = 'localhost';
	this.db = 'zzzen';
	// Administration
	this.user = 'admin';
	this.pass = 'pqrf632';
	// Server
	this.port = 8080;
    // About
    this.title = 'Zzzen Blog';
    this.author = 'The Author';
    this.twitter = 'The Author\'s Twitter';
    this.email = 'the_author@example.com';
    this.domain = 'http://zzzen.local';
    this.base_dir = '/';
    this.base_url = this.base_dir + this.folder;
    this.posts_dir = '/home/adlpz/Projects/zzzen/';
    this.index_file = '/home/adlpz/Projects/zzzen/index.html';
}

module.exports = new Configuration();
