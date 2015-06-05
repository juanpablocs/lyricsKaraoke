### created by @juanpablocs21 ###

# reference: http://lrcgenerator.com/sync.js?20140905
class karaoke

  #variables
  version = 1.0

  # keys (1,2)
  regexParseAll = /\[(\d{1,2}:[\d.]+)\]([^\[]+)?/g

  # keys (1,2)
  regexParseTime = /^(\d*)\:(.*)/i

  karaokesArray = []

  dom = {}

  rows = 3

  debug = true

  str:
    cntKaraoke:"#karaoke"
    lineKaraoke: "#karaoke li p"
    itemKaraoke: ".karaoke"
    itemKaraokePos: (pos)->
      return ".karaoke_#{pos}"
  _tmp:
    cntHeight:0
    lineHeight:0
    scroll: 0
    pos: 0
    viewLyric: null
    top_current: []
  #metodos
  catchDom: () ->
    self = this
    dom.cntKaraoke = $(self.str.cntKaraoke)
    dom.lineKaraoke = $(self.str.lineKaraoke)
    dom.cntKaraokeLyric = $(self.str.cntKaraokeLyric)
    return
  suscribeEvents: () ->
    self = this
    dom.cntKaraoke.on 'click', 'li', (e) ->
      that = $(@)
      currentTime = that.data('time')/1000
      $("audio")[0].currentTime = currentTime
      return

    return
  karaokeInit: (op, lyric) ->
    this._tmp.viewLyric = op
    this.prepareKaraoke(lyric)
    this.bindHtmlViewKaraoke()
    this.bindStyleHtml()
    this.suscribeEvents()
    this.setViewLyricLayoutAction(op)
    return
  
  bindStyleHtml: () ->
    self = this
    self.catchDom()
    self._tmp.lineHeight = dom.lineKaraoke.outerHeight()
    self._tmp.cntHeight = self._tmp.lineHeight*rows
    dom.cntKaraoke.animate({height: self._tmp.cntHeight+"px" },500)
    return
  bindHtmlViewKaraoke: () ->
    self = this
    tmp = []
    if(karaokesArray.length>0)
      $.each karaokesArray, (i, obj)->
        text = if(obj.text=="") then "" else "<p>"+obj.text+"</p>"
        itmcls = self.str.itemKaraoke.replace('.','')
        itmcls2 = self.str.itemKaraokePos(i).replace('.','')
        tmp.push "<li class='#{itmcls} #{itmcls2}' data-time='#{obj.time}'>#{text}</li>"
        return
       dom.cntKaraoke.html(tmp.join(''))
    return
  controlKaraoke: (time) ->
    self = this
    pos = 0
    i = 0
    time += 500
    
    while i < karaokesArray.length
      if(karaokesArray[i].time < time)
        pos = i
      else
        break
      i++
    self.fn.scrollTop(self,pos)
    return
  
  prepareKaraoke:(lyric) ->
    self = this
    self.catchDom()
    lines = lyric.split(/\n/g)
    l = 0
    while l < lines.length
      self.fn.timeLine(lines[l])
      l++
    return
  setViewLyricLayoutAction: (op) ->
    self = this
    switch op
        when "view-scroll"
          dom.cntKaraoke.attr('class', 'view-scroll')
        else
          dom.cntKaraoke.attr('class', 'view-normal')
    return
  log: (msg) ->
    console?.log msg if debug
    return
  fn:
    timeLine:(line) ->
      #console.log line
      self = this
      scrapping = regexParseAll.execAll(line.trim())
      if(scrapping.length>0)
        n = 0
        tmp = ""
        while n < scrapping.length
          data = scrapping[scrapping.length - (n + 1)]
          if typeof data[2] != 'undefined'
            tmp = data[2]
        
          name = if typeof data[2] == 'undefined' then tmp else data[2]
          karaokesArray.push
            time: self.parseTimeLrc(data[1])
            time_parsed: data[1]
            text: name
          n++
          karaokesArray.sort (a, b) ->
            if a.time > b.time then 1 else if a.time < b.time then -1 else 0

      return
    parseTimeLrc: (str) ->
      time = str.match(regexParseTime)
      if(time)
        r = (parseInt(time[1])*60) + parseInt(time[2])
      else
        r = 0
      return r*1000
    scrollTop: (self,pos) ->
      self._tmp.scroll++
      if self._tmp.pos==pos
        if(self._tmp.scroll>1)
          console.log "libero scroll de "+pos
        else
          divCurrent = $(self.str.itemKaraokePos(pos))
          if(self._tmp.viewLyric=="normal")
            self._tmp.top_current["normal"] = divCurrent[0].offsetTop - 80
            # dom.cntKaraoke.attr('class', 'view-normal')
          else
            self._tmp.top_current["scroll"] = (divCurrent[0].offsetTop) - self._tmp.cntHeight
            # dom.cntKaraoke.attr('class', 'view-scroll')
          
          console.log top
          $(self.str.itemKaraoke).removeClass('active')
          divCurrent.addClass('active')
          dom.cntKaraoke.stop(true)
          dom.cntKaraoke.animate({scrollTop: self._tmp.top_current[self._tmp.viewLyric] }, 300)
      else
        self._tmp.pos = pos
        self._tmp.scroll = 0
        console.log "no es igual"

      return
