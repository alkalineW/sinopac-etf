// declare tip
var tip = d3
  .tip()
  .attr('class', 'd3-tip')
  .html(function (d) {
    return (
      '<span class="text-center d-block">' +
      d.x +
      '</span><span>S&P500指數報酬率:' +
      d.y +
      '%</span>'
    )
  })
  .offset(function () {
    return [-10, 0]
  })

// Create Element.remove() function if not exist
if (!('remove' in Element.prototype)) {
  Element.prototype.remove = function () {
    if (this.parentNode) {
      this.parentNode.removeChild(this)
    }
  }
}

// old browser do NOT support nodeList.forEach()!!!
if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = function (callback, thisArg) {
    thisArg = thisArg || window
    for (var i = 0, l = this.length; i < l; i++) {
      callback.call(thisArg, this[i], i, this)
    }
  }
}

function rmClass(o, c) {
  o.classList.remove(c)
}

// chart data
var lineChartData = [
  {
    name: '1 year',
    date: [
      '2020/01/31',
      '2020/02/28',
      '2020/03/31',
      '2020/04/30',
      '2020/05/29',
      '2020/06/30',
      '2020/07/31',
      '2020/08/31',
      '2020/09/30',
      '2020/10/30',
      '2020/11/30',
      '2020/12/31',
    ],
    values: [
      -0.16, -8.56, -20.0, -9.85, -5.77, -4.04, 1.25, 8.34, 4.09, 1.21, 12.1,
      16.26,
    ],
  },
  {
    name: '3 year',
    date: ['2018/12/31', '2019/12/31', '2020/12/31'],
    values: [-6.24, 20.84, 40.49],
  },
  {
    name: '5 year',
    date: [
      '2016/12/30',
      '2017/12/29',
      '2018/12/31',
      '2019/12/31',
      '2020/12/31',
    ],
    values: [9.54, 30.81, 22.65, 58.07, 83.77],
  },
  {
    name: '10 year',
    date: [
      '2011/12/30',
      '2012/12/31',
      '2013/12/31',
      '2014/12/31',
      '2015/12/31',
      '2016/12/30',
      '2017/12/29',
      '2018/12/31',
      '2019/12/31',
      '2020/12/31',
    ],
    values: [
      0.0, 13.4, 46.97, 63.71, 62.52, 78.02, 112.59, 99.33, 156.89, 198.66,
    ],
  },
]

var lineChartWidth = parseInt(d3.select('.line-chart').style('width')),
  lineChartHeight = parseInt(d3.select('.line-chart').style('height')),
  linePadding = {
    top: 20,
    right: 40,
    left: 50,
    bottom: 40,
  },
  lineRealWidth = lineChartWidth - linePadding.left - linePadding.right,
  lineRealHeight = lineChartHeight - linePadding.top - linePadding.bottom,
  padding = {
    top: 10,
    right: 0,
    left: 10,
    bottom: 10,
  }

// 全局chart的尺寸
var scaleRatio = null,
  zoomInRatio = null,
  dataSet = null
var svg, valArrX, valArrY

// chart root ()
var lineChartCollection = document.getElementsByClassName('line-chart')
// var lineChartCollection = document.querySelectorAll(".line-chart");

iterateDomAndInsertD3object(
  lineChartCollection,
  lineChartData,
  lineChartWidth,
  lineChartHeight
)

// compare values in array
function compareVals(a, b) {
  return a - b
}

function iterateDomAndInsertD3object(dom, data, w, h) {
  var l = dom.length
  var chartSize = { w: w, h: h }

  for (var i = 0; i < l; i++) {
    getData(i, data)
    d3update(dom[i], chartSize)
  }
}

function initAndSortData(data, axisXarr, axisYarr, xName, yName) {
  return data.map(function (eachData) {
    var nuValX = parseInt(eachData[xName])
    var nuValY = parseInt(eachData[yName])
    axisXarr.push(nuValX)
    axisYarr.push(nuValY)
    return eachData
  })
}

function getData(i, data) {
  // 裝所有尺標值的 array
  // re-getData empty valArrX & valArrY，valArrX.length = 0 也可以
  valArrX = []
  valArrY = []
  // linechart的值不需要大小排序
  dataSet = []
  for (var k = 0; k < data[i].date.length; k++) {
    var nuItem = { x: data[i].date[k], y: data[i].values[k] }
    valArrY.push(data[i].values[k])
    valArrX.push(data[i].date[k])
    dataSet.push(nuItem)
  }
  valArrY.sort(compareVals)
}

