
// This does the whole connecting to the backend

configuration = {
	backend: 'http://localhost:8080',
	post_list: "#management ul",
	editor: "#main-editor",
	current_post_id: "#current-post-id"
};

// Post list retrieving and population

function generatePostListItem(post) {
	return $('<li></li>')

	.attr('data-id', post._id)
	.addClass('post-list-item')
	.html(post.title)
	.click(function(ev) {
		ev.preventDefault();
		loadPost($(this).attr('data-id'));
	});

}
 
function populatePostList() {
	$(configuration.post_list).empty();
	$.ajax({
		url: configuration.backend + '/posts'
	}).then(
		function(posts_list) {	// Success
			for (var i = 0; i < posts_list.length; i++) {
				$(configuration.post_list).append(generatePostListItem(posts_list[i]));
			}
		}
	);
}

// Single post retrieval

function loadPost(id) {
	// Cosmetics
	$(configuration.post_list + " li")
		.removeClass('selected')
		.filter("[data-id=" + id + "]")
		.addClass('selected');

	// Retreive
	$.ajax({
		url: configuration.backend + '/post/' + id
	}).then(
		function(post) { // Success
			$(configuration.editor).empty().val(post.content);
			$(configuration.current_post_id).val(post._id);

			// Trigger changed
			$(configuration.editor).keyup();
		}
	);
}