
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
    }, 500, function() {
      return $(this).css('position', 'relative');
    });
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
      var divCurrent, paddingTop, top;
      self._tmp.scroll++;
      if (self._tmp.pos === pos) {
        if (self._tmp.scroll > 1) {
          console.log("libero scroll de " + pos);
        } else {
          divCurrent = $(self.str.itemKaraokePos(pos));
          paddingTop = 10;
          if (self._tmp.viewLyric === "normal") {
            self._tmp.top_current["normal"] = parseInt(dom.cntKaraoke.scrollTop() + divCurrent.position().top - (dom.cntKaraoke.height() / 2) + (divCurrent.height() / 2));
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
