### created by @juanpablocs21 ###
# reference: http://lrcgenerator.com/sync.js?20140905
class jpKaraoke

  #variables
  version = 1.0

  # keys (1,2)
  regexParseAll = /\[(\d{1,2}:[\d.]+)\]([^\[]+)?/g

  # keys (1,2)
  regexParseTime = /^\[(\d*)\:(.*)\]/i

  karaokesArray = []

  dom = {}

  rows = 4

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
  
  #metodos
  catchDom: () ->
    self = this
    dom.cntKaraoke = $(self.str.cntKaraoke)
    dom.lineKaraoke = $(self.str.lineKaraoke)
    dom.cntKaraokeLyric = $(self.str.cntKaraokeLyric)
    return
  ready: () ->
    this.createTimeLine()
    this.bindHtmlViewKaraoke()
    this.bindStyleHtml()
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
        console.log obj
        text = if(obj.text=="") then "" else "<p>"+obj.text+"</p>"
        tmp.push "<li class='"+self.str.itemKaraoke.replace('.','')+" "+self.str.itemKaraokePos(i).replace('.','')+"'>"+text+"</li>"
        return
       dom.cntKaraoke.html(tmp.join(''))
    return
  controlKaraoke: (time) ->
    self = this
    pos = 0
    i = 0
    heightMitad = self._tmp.cntHeight/2
    lineHeight = self._tmp.lineHeight/2
    time += 500
    
    while i < karaokesArray.length
      if(karaokesArray[i].time < time)
        pos = i
      else
        break
      i++
    itemKaraokePos = $(self.str.itemKaraokePos(pos))
    $(self.str.itemKaraoke).removeClass('active')
    itemKaraokePos.addClass('active')
    dom.cntKaraoke.stop(true)
    dom.cntKaraoke.scrollTo itemKaraokePos, 500,
        offset: -heightMitad + (lineHeight - 10)
        queue: !1
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
        #console.log scrapping
        while n < scrapping.length
          data = scrapping[scrapping.length - (n + 1)]
          if typeof data[2] != 'undefined'
            tmp = data[2]
        
          name = if typeof data[2] == 'undefined' then tmp else data[2]
          karaokesArray.push
            time: self.fn.parseTimeLrc(data[1])
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
      return r
    
#run
karaoke = new jpKaraoke
karaoke.ready()

#funcionalidad con musica
audio = new Audio("https://www.dropbox.com/s/yn3j0rduzho3uvj/bruno_mars_2.mp3?dl=1");
audio.addEventListener 'timeupdate', (e)->
  timeCurrent = e.target.currentTime * 1000
  karaoke.controlKaraoke(timeCurrent);
  return
audio.play()

#test