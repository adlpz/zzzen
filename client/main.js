
// Modal stuff

function Modal(message, callback) {
	// Generate a modal dialog

	$disabler = $('.modal-overlay-disabler').show();
	$modal = $('#modal').show();
	$modal.find('#modal-message').html(message);
	$modal.find('#modal-yes')
		.unbind('click')
		.click(function(ev) {
			ev.preventDefault();
			
		})
}


$(function() {
	window.editor = new ZzzenEditor();
	window.editor.attach('#editor');
	populatePostList();

	// Handle stretches
	
	$('#abs-hint-insertion').click(function(){
		// Stretch the insertion and hide preview
		
		$insertion = $('#insertion');
		$preview = $('#preview');

		if ($insertion.hasClass('stretched')) {
			$insertion.removeClass('stretched');
		} else {
			$insertion.addClass('stretched');
		}
	});

	$('#abs-hint-preview').click(function(){
		// Stretch the insertion and hide preview
		
		$insertion = $('#insertion');
		$preview = $('#preview');

		if ($preview.hasClass('stretched')) {
			$preview.removeClass('stretched');
		} else {
			$preview.addClass('stretched');
		}
	});
});