RegExp.prototype.execAll=function(b){for(var a=null,c=[];a=this.exec(b);){var e=[];for(i in a)parseInt(i)==i&&e.push(a[i]);c.push(e)}return c};

/* created by @juanpablocs21 */
var audio, jpKaraoke, karaoke;

jpKaraoke = (function() {
  var dom, karaokesArray, regexParseAll, regexParseTime, rows, version;

  function jpKaraoke() {}

  version = 1.0;

  regexParseAll = /\[(\d{1,2}:[\d.]+)\]([^\[]+)?/g;

  regexParseTime = /^(\d*)\:(.*)/i;

  karaokesArray = [];

  dom = {};

  rows = 4;

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
    lineHeight: 0
  };

  jpKaraoke.prototype.catchDom = function() {
    var self;
    self = this;
    dom.cntKaraoke = $(self.str.cntKaraoke);
    dom.lineKaraoke = $(self.str.lineKaraoke);
    dom.cntKaraokeLyric = $(self.str.cntKaraokeLyric);
  };

  jpKaraoke.prototype.ready = function() {
    this.createTimeLine();
    this.bindHtmlViewKaraoke();
    this.bindStyleHtml();
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
        tmp.push("<li class='" + self.str.itemKaraoke.replace('.', '') + " " + self.str.itemKaraokePos(i).replace('.', '') + "'>" + text + "</li>");
      });
      dom.cntKaraoke.html(tmp.join(''));
    }
  };

  jpKaraoke.prototype.controlKaraoke = function(time) {
    var heightMitad, i, itemKaraokePos, lineHeight, pos, self;
    self = this;
    pos = 0;
    i = 0;
    heightMitad = self._tmp.cntHeight / 2;
    lineHeight = self._tmp.lineHeight / 2;
    time += 500;
    while (i < karaokesArray.length) {
      if (karaokesArray[i].time < time) {
        pos = i;
      } else {
        break;
      }
      i++;
    }
    itemKaraokePos = $(self.str.itemKaraokePos(pos));
    $(self.str.itemKaraoke).removeClass('active');
    itemKaraokePos.addClass('active');
    dom.cntKaraoke.stop(true);
    dom.cntKaraoke.scrollTo(itemKaraokePos, 500, {
      offset: -heightMitad + (lineHeight - 10),
      queue: !1
    });
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
    }
  };

  return jpKaraoke;

})();

karaoke = new jpKaraoke;

karaoke.ready();

audio = new Audio("https://www.dropbox.com/s/yn3j0rduzho3uvj/bruno_mars_2.mp3?dl=1");

audio.addEventListener('timeupdate', function(e) {
  var timeCurrent;
  timeCurrent = e.target.currentTime * 1000;
  karaoke.controlKaraoke(timeCurrent);
});

audio.play();
