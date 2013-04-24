
// This does the whole connecting to the backend

configuration = {
	backend: 'http://rtf.cc:8080',
	post_list: "#management ul",
	editor: "#main-editor",
	preview: "#preview-area"
};

window.cred_cache = {};

// Post list retrieving and population

function generatePostListItem(post) {
	return $('<li></li>')

	.attr('data-id', post._id)

	.addClass('post-list-item')

	.click(function(ev) {
		ev.preventDefault();
		loadPost($(this).attr('data-id'));
	})

	.bind("contextmenu", function(ev) {
		ev.preventDefault();
		$(this).find('.options').fadeToggle('fast');
		$(".post-list-item").not($(this)).find('.options').fadeOut('fast');
	})

	.append($("<p></p>")
		.html(post.title)
	)

	.append($("<div></div>")
		.addClass("options")
		.append($("<a></a>")
			.addClass('delete-post-button')
			.addClass('button')
			.attr('href', "#")
			.attr('data-id', post._id)
			.html("Delete")
			.click(function(ev) {
				ev.preventDefault();
				deletePost($(this).attr('data-id'));
				return false;
			})
		)
	);

}

function doServerRequest(url, type, data, success, failure, credentials) {
	console.log('Request');
	$.ajax({
		url: url,
		type: type,
		data: data,
		dataType: "json",
		beforeSend: function(xhr) {
			console.log(credentials);
			if (credentials.user && credentials.password) {
				console.log('True');
				xhr.setRequestHeader('Authorization', 'Basic ' + btoa(credentials.user + ':' + credentials.password));
			}
		}
	}).then(
		success,
		function(xhr) {
			if (xhr.status == 401) {
				// Unauthorized, no credentials or bad credentials, will retry.
				getCredentials(function(c){ doServerRequest(url, type, data, success, failure, c); });
			} else {
				if (failure) { failure(); }
			}
		}
	);
}

function getCredentials(callback) {
	window.cred_cache = {user: 'admin', password: 'password'};
	callback(window.cred_cache);
}

function populatePostList() {
	$(configuration.post_list).empty();
	doServerRequest(
		configuration.backend + '/posts',
		'GET',
		{},
		function(posts_list) {	// Success
			for (var i = posts_list.length - 1; i >= 0 ; i--) {
				$(configuration.post_list).append(generatePostListItem(posts_list[i]));
			}
			// Check if selected
			if (window.current_post_id) {
				$(configuration.post_list).find('[data-id=' + window.current_post_id + ']').addClass('selected');
			}
		},
		null,
		window.cred_cache
	);
}

// Single post retrieval

function loadPost(id) {
	if (window.changed) {
		Modal("Changes to the current entry will be discarded. Are you sure?",
			function(){ doLoadPost(id); }
		);
	} else {
		doLoadPost(id);
	}
}

function doLoadPost(id) {
	// Cosmetics
	$(configuration.post_list + " li")
		.removeClass('selected')
		.filter("[data-id=" + id + "]")
		.addClass('selected');

	// Retreive
	doServerRequest(
		configuration.backend + '/post/' + id,
		'GET',
		{},
		function(post) { // Success
			$(configuration.editor).val(post.content);
			window.original_buffer = post.content;
			window.current_post_id = post._id;
			setUnchanged();

			// Trigger preview
			window.editor._render();
		},
		null,
		window.cred_cache
	);
}

// Other handlers

function doSave() {
	if (!window.saving) {
		window.saving = true;
		$editor = $(configuration.editor);
		var id = window.current_post_id;
		var url = "";
		if (id) {
			url = configuration.backend + '/post/' + id;
		} else {
			url = configuration.backend + '/posts/';
		}
		var content = $editor.val();
		var title = $editor.val().split("\n")[0];
		doServerRequest(
			url,
			'POST',
			{
				title: title,
				content: content,
				updated: Date.now
			},
			function(data) {
				if (!data.error) {
					window.original_buffer = $(configuration.editor).val();
					if (data._id) window.current_post_id = data._id;
					setUnchanged();
					Notify("Saved");
				} else {
					Notify("Error: " + data.error);
				}
				populatePostList();
				window.saving = false;
			},
			null,
			window.cred_cache
		);
	}
}

function populateStaticHandlers() {

	// The new button
	$("#new-post-button").click(function(ev) {
		ev.preventDefault();
		if (window.changed) {
			Modal("Changes to the current entry will be discarded. Are you sure you want to start over?",
				function() {
					$(configuration.post_list + " li").removeClass('selected');
					setUnchanged();
					$(configuration.editor).val("");
					window.current_post_id = "";
					window.original_buffer = "";
				});
		} else {
			$(configuration.post_list + " li").removeClass('selected');
			$(configuration.editor).val("");
			window.current_post_id = "";
			$(configuration.preview).empty();
			window.original_buffer = "";
		}
	});

	// The save key
	$(document).keydown(function(ev) {
		if (ev.keyCode == 83 && (navigator.platform.match("Mac") ? ev.metaKey : ev.ctrlKey)) {
			ev.preventDefault();
			doSave();
		}
	});

	// The render button

	$('#render-button').click(function(ev) {
		ev.preventDefault();
		doServerRequest(
			configuration.backend + '/render',
			'GET',
			{},
			function() {
				Notify("Render completed");
			},
			null,
			window.cred_cache
		);
	});

	// Changed settings
	setUnchanged();
	window.original_buffer = "";
	window.current_post_id = "";

}

function deletePost(id) {
	if (window.current_post_id && id == window.current_post_id) {
		Modal("You are removing the currently open post. All changes will be lost. Are you sure you want to do this?",
			function() {
				$(configuration.editor).val("");
				window.original_buffer = "";
				window.current_post_id = "";
				doDeletePost(id);
			}
		);
	} else {
		Modal("Are you sure you want to delete that post? This cannot be undone.",
			function() {
				doDeletePost(id);
			}
		);
	}
}

function doDeletePost(id) {
	doServerRequest(
		configuration.backend + '/post/' + id,
		'DELETE',
		{},
		function(data) {
			if (!data.error) {
				Notify("Deleted");
			} else {
				Notify("Error: " + data.error + '; ' + data.internal);
			}
			populatePostList();
		},
		null,
		window.cred_cache
	);
}

function setChanged() {
	$("#changed").show();
	window.changed = true;
}

function setUnchanged() {
	$("#changed").hide();
	window.changed = false;
}
