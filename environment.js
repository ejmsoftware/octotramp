/**
 * environment.js
 *
 * This object manages the drawing of the background of the main game, including
 * the trampolines
 *
 * This version is non-buffered. The original version used buffered rendering
 * for efficiency, but it had hardware problems with mobile and some graphics
 * cards.
 *
 * @author Elliot Miller
 * @author Chris Baudouin
 * @author Maximillian McMullen
 */
function Environment(){
	this.scrollPosition = 0; // Current scrolling position on the x-axis
	this.scrollVelocity; // Current rate that the environment scrolls on the x-axis
	this.translateX = 0; // This value is used for arrow-key translation

	this.trampolines = [];

	this.adjustScrollVelocity = function(){
		var x = 4 + this.scrollPosition / JUMP_DISTANCE;
		this.scrollVelocity = MAX_SCROLL_VELOCITY * (1 - 1 / Math.sqrt(x));
		jumpDuration = JUMP_DISTANCE / this.scrollVelocity;
	}

	this.addTrampoline = function(x){
		this.trampolines.push(x);
	}

	this.placeTrampoline = function(){
		trampolinesPlaced++;
		var scrollHit;
		if (this.trampolines.length == 0){
			var scrollPlayer = this.scrollPosition + thePlayer.xpos + CHARACTER_WIDTH/2;
			scrollHit = scrollPlayer + JUMP_DISTANCE * (1-(jumpTheta/Math.PI)%1);
		} else {
			scrollHit = this.trampolines[this.trampolines.length-1] + JUMP_DISTANCE;
		}
		// Get random offset based on difficulty
		var offSlots = int(Math.random() * (2 * difficulty + 1)) - difficulty;
		scrollHit = scrollHit + offSlots * TRAMPOLINE_WIDTH;
		// add the trampoline
		this.addTrampoline(scrollHit);
	}

	this.drawEnvironment = function(){
		// Scroll the background
		this.scrollPosition += this.scrollVelocity;
		// Draw the environment
		background(220,220,220);
		// Draw the ground
		noStroke();
		fill(color(160, 180, 160));
		rect(0, GAME_HEIGHT-20, GAME_WIDTH, 20);
		// Draw the bases
		fill(120);
		for (var i=0;i<this.trampolines.length;i++){
			rect(this.trampolines[i]-this.scrollPosition-50, GAME_HEIGHT-20, 100, 40);
		}
		// Draw all the trampolines
		fill(color(156, 218, 239));
		// Animate the trampoline when the player is jumping
		if (jumpTheta%Math.PI < 0.1){
			var scrollPlayer = this.scrollPosition + thePlayer.xpos + CHARACTER_WIDTH/2;
			for (var i=0;i<this.trampolines.length;i++){
				var absDiff = Math.abs(scrollPlayer - this.trampolines[i]);
				var h = absDiff > 50 ? 30 : 15 + jumpTheta%Math.PI * 150;
				ellipse(this.trampolines[i]-this.scrollPosition, GAME_HEIGHT-h,
					TRAMPOLINE_WIDTH,TRAMPOLINE_HEIGHT);
			}
		}
		// Otherwise, just draw the trampolines
		else {
			for (var i=0;i<this.trampolines.length;i++){
				ellipse(this.trampolines[i]-this.scrollPosition, GAME_HEIGHT-30,
					TRAMPOLINE_WIDTH,TRAMPOLINE_HEIGHT);
			}
		}
		// Prune trampolines that went off the screen
		if (this.trampolines[0] < this.scrollPosition - TRAMPOLINE_WIDTH) {
			this.trampolines.shift();
		}
		// Add trampolines if needed
		if (this.trampolines.length==0 || this.trampolines[this.trampolines.length-1] < this.scrollPosition + GAME_WIDTH){
			this.placeTrampoline();
		}
	}
}
