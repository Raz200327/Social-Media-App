/*
	Future Imperfect by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

// JavaScript code to toggle the menu on click

// Function to add the animation class when the button is clicked
function addScaleAndBounceAnimation(post_id, id) {
	console.log("Clicked!");
	// Get a reference to the "like" button element
	var likeButton = document.getElementById(id);

	// Add the animation class to trigger the animation
	likeButton.classList.add("scaleAndBounce");

	// Remove the animation class after the animation completes
	setTimeout(function () {
		likeButton.classList.remove('scaleAndBounce');
	}, 400); // 1000 milliseconds (1 second) matches the animation duration
	
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			try {
				let data = JSON.parse(xhttp.responseText);
				console.log(data);
				let currentLike = Number(document.getElementById(id).innerText.valueOf());
				document.getElementById(`like1${post_id}`).innerText = currentLike + Number(data.like);
			} catch (error) {
				console.error('Error parsing response:', error);
			}
		}
	};
	xhttp.open("GET", `/like/${post_id}`);
	xhttp.send();
}

// Function to toggle comments visibility
function toggleComments(postId) {
const commentsContainer = document.getElementById(`comments${postId}`);
if (commentsContainer.style.maxHeight) {
	commentsContainer.style.maxHeight = null;
	console.log('Clicked!');
} else {
	// Calculate the height based on the actual content
	commentsContainer.style.maxHeight = commentsContainer.scrollHeight + "px";
	console.log("Closed!");
}
}

// Attach click event listeners to all "Toggle Comments" buttons
const toggleButtons = document.querySelectorAll(".toggle-comments");
toggleButtons.forEach((button) => {
	button.addEventListener("click", function () {
		const postId = button.getAttribute("data-post-id");
		toggleComments(postId);
	});
});

function showCommentBox(postId) {
	// Find the comment text box related to the post
	const commentTextBox = document.querySelector(`#comment-box-${postId}`);
	
	// Toggle the visibility of the comment text box
	if (commentTextBox.style.display === 'none' || commentTextBox.style.display === '') {
		commentTextBox.style.display = 'block';
		
	} else {
		commentTextBox.style.display = 'none';
		
	}
}

function submitComment(post_id){
	const comment = document.getElementById(`comment-${post_id}`).value;
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState === 4 && xhttp.status === 200){
			let data = JSON.parse(xhttp.responseText);
			let name = data.user;
			let oldComments = document.getElementById(`comment-list-${post_id}`).innerHTML;
			document.getElementById(`comment-list-${post_id}`).innerHTML = 
			`<div class="comment-overview"><div class="comment-profile" id="comment-list"> <img src="https://api.dicebear.com/7.x/pixel-art/svg?seed=${name}" alt="" /><p><b>${name}</b></p><br/>
						${comment}
						</div></div>` + oldComments;
		}
	}
	xhttp.open('POST', '/comment', true);
	xhttp.setRequestHeader('Content-Type', 'application/json');

	const data = JSON.stringify({ post_id, comment });
	xhttp.send(data);




}

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$menu = $('#menu'),
		$sidebar = $('#sidebar'),
		$main = $('#main');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ null,      '480px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Menu.
		$menu
			.appendTo($body)
			.panel({
				delay: 500,
				hideOnClick: true,
				hideOnSwipe: true,
				resetScroll: true,
				resetForms: true,
				side: 'right',
				target: $body,
				visibleClass: 'is-menu-visible'
			});

	// Search (header).
		var $search = $('#search'),
			$search_input = $search.find('input');

		$body
			.on('click', '[href="#search"]', function(event) {

				event.preventDefault();

				// Not visible?
					if (!$search.hasClass('visible')) {

						// Reset form.
							$search[0].reset();

						// Show.
							$search.addClass('visible');

						// Focus input.
							$search_input.focus();

					}

			});

		$search_input
			.on('keydown', function(event) {

				if (event.keyCode == 27)
					$search_input.blur();

			})
			.on('blur', function() {
				window.setTimeout(function() {
					$search.removeClass('visible');
				}, 100);
			});

	// Intro.
		var $intro = $('#intro');

		// Move to main on <=large, back to sidebar on >large.
			breakpoints.on('<=large', function() {
				$intro.prependTo($main);
			});

			breakpoints.on('>large', function() {
				$intro.prependTo($sidebar);
			});

})(jQuery);