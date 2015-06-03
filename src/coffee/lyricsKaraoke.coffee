# api
# $("element").lyricsKaraoke('pause')
# $("element").lyricsKaraoke('play')
# $("element").lyricsKaraoke('seek', 100)
# $("element").lyricsKaraoke({
# 	setFileMP3: "mp3",
#	setFileLRC: "file.lrc",
#	onStreamingPlayer: function(){
#	},
#	onErrorMP3: function(){
#	},
#	onErrorLRC: function(){
#	}
# })
do($ = window.jQuery, window) ->
	class lyricsKaraoke extends karaoke
		defaults :
			setFileMP3: null,
			setFileLRC: null,
			viewLyric: 'normal' #(normal, scroll)
			onStreamingPlayer: ->
			onErrorMP3: ->
			onErrorLRC: ->

		identity = "lyricsKaraoke"+Math.floor(Math.random()*99999)
		audio = null

		constructor: (el, options) ->
			@options =  $.extend( {}, @defaults, options)
			@el = $(el)
			@createPlayer()
			@karaokeInit(@options.viewLyric, @el.text())
			return

		# player
		pause : () ->
			if(audio)
				audio[0].pause()
			else
				@log "error no playing"
			return
		play: () ->
			if(audio)
				audio[0].play()
			else
				@log "error no playing"
			return
		seek: (time) ->
			@controlKaraoke(time)
			return
		test: (message) ->
			@log(@options.paramA + message)
			return
		createPlayer: () ->
			self = this
			audio = $("<audio>")
			audio.attr({"src": @options.setFileMP3, "controls":"controls", "id":identity})
			audio.on "timeupdate", (e) ->
				self.options.onStreamingPlayer(e)
				timeCurrent = e.target.currentTime * 1000
				self.controlKaraoke(timeCurrent)
				return
			audio.on "error", @onErrorMP3
			$("body").append(audio)
			return
	# 
	# Define the plugin
	$.fn.extend lyricsKaraoke: (option, args...) ->
		@each ->
			$this = $(@)
			data = $this.data('lyricsKaraoke')
			if !data
				$this.data 'lyricsKaraoke', (data = new lyricsKaraoke(this, option))
			if typeof option == 'string'
				data[option].apply(data, args)
		return	
