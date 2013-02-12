//
// Zzzen - Editor
//


function ZzzenEditor(){}

ZzzenEditor.prototype.attach = function(selector) {
	// Initializes the editor by attaching itself to a DOM parent element
	var self = this;

	// Set up some DOM elements for easy internal reference
	// Names are hardcoded up to the parent

	self.paren = $(selector);
	self.editor = self.paren.find('#insertion');
	self.textarea = self.editor.find('textarea#main-editor');
	self.preview = self.paren.find('#preview-area');

	// Set up the behave textarea element
	self.behaveEditor = new Behave({
		textarea: self.textarea[0],
		replaceTab: true,
		softTabs: true,
		tabSpace: 4,
		autoOpen: false,
		overwrite: false,
		autoStrip: true,
		autoIndent: true
	});

	// Showdown Markdown converter
	self.converter = new Showdown.converter({
		extensions: [
			'twitter',
			'github',
			'table',
			'prettify'
		]
	});

	// Set up timing variables
	self._render = function() {self.preview.html(self.converter.makeHtml(self.textarea.val()));prettyPrint.apply()};
	self.delayTime = 300; // ms

	// Handle text insertion
	self.textarea.keyup(function(ev) {
		window.clearTimeout(self.updateTimer);
		self.updateTimer = window.setTimeout(self._render, self.delayTime);
	});
};
