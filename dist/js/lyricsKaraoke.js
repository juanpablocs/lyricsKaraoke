RegExp.prototype.execAll=function(b){for(var a=null,c=[];a=this.exec(b);){var e=[];for(i in a)parseInt(i)==i&&e.push(a[i]);c.push(e)}return c};

/* created by @juanpablocs21 */
var karaoke;

karaoke = (function() {
  var debug, dom, karaokesArray, regexParseAll, regexParseTime, rows, version;

  function karaoke() {}

  version = 1.0;

  regexParseAll = /\[(\d{1,2}:[\d.]+)\]([^\[]+)?/g;

  regexParseTime = /^(\d*)\:(.*)/i;

  karaokesArray = [];

  dom = {};

  rows = 3;

  debug = true;

  karaoke.prototype.str = {
    cntKaraoke: "#karaoke",
    lineKaraoke: "#karaoke li p",
    itemKaraoke: ".karaoke",
    itemKaraokePos: function(pos) {
      return ".karaoke_" + pos;
    }
  };

  karaoke.prototype._tmp = {
    cntHeight: 0,
    lineHeight: 0,
    scroll: 0,
    pos: 0,
    viewLyric: null,
    top_current: []
  };

  karaoke.prototype.catchDom = function() {
    var self;
    self = this;
    dom.cntKaraoke = $(self.str.cntKaraoke);
    dom.lineKaraoke = $(self.str.lineKaraoke);
    dom.cntKaraokeLyric = $(self.str.cntKaraokeLyric);
  };

  karaoke.prototype.suscribeEvents = function() {
    var self;
    self = this;
    dom.cntKaraoke.on('click', 'li', function(e) {
      var currentTime, that;
      that = $(this);
      currentTime = that.data('time') / 1000;
      $("audio")[0].currentTime = currentTime;
    });
  };

  karaoke.prototype.karaokeInit = function(op, lyric) {
    this._tmp.viewLyric = op;
    this.prepareKaraoke(lyric);
    this.bindHtmlViewKaraoke();
    this.bindStyleHtml();
    this.suscribeEvents();
    this.setViewLyricLayoutAction(op);
  };

  karaoke.prototype.bindStyleHtml = function() {
    var self;
    self = this;
    self.catchDom();
    self._tmp.lineHeight = dom.lineKaraoke.outerHeight();
    self._tmp.cntHeight = self._tmp.lineHeight * rows;
    dom.cntKaraoke.animate({
      height: self._tmp.cntHeight + "px"
    }, 500);
  };

  karaoke.prototype.bindHtmlViewKaraoke = function() {
    var self, tmp;
    self = this;
    tmp = [];
    if (karaokesArray.length > 0) {
      $.each(karaokesArray, function(i, obj) {
        var itmcls, itmcls2, text;
        text = obj.text === "" ? "" : "<p>" + obj.text + "</p>";
        itmcls = self.str.itemKaraoke.replace('.', '');
        itmcls2 = self.str.itemKaraokePos(i).replace('.', '');
        tmp.push("<li class='" + itmcls + " " + itmcls2 + "' data-time='" + obj.time + "'>" + text + "</li>");
      });
      dom.cntKaraoke.html(tmp.join(''));
    }
  };

  karaoke.prototype.controlKaraoke = function(time) {
    var i, pos, self;
    self = this;
    pos = 0;
    i = 0;
    time += 500;
    while (i < karaokesArray.length) {
      if (karaokesArray[i].time < time) {
        pos = i;
      } else {
        break;
      }
      i++;
    }
    self.fn.scrollTop(self, pos);
  };

  karaoke.prototype.prepareKaraoke = function(lyric) {
    var l, lines, self;
    self = this;
    self.catchDom();
    lines = lyric.split(/\n/g);
    l = 0;
    while (l < lines.length) {
      self.fn.timeLine(lines[l]);
      l++;
    }
    dom.cntKaraoke.html('');
  };

  karaoke.prototype.setViewLyricLayoutAction = function(op) {
    var self;
    self = this;
    switch (op) {
      case "view-scroll":
        dom.cntKaraoke.attr('class', 'view-scroll');
        break;
      default:
        dom.cntKaraoke.attr('class', 'view-normal');
    }
  };

  karaoke.prototype.log = function(msg) {
    if (debug) {
      if (typeof console !== "undefined" && console !== null) {
        console.log(msg);
      }
    }
  };

  karaoke.prototype.fn = {
    timeLine: function(line) {
      var data, n, name, scrapping, self, tmp;
      self = this;
      scrapping = regexParseAll.execAll(line.trim());
      if (scrapping.length > 0) {
        n = 0;
        tmp = "";
        while (n < scrapping.length) {
          data = scrapping[scrapping.length - (n + 1)];
          if (typeof data[2] !== 'undefined') {
            tmp = data[2];
          }
          name = typeof data[2] === 'undefined' ? tmp : data[2];
          karaokesArray.push({
            time: self.parseTimeLrc(data[1]),
            time_parsed: data[1],
            text: name
          });
          n++;
          karaokesArray.sort(function(a, b) {
            if (a.time > b.time) {
              return 1;
            } else if (a.time < b.time) {
              return -1;
            } else {
              return 0;
            }
          });
        }
      }
    },
    parseTimeLrc: function(str) {
      var r, time;
      time = str.match(regexParseTime);
      if (time) {
        r = (parseInt(time[1]) * 60) + parseInt(time[2]);
      } else {
        r = 0;
      }
      return r * 1000;
    },
    scrollTop: function(self, pos) {
      var divCurrent, top;
      self._tmp.scroll++;
      if (self._tmp.pos === pos) {
        if (self._tmp.scroll > 1) {
          console.log("libero scroll de " + pos);
        } else {
          divCurrent = $(self.str.itemKaraokePos(pos));
          if (self._tmp.viewLyric === "normal") {
            self._tmp.top_current["normal"] = parseInt(divCurrent[0].offsetTop - divCurrent.outerHeight());
          } else {
            self._tmp.top_current["scroll"] = divCurrent[0].offsetTop - self._tmp.cntHeight;
          }
          top = self._tmp.top_current[self._tmp.viewLyric];
          console.log(top);
          $(self.str.itemKaraoke).removeClass('active');
          divCurrent.addClass('active');
          dom.cntKaraoke.animate({
            scrollTop: top,
            queue: true
          }, 300);
        }
      } else {
        self._tmp.pos = pos;
        self._tmp.scroll = 0;
        console.log("no es igual");
      }
    }
  };

  return karaoke;

})();

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

    lyricsKaraoke.prototype.setViewLyricLayout = function(op) {
      this.setViewLyricLayoutAction(op);
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
      audio.insertAfter(this.el);
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
