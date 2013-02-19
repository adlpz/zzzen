
// Configuration. Yep, it's THIS complicated.

function Configuration() {
	// Database
	this.host = 'zzzen.local';
	this.db = 'zzzen';
	// Administration
	this.user = 'adlpz';
	this.pass = '12345';
	// Server
	this.port = 8080;
}

module.exports = new Configuration();