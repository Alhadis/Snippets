(function(){
	"use strict";

	/*<*/
	var UNDEF,
	WIN    = window,
	FALSE  = false,
	/*>*/



	AudioPlayer = function(el, opts){
		var THIS     = this,
		opts         = opts || {},
		
		/** CSS class for indicating if the media's currently playing. */
		playingClass = "playing",


		/** Callbacks */
		onPlay       = opts.onPlay || UNDEF,
		onStop       = opts.onStop || UNDEF,


		/** "Play" button */
		playBtn      = opts.playBtn,
		playBtn      = UNDEF === playBtn ? ".play-btn" : playBtn,
		playBtn      = "string" === typeof playBtn ? el.querySelector(playBtn) : playBtn,

		/** Pointer to the wrapped <audio> element. */
		audio        = el.querySelector("audio"),


		/** Whether we're currently already playing. */
		playing      = FALSE;


		Object.defineProperty(THIS, "playing", {
			get: function(){ return playing; },
			set: function(i){

				/** Coerce input to a Boolean and ensure it's different to our current state. */
				if((i = !!i) !== playing){
					playing = i;

					el.classList.toggle(playingClass);
					i ? audio.play() : audio.pause();
					try{
						audio.currentTime = 0;
					} catch(e){ /** iOS chucks a hissy-fit if the audio's not been streamed yet. */}
				}
			}
		});


		/** Handler for toggling playback when tapping/clicking play button */
		playBtn.addEventListener("mousedown", function(e){
			THIS.playing = !THIS.playing;
			
			/** Fire any relevant event handlers. */
			if(playing && onPlay)   onPlay.call(THIS, e);
			if(!playing && onStop)  onStop.call(THIS, e);

			e.preventDefault();
			return FALSE;
		});


		/** Reset the "playing" state when the audio's finished streaming. */
		audio.addEventListener("ended", function(){
			THIS.playing = FALSE;
		});
	};



	/** Export */
	WIN.AudioPlayer = AudioPlayer;
}());
