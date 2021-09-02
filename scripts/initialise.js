//Sound effects load
reload_sfx = document.createElement('audio');
reload_sfx.setAttribute('src', 'sound/reload.mp3');
swat_sfx = document.createElement('audio');
swat_sfx.setAttribute('src', 'sound/swat.mp3');
dead_bee_sfx = document.createElement('audio');
dead_bee_sfx.setAttribute('src', 'sound/dead_bee.mp3');
hit_queen_sfx = document.createElement('audio');
hit_queen_sfx.setAttribute('src', 'sound/hit_queen.mp3');
you_win_sfx = document.createElement('audio');
you_win_sfx.setAttribute('src', 'sound/you_win.mp3');

var hit_count = 0;

//Page navigation
function page_navigation() {
	$('#home-screen button').on('click', function() {
		$('#home-screen').hide();
		$('#game-screen').show();
		//play sound-effect
        reload_sfx.play();
		gameplay();
	});
	$('.restart button').on('click', function() {
		hit_count = 0;
		$('.hit-counter span').html(0);
		$('#queen-bee .counter span:first-of-type').html(100);			
		$('.worker-bee .counter span:first-of-type').html(75);			
		$('.drone-bee .counter span:first-of-type').html(50);
		$('.impact').removeClass("animate");
		//play sound-effect
        reload_sfx.play();
		$('.bee-instance').removeClass("activated disabled").hide().fadeIn(500);
		$('.hit-bee button').show();
		$('.restart').hide();
	});
};

//Game rules
function gameplay() {
	hit_count = 0;

	//animate bee, then remove animation class when completed
	//cache bee-instance selector; wastes memory to constantly re-select it when it won't change state
	var $bee_instance = $('.bee-instance');
	setInterval(function(){
		$bee_instance.toggleClass("shine");
	}, 1000);

	$('.hit-bee button').on('click', function() {		
		//output number of clicks
		hit_count++;
		$('.hit-counter span').html(hit_count);
		
		//Calculate 'hive' array - find bee-instances not disabled
		var hive = $.makeArray($('#gameplay').find('.bee-instance:not(.disabled)'));
		var single_bee = hive[Math.floor(Math.random() * hive.length)];
		
		//standard bee-instance calculations
		var this_counter = $(single_bee).find('.counter span:first-of-type');
		var this_number = $(this_counter).html();
		$(single_bee).addClass("activated");
		
		//animate bee when hit, then remove animation class when completed
		$(single_bee).addClass("wobble").on(
			"webkitAnimationEnd oAnimationEnd msAnimationEnd animationEnd",
			function() {
				$(this).removeClass("wobble");
			}
		);
		
		//Queen Bee increment only if not disabled
		if ($(single_bee).is("#queen-bee") && (!$(single_bee).hasClass("disabled"))) {
			swat_sfx.pause();
			//Reset paused audio
      		swat_sfx.currentTime = 0;
			//play sound-effect
      		hit_queen_sfx.currentTime = 0;
			hit_queen_sfx.play();
			this_counter.html(this_number - 8);
			//animate bee when hit, then remove transition class when completed
			$('.impact').addClass("animate").on(
				"webkitTransitionEnd oTransitionEnd msTransitionEnd TransitionEnd",
				function() {
					$(this).removeClass("animate");
				}
			);
		//Worker Bee increment only if not disabled
		} else if ($(single_bee).hasClass("worker-bee") && (!$(single_bee).hasClass("disabled"))) {
			//play sound-effect
			swat_sfx.play();
			this_counter.html(this_number - 10);
		//Drone Bee increment only if not disabled
		} else if ($(single_bee).hasClass("drone-bee") && (!$(single_bee).hasClass("disabled"))) {
			//play sound-effect
			swat_sfx.play();
			this_counter.html(this_number - 12);
		};

		//Game over
		if ($(single_bee).is("#queen-bee") && ($(this_counter).html() <= "0")) {
			hit_queen_sfx.pause();
			//Reset paused audio
      		swat_sfx.currentTime = 0;
			//play sound-effect
			you_win_sfx.play();
			//kill all
			$('.bee-instance').addClass("activated disabled").removeClass("wobble");
			$('.bee-instance .counter span:first-of-type').html("defeated!");
			if ((hit_count) >= 90) {
				$('#gameplay .restart .winning-message').html("RANK: AMATEUR BEE CLEANER");
			} else {
				$('#gameplay .restart .winning-message').html("RANK: SWAT-KING");
			};
			$('.hit-bee button').hide();
			$('.restart').show();
		};
		
		//Kill bee
		if ($(this_counter).html() <= "0") {
			swat_sfx.pause();
			//Reset paused audio
      		swat_sfx.currentTime = 0;
			//play sound-effect
      		dead_bee_sfx.currentTime = 0;
			dead_bee_sfx.play();
			$(single_bee).addClass("disabled").removeClass("wobble").fadeOut(1000);
			this_counter.html("defeated!");
		};
	});
};

//Replace all SVG images with inline SVG
//Not my code! Regularly use this from:
//http://stackoverflow.com/questions/11978995/how-to-change-color-of-svg-image-using-css-jquery-svg-image-replacement
function svg_go() {
	$('img.svg').each(function(){
		var $img = jQuery(this);
		var imgID = $img.attr('id');
		var imgClass = $img.attr('class');
		var imgURL = $img.attr('src');
		$.get(imgURL, function(data) {
			// Get the SVG tag, ignore the rest
			var $svg = jQuery(data).find('svg');
			// Add replaced image's ID to the new SVG
			if(typeof imgID !== 'undefined') {
				$svg = $svg.attr('id', imgID);
			}
			// Add replaced image's classes to the new SVG
			if(typeof imgClass !== 'undefined') {
				$svg = $svg.attr('class', imgClass+' replaced-svg');
			}
			// Remove any invalid XML tags as per http://validator.w3.org
			$svg = $svg.removeAttr('xmlns:a');
			// Replace image with new SVG
			$img.replaceWith($svg);
		}, 'xml');
	});
};

//INITIALISE
function initialise() {
	page_navigation();
	svg_go();
};