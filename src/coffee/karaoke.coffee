### created by @juanpablocs21 ###
# reference: http://lrcgenerator.com/sync.js?20140905
class jpKaraoke

  #variables
  version = 1.0

  # keys (1,2)
  regexParseAll = /\[(\d{1,2}:[\d.]+)\]([^\[]+)?/g

  # keys (1,2)
  regexParseTime = /^(\d*)\:(.*)/i

  karaokesArray = []

  dom = {}

  rows = 3

  str:
    cntKaraoke:"#karaoke"
    lineKaraoke: "#karaoke li p"
    cntKaraokeLyric: "#karaokeText"
    itemKaraoke: ".karaoke"
    itemKaraokePos: (pos)->
      return ".karaoke_"+pos
  _tmp:
    cntHeight:0
    lineHeight:0
    scroll: 0
    pos: 0
  
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
  ready: () ->
    this.createTimeLine()
    this.bindHtmlViewKaraoke()
    this.bindStyleHtml()
    this.suscribeEvents()
    console.log "ready"
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
        tmp.push "<li class='"+self.str.itemKaraoke.replace('.','')+" "+self.str.itemKaraokePos(i).replace('.','')+"' data-time='"+obj.time+"'>"+text+"</li>"
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
  
  createTimeLine:() ->
    self = this
    self.catchDom()
    lyric = dom.cntKaraokeLyric.text()
    lines = lyric.split(/\n/g);
    l = 0
    while l < lines.length
      self.fn.timeLine(lines[l])
      l++
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
          top = (divCurrent[0].offsetTop) - self._tmp.cntHeight
          console.log top
          $(self.str.itemKaraoke).removeClass('active')
          divCurrent.addClass('active')
          dom.cntKaraoke.stop(true)
          dom.cntKaraoke.animate({scrollTop: top }, 300)
      else
        self._tmp.pos = pos
        self._tmp.scroll = 0
        console.log "no es igual"

      return
    
#run
karaoke = new jpKaraoke
karaoke.ready()


# filemp3 = "https://www.dropbox.com/s/yn3j0rduzho3uvj/bruno_mars_2.mp3?dl=1"
filemp3 = "src/mp3/bruno_mars_2.mp3"
audio = $("<audio>")
audio.attr('src', filemp3)
audio.attr("controls", "controls")
$("body").append(audio)
audio[0].play()
audio.on 'timeupdate', (e) ->
  timeCurrent = e.target.currentTime * 1000
  karaoke.controlKaraoke(timeCurrent);
  return

#funcionalidad con musica
# audio = new Audio(filemp3);
# audio.addEventListener 'timeupdate', (e)->
#   timeCurrent = e.target.currentTime * 1000
#   karaoke.controlKaraoke(timeCurrent);
#   return
# audio.play()

#test