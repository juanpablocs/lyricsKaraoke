var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  slice = [].slice;

(function($, window) {
  var lyricsKaraoke;
  lyricsKaraoke = (function(superClass) {
    var audio, identity;

    extend(lyricsKaraoke, superClass);

    lyricsKaraoke.prototype.defaults = {
      setFileMP3: null,
      setFileLRC: null,
      viewLyric: 'normal',
      onStreamingPlayer: function() {},
      onErrorMP3: function() {},
      onErrorLRC: function() {}
    };

    identity = "lyricsKaraoke" + Math.floor(Math.random() * 99999);

    audio = null;

    function lyricsKaraoke(el, options) {
      this.options = $.extend({}, this.defaults, options);
      this.el = $(el);
      this.createPlayer();
      this.karaokeInit(this.options.viewLyric, this.el.text());
      return;
    }

    lyricsKaraoke.prototype.pause = function() {
      if (audio) {
        audio[0].pause();
      } else {
        this.log("error no playing");
      }
    };

    lyricsKaraoke.prototype.play = function() {
      if (audio) {
        audio[0].play();
      } else {
        this.log("error no playing");
      }
    };

    lyricsKaraoke.prototype.seek = function(time) {
      this.controlKaraoke(time);
    };

    lyricsKaraoke.prototype.test = function(message) {
      this.log(this.options.paramA + message);
    };

    lyricsKaraoke.prototype.setViewLyric = function(op) {
      switch (op) {
        case "scroll":
          this.log("scroll");
          break;
        default:
          this.log("other");
      }
      this.log(this.el);
    };

    lyricsKaraoke.prototype.createPlayer = function() {
      var self;
      self = this;
      audio = $("<audio>");
      audio.attr({
        "src": this.options.setFileMP3,
        "controls": "controls",
        "id": identity
      });
      audio.on("timeupdate", function(e) {
        var timeCurrent;
        self.options.onStreamingPlayer(e);
        timeCurrent = e.target.currentTime * 1000;
        self.controlKaraoke(timeCurrent);
      });
      audio.on("error", this.onErrorMP3);
      $("body").append(audio);
    };

    return lyricsKaraoke;

  })(karaoke);
  return $.fn.extend({
    lyricsKaraoke: function() {
      var args, option;
      option = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      this.each(function() {
        var $this, data;
        $this = $(this);
        data = $this.data('lyricsKaraoke');
        if (!data) {
          $this.data('lyricsKaraoke', (data = new lyricsKaraoke(this, option)));
        }
        if (typeof option === 'string') {
          return data[option].apply(data, args);
        }
      });
    }
  });
})(window.jQuery, window);
