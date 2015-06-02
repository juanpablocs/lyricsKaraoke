
/* created by @juanpablocs21 */
var audio, filemp3, jpKaraoke, karaoke;

jpKaraoke = (function() {
  var dom, karaokesArray, regexParseAll, regexParseTime, rows, version;

  function jpKaraoke() {}

  version = 1.0;

  regexParseAll = /\[(\d{1,2}:[\d.]+)\]([^\[]+)?/g;

  regexParseTime = /^(\d*)\:(.*)/i;

  karaokesArray = [];

  dom = {};

  rows = 3;

  jpKaraoke.prototype.str = {
    cntKaraoke: "#karaoke",
    lineKaraoke: "#karaoke li p",
    cntKaraokeLyric: "#karaokeText",
    itemKaraoke: ".karaoke",
    itemKaraokePos: function(pos) {
      return ".karaoke_" + pos;
    }
  };

  jpKaraoke.prototype._tmp = {
    cntHeight: 0,
    lineHeight: 0,
    scroll: 0,
    pos: 0
  };

  jpKaraoke.prototype.catchDom = function() {
    var self;
    self = this;
    dom.cntKaraoke = $(self.str.cntKaraoke);
    dom.lineKaraoke = $(self.str.lineKaraoke);
    dom.cntKaraokeLyric = $(self.str.cntKaraokeLyric);
  };

  jpKaraoke.prototype.suscribeEvents = function() {
    var self;
    self = this;
    dom.cntKaraoke.on('click', 'li', function(e) {
      var currentTime, that;
      that = $(this);
      currentTime = that.data('time') / 1000;
      $("audio")[0].currentTime = currentTime;
    });
  };

  jpKaraoke.prototype.ready = function() {
    this.createTimeLine();
    this.bindHtmlViewKaraoke();
    this.bindStyleHtml();
    this.suscribeEvents();
    console.log("ready");
  };

  jpKaraoke.prototype.bindStyleHtml = function() {
    var self;
    self = this;
    self.catchDom();
    self._tmp.lineHeight = dom.lineKaraoke.outerHeight();
    self._tmp.cntHeight = self._tmp.lineHeight * rows;
    dom.cntKaraoke.animate({
      height: self._tmp.cntHeight + "px"
    }, 500);
  };

  jpKaraoke.prototype.bindHtmlViewKaraoke = function() {
    var self, tmp;
    self = this;
    tmp = [];
    if (karaokesArray.length > 0) {
      $.each(karaokesArray, function(i, obj) {
        var text;
        text = obj.text === "" ? "" : "<p>" + obj.text + "</p>";
        tmp.push("<li class='" + self.str.itemKaraoke.replace('.', '') + " " + self.str.itemKaraokePos(i).replace('.', '') + "' data-time='" + obj.time + "'>" + text + "</li>");
      });
      dom.cntKaraoke.html(tmp.join(''));
    }
  };

  jpKaraoke.prototype.controlKaraoke = function(time) {
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

  jpKaraoke.prototype.createTimeLine = function() {
    var l, lines, lyric, self;
    self = this;
    self.catchDom();
    lyric = dom.cntKaraokeLyric.text();
    lines = lyric.split(/\n/g);
    l = 0;
    while (l < lines.length) {
      self.fn.timeLine(lines[l]);
      l++;
    }
  };

  jpKaraoke.prototype.fn = {
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
          top = divCurrent[0].offsetTop - self._tmp.cntHeight;
          console.log(top);
          $(self.str.itemKaraoke).removeClass('active');
          divCurrent.addClass('active');
          dom.cntKaraoke.stop(true);
          dom.cntKaraoke.animate({
            scrollTop: top
          }, 300);
        }
      } else {
        self._tmp.pos = pos;
        self._tmp.scroll = 0;
        console.log("no es igual");
      }
    }
  };

  return jpKaraoke;

})();

karaoke = new jpKaraoke;

karaoke.ready();

filemp3 = "src/mp3/bruno_mars_2.mp3";

audio = $("<audio>");

audio.attr('src', filemp3);

audio.attr("controls", "controls");

$("body").append(audio);

audio[0].play();

audio.on('timeupdate', function(e) {
  var timeCurrent;
  timeCurrent = e.target.currentTime * 1000;
  karaoke.controlKaraoke(timeCurrent);
});