function d3update(target, chartSize) {
  var svgMainColor =
    'linear-gradient( 30deg ,rgba(246,226,170) 0%, rgba(245,251,189) 80%)'
  svg = d3
    .select(target)
    .append('svg')
    .style('background', svgMainColor)
    .attr('width', chartSize.w)
    .attr('height', chartSize.h)

  d3drawAxis(svg, chartSize)
  d3drawLine(svg)
  d3drawCircle(svg)
}

function d3drawLine(target) {
  var linearGradient = target
    .append('defs')
    .append('linearGradient')
    .attr('id', 'gradient')
    .attr('gradientUnits', 'userSpaceOnUse')
    .attr('x1', 0)
    .attr('x2', lineRealWidth)
    .attr('y1', lineRealHeight)
    .attr('y2', lineRealHeight)

  linearGradient
    .append('stop')
    .attr('stop-color', 'rgba(0 , 190 , 193 ,1)')
    .attr('offset', 0)

  linearGradient
    .append('stop')
    .attr('stop-color', 'rgba(66 , 153 , 162 , 1)')
    .attr('offset', 1)

  target
    .append('path')
    .datum(dataSet)
    .attr('fill', 'none')
    .attr('stroke', 'url(#gradient)')
    .attr('stroke-width', 4)
    .attr(
      'd',
      d3
        .line()
        .x(function (d, i) {
          // console.log((i * lineRealWidth / (dataSet.length - 1)));
          return (i * lineRealWidth) / (dataSet.length - 1)
        })
        .y(function (d, i) {
          var bottomY = valArrY[0]
          var topY = valArrY[valArrY.length - 1]
          var yLength = topY - bottomY
          // console.log(`d.y: ${d.y}`);
          // console.log(
          // 	((d.y * lineRealHeight) / yLength) * -1 + lineRealHeight
          // );

          // return (d.y * 5)
          return (
            (((d.y - bottomY) * lineRealHeight) / yLength) * -1 + lineRealHeight
          )
        })
        .curve(d3.curveLinear)
      // .curve(d3.curveBasis)
    )
    .attr(
      'transform',
      'translate(' + linePadding.left + ' , ' + linePadding.top + ')'
    )

  // updateCircle.exit();
}

function d3drawAxis(target, chartSize) {
  var domainXMaxVal, domainXMinVal
  var domainYMaxVal = valArrY[valArrY.length - 1]
  var domainYMinVal = valArrY[0]

  var xScale, yScale, x_axis, y_axis, gaxisX, gaxisY // add scales to axis

  domainXMaxVal = valArrY.length - 1
  domainXMinVal = 0
  // max value on axis
  xScale = d3
    .scaleLinear()
    .domain([domainXMinVal, domainXMaxVal])
    .range([0, chartSize.w - linePadding.left - linePadding.right]) // axis length
  yScale = d3
    .scaleLinear()
    .domain([domainYMaxVal, domainYMinVal])
    .range([0, chartSize.h - linePadding.top - linePadding.bottom])

  x_axis = d3
    .axisBottom()
    .scale(xScale)
    .ticks(valArrX.length - 1)
  y_axis = d3
    .axisLeft()
    .scale(yScale)
    .ticks(valArrY.length - 1)

  gaxisX = target.append('g')
  gaxisY = target.append('g')

  x_axis.tickFormat(function (d) {
    var val = valArrX[d]
    // console.log(d);
    // console.log(val);
    // console.log(valArrX[d]);

    if (window.innerWidth < 1280) {
      // console.log(valArrX[d].slice(-1));
      val = valArrX[d].slice(0, 7)
    }
    return val
  })

  y_axis.tickFormat(function (d) {
    return d + '%'
  })
  gaxisX.attr(
    'transform',
    'translate(' +
      linePadding.left +
      ',' +
      (chartSize.h - linePadding.bottom) +
      ')'
  )
  gaxisY.attr(
    'transform',
    'translate(' + linePadding.left + ',' + linePadding.top + ')' + ''
  )

  gaxisX.call(x_axis)
  gaxisY.call(y_axis)

  // grid line
  gaxisX.selectAll('path').attr('stroke', '#a5a7a7').attr('stroke-width', 3)

  gaxisY.selectAll('path').attr('stroke', 'none')
  gaxisX
    .selectAll('line')
    .attr('y2', '' + -lineRealHeight)
    .attr('stroke', '#fcd44d')
  // - 移除最邊邊的ticks
  gaxisX
    .selectAll('text')
    .attr('fill', '#222')
    .attr('class', 'axis-x')
    .style('font-weight', 'bold')
    .each(function (d, i) {
      if (window.innerWidth < 1280 && valArrX.length > 5) {
        // valArrX=12
        if (i % 3 !== 0 && valArrX.length == 10) {
          this.remove()
        }
        if (
          i % 6 !== 5 &&
          i + 1 !== valArrX.length &&
          i !== 0 &&
          valArrX.length == 12
        ) {
          this.remove()
        }
      }
    })
  // .attr("transform", `translate(0, ${-padding.top * 2.5})`)
  gaxisY
    .selectAll('text')
    .attr('fill', '#222')
    // .style("font-size", "14px")
    .style('font-weight', 'bold')
    .attr('transform', 'translate(3, ' + -padding.top * 0.5 + ')')
  gaxisY
    .selectAll('line')
    .each(function (d) {
      if (d === 0) {
        var zeroY = d3.select(this)
        zeroY.attr('stroke-width', 3)
      }
    })
    .attr('x2', '' + -lineRealWidth)
    .attr('transform', 'translate(' + lineRealWidth + ', 0)')
    .attr('stroke', '#fcd44d')
}

function d3drawCircle(chartRootDom) {
  var updateCircle = chartRootDom.selectAll('circle').data(dataSet)
  var enterCircle = updateCircle.enter()

  // call tooltip in eachCircle
  // console.log(dataSet);
  // console.log(updateCircle);

  var exitCircle = updateCircle.exit()
  fillCircle(updateCircle)
  fillCircle(
    enterCircle
      .append('circle')
      .on('mouseover', handleMouseOver)
      .on('mouseout', handleMouseOut)
  )

  exitCircle.remove()
}

function handleMouseOver(d, i) {
  var colorArr = [
    '#66a222',
    '#c62f70',
    '#00aedb',
    '#a200ff',
    '#f47835',
    '#d41243',
  ]
  var colorIndex
  var x = d3.event.x

  if (i >= colorArr.length) {
    colorIndex = i % colorArr.length
  } else {
    colorIndex = i
  }
  // show tip
  tip.show(d, this)
  console.log('posX:' + x)

  // when device width smaller than 768px tip position
  detectTipPos(tip, window.innerWidth, x)

  d3.select(this).classed('aniDots', true).attr('stroke', colorArr[colorIndex])
}

function detectTipPos(target, deviceWidth, evtX) {
  var tipMaxWidth
  if (deviceWidth < 576) {
    tipMaxWidth = 196
  } else if (deviceWidth < 768 && deviceWidth > 576) {
    tipMaxWidth = 262
  } else {
    tipMaxWidth = 326
  }

  // left exceed & right exceed
  if (evtX < tipMaxWidth / 2) {
    target.style('left', 0 + 'px')
  } else if (evtX + tipMaxWidth / 2 > deviceWidth) {
    target.style('left', 'unset')
    target.style('right', '0')
  } else {
    target.style('left', evtX - tipMaxWidth / 2 + 'px')
    target.style('right', 'unset')
  }
}

function handleMouseOut(d) {
  // hide tip
  tip.hide(d, this)
  d3.select(this).classed('aniDots', false).attr('stroke', 'none')
}

function fillCircle(target) {
  // color array
  var colorArr = [
    '#66a222',
    '#c62f70',
    '#00aedb',
    '#a200ff',
    '#f47835',
    '#d41243',
  ]
  var circleXpos = null,
    circleYpos = null

  target.call(tip)

  target
    .attr('fill', function (d, i) {
      var colorIndex
      if (i >= colorArr.length) {
        colorIndex = i % colorArr.length
      } else {
        colorIndex = i
      }
      return colorArr[colorIndex]
    })
    // circle 's x position
    .attr('cx', function (d, i) {
      circleXpos = parseInt(
        (i * lineRealWidth) / (dataSet.length - 1) + linePadding.left
      )
      return parseInt(
        (i * lineRealWidth) / (dataSet.length - 1) + linePadding.left
      )
    })
    // circle 's y position
    .attr('cy', function (d, i) {
      // console.log(d.y);
      var bottomY = valArrY[0]
      var topY = valArrY[valArrY.length - 1]
      var yLength = topY - bottomY
      var posY = parseInt(
        (((d.y - bottomY) * lineRealHeight) / yLength) * -1 + lineRealHeight
      )
      // console.log(posY);

      circleYpos = posY + linePadding.top

      return posY + linePadding.top
    })
    .attr('r', function () {
      var dSize = 10
      if (window.innerWidth > 768) {
        dSize = 10
      } else {
        dSize = 8
      }
      return dSize
    })
    .attr('class', 'circleSvg')
}

var rangeSliderCont = document.getElementsByClassName('range-slider-cont')
var rangeSliderVal = 0,
  rangeSliderOrient = null
var mediaQuery = window.matchMedia('(max-width: 768px)')

// replacing values when change range slide

var accuProfit = document.getElementById('accu-profit')
var yearSpan = document.getElementById('year-span')
var snowBall = document.getElementById('snow-ball')
var snowPeopleImg =
  document.getElementsByClassName('snow-people')[0].children[0]
var snowballWrap = document.getElementById('snowball-wrap')
var snowInnerBubble = document.getElementById('snow-bubble')

function verifyRangeSliderOrient(e) {
  if (e.matches) {
    rangeSliderOrient = 'horizontal'
    console.log('small than 768')
  } else {
    rangeSliderOrient = 'vertical'
  }
  $('#rangeSlider').slider({
    orientation: rangeSliderOrient,
    range: 'min',
    value: 0,
    min: 0,
    max: 3,
    step: 1,
    create: function () {
      var sliderWrap = $(this).parent().parent() // this = slider ui dom
      var lapse = null
      window.innerWidth <= 768 ? (lapse = 4000) : (lapse = 6000)
      sliderWrap.addClass('disable')
      setTimeout(function () {
        sliderWrap.removeClass('disable')
      }, lapse)
    },
    change: function (event, ui) {
      // reset ui-handle positioning effect
      var uiSliderHandle =
        document.getElementsByClassName('ui-slider-handle')[0]
      if (this.classList.contains('ui-slider-vertical')) {
        switch (ui.value) {
          case 0:
            uiSliderHandle.style.bottom = '0%'
            break
          case 1:
            uiSliderHandle.style.bottom = '33.3%'
            break
          case 2:
            uiSliderHandle.style.bottom = '66.6%'
            break
          default:
            uiSliderHandle.style.bottom = '100%'
        }
      } else {
        switch (ui.value) {
          case 0:
            uiSliderHandle.style.left = '0%'
            break
          case 1:
            uiSliderHandle.style.left = '33.3%'
            break
          case 2:
            uiSliderHandle.style.left = '66.6%'
            break
          default:
            uiSliderHandle.style.left = '100%'
        }
      }

      var preventSliderVal = rangeSliderVal
      console.log(
        'preventSliderVal:' + preventSliderVal + ', ui.value:' + ui.value
      )

      // prevent mutiple click on same item
      if (preventSliderVal !== ui.value) {
        var lapse = null
        window.innerWidth <= 768 ? (lapse = 4000) : (lapse = 6000)
        $(event.target).parent().parent().addClass('disable')
        $('.d3-tip').css('opacity', '0')
        rangeSliderVal = ui.value
        showCorrespondArea(rangeSliderCont, rangeSliderVal)
        setTimeout(function () {
          $(event.target).parent().parent().removeClass('disable')
        }, lapse)
      } else {
        // console.log('changed');
        return false
      }
    },
  })
}

verifyRangeSliderOrient(mediaQuery)
mediaQuery.addListener(verifyRangeSliderOrient)

function showCorrespondArea(target, index) {
  var yearSpanArr = ['1', '3', '5', '10']
  var snowBallBubbleInfo = [
    "假設您在<span class='sp'>2020</span>年期間<br>投資 S&P500 指數累積報酬率為：<span class='sp'>+16.26%</span>，<br>你滾出了一顆小雪球，但其實還有更大的<br>切換時間點找出大雪球吧",
    "假設您在<span class='sp'>2018</span>年至<span class='sp'>2020</span>年間<br>投資 S&P500 指數累積報酬率為：<span class='sp'>+40.49%</span>，<br>你滾出了一顆中雪球，但其實還有更大的！<br>切換時間點找出大雪球吧！",
    "假設您在<span class='sp'>2016</span>年至<span class='sp'>2020</span>年間<br>投資 S&P500 指數累積報酬率為：<span class='sp'>+83.77%</span>，<br>你滾出了一顆中雪球，但其實還有更大的！<br>切換時間點找出大雪球吧！",
    "假設您在<span class='sp'>2011</span>年至<span class='sp'>2020</span>年間<br>投資 S&P500 指數累積報酬率為：<span class='sp'>+198.66%</span>，<br>恭喜你！滾出了一顆大雪球！<br>掌握長期投資心法，你也有機會滾出大雪球！",
  ]
  var snowBallBubbleInfoShirnk = [
    "S&P500指數報酬率為:<span class='sp'>+16.26%</span><br>你滾出了一顆小雪球",
    "S&P500指數報酬率為:<span class='sp'>+40.49%</span><br>你滾出了一顆中雪球",
    "S&P500指數報酬率為:<span class='sp'>+83.77%</span><br>你滾出了一顆中雪球",
    "S&P500指數報酬率為:<span class='sp'>+198.66%</span><br>恭喜你！滾出了一顆大雪球！掌握長期投資心法，你也有機會滾出大雪球！",
  ]
  for (var i = 0, l = target.length; i < l; i++) {
    target[i].classList.add('hide')
    if (i === index) {
      target[i].classList.remove('hide')
      // replace values
      accuProfit.innerHTML = lineChartData[i].values.slice(-1) + '%'
      yearSpan.innerHTML = yearSpanArr[i]

      // change content text when on smaller device
      if (window.innerWidth > 992) {
        snowInnerBubble.innerHTML = snowBallBubbleInfo[i]
      } else {
        snowInnerBubble.innerHTML = snowBallBubbleInfoShirnk[i]
      }

      // change snowBall size
      snowBallWrapAniStagger(i)
    }
  }
}

function snowBallWrapAniStagger(i) {
  var snowBallSizeArr = ['100', '130', '150', '200']
  var snowBallSize = snowBallSizeArr[i]
  var snowWrapLeftVal = snowBallSize * 1 + 60
  var walkingLapse = 6

  if (window.innerWidth <= 768) {
    snowBallSize = snowBallSizeArr[i] * 0.5
    snowWrapLeftVal = snowBallSize * 1 + 20
    walkingLapse = 4
  }

  gsap.fromTo(
    '#snowball-wrap',
    {
      left: snowBallSize + 'px',
      onStart: function () {
        snowPeopleImg.classList.add('active')
        snowInnerBubble.style.display = 'none'
      },
    },
    {
      duration: walkingLapse,
      left: 'calc(100% - ' + snowWrapLeftVal + 'px)',
      onComplete: snowComplete,
      onCompleteParams: [snowWrapLeftVal],
    }
  )
  gsap.fromTo(
    '#snow-ball',
    { width: snowBallSize * 0.7 + 'px' },
    { duration: walkingLapse, width: snowBallSize + 'px' }
  )
}

// kv pop up
function keyVisualPopup() {
  var cardElm = document.querySelectorAll('.ani-deco')
  cardElm.forEach(function (e) {
    rmClass(e, 'op')
  })
  gsap.fromTo(
    '.ani-deco',
    { opacity: 0, scale: 0.5 },
    { duration: 0.5, opacity: 1, scale: 1 }
  )
}

function snowComplete(refPos) {
  snowPeopleImg.classList.remove('active')
  var leftVal = refPos
  var snowInnerBubblePosX = null
  window.innerWidth > 992
    ? (snowInnerBubblePosX = leftVal + 380 + 110)
    : (snowInnerBubblePosX = 'unset')
  snowInnerBubble.style.left = 'calc(100% - ' + snowInnerBubblePosX + 'px)'
  snowInnerBubble.style.display = 'block'
}

showCorrespondArea(rangeSliderCont, rangeSliderVal)

keyVisualPopup()

function replaceUihandle() {
  var uiSliderHandle = document.getElementsByClassName('ui-slider-handle')[0]
  var anchorHandle = document.createElement('button')
  var uiSliderHandleIndex
  // copy attribute
  for (
    uiSliderHandleIndex = uiSliderHandle.attributes.length - 1;
    uiSliderHandleIndex >= 0;
    --uiSliderHandleIndex
  ) {
    anchorHandle.attributes.setNamedItem(
      uiSliderHandle.attributes[uiSliderHandleIndex].cloneNode()
    )
  }

  uiSliderHandle.parentNode.replaceChild(anchorHandle, uiSliderHandle)
}
replaceUihandle()
