
// Modal stuff

function Modal(message, callback, cancel) {
	// Generate a modal dialog
	
	// Disable screen and show modal
	$disabler = $('#modal-overlay-disabler').fadeIn('fast');
	$modal = $('#modal').fadeIn('fast');

	// Build modal and set event handlers
	$modal.find('#modal-message').html(message);
	$modal.find('#modal-yes')
		.unbind('click')
		.click(function(ev) {
			ev.preventDefault();
			$disabler.fadeOut('fast');
			$modal.fadeOut('fast');
			callback();
		});
	$modal.find('#modal-no')
		.unbind('click')
		.click(function(ev) {
			ev.preventDefault();
			$disabler.fadeOut('fast');
			$modal.fadeOut('fast');
			if (cancel) cancel();
		});
}

function Notify(message) {
	if (!window.notifying) {
		window.notifying = true;
		$("#notification").html(message);
		$("#notification").slideDown('fast', function() {
			window.setTimeout(function() {
				$("#notification").slideUp('fast', function() {
					window.notifying = false;
				});
			}, 1000);
		});
	}
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

	populateStaticHandlers();
});