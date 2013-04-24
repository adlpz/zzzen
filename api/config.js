
// Configuration. Yep, it's THIS complicated.

function Configuration() {
	// Database
	this.host = 'localhost';
	this.db = 'zzzen';
	// Administration
	this.user = 'admin';
	this.pass = 'password';
	// Server
	this.port = 8080;
    // About
    this.title = 'RTF/CC';
    this.author = 'Adria Lopez';
    this.twitter = '@adlpz';
    this.email = 'adria@prealfa.com';
    this.domain = 'http://rtf.cc';
    this.base_dir = '/article/';
    this.base_url = this.domain + this.base_dir;
    this.posts_dir = '/var/www/rtf/article/';
    this.index_file = '/var/www/rtf/index.html';
}

module.exports = new Configuration();
