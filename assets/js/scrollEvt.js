//- Math.floor function
function MathFloor(val) {
	return Math.floor(val);
}

function addClass(e, className) {
	e.classList.add(className);
}


var cachedWidth = $(window).width();

var scrollBtn = document.getElementsByClassName("btn-outline-primary mx-auto");
var etfTopic = document.getElementsByClassName("etf-topic");


function scrollBtnScroll(elm) {
	var isClicked = false; // set isScrolling flag prevent mutiple scroll evt
	for (var i = 0, l = elm.length; i < l; i++) {
		elm[i].addEventListener("click", function (evt) {
			evt.preventDefault();
			isClicked = true;
			if (isClicked) {
				var anchorTarget = "#" + $(this).attr("data-target");
				var targetDOM = $(anchorTarget);
				var targetDOMPosY;
				targetDOMPosY = targetDOM.offset().top - 45; // minus top-nav-menu height

				$("html , body").animate(
					{ scrollTop: targetDOMPosY },
					800,
					function () {
						isClicked = false;
					}
				);
			}
		});
	}
}

scrollBtnScroll(scrollBtn);
scrollBtnScroll(etfTopic);


// mobile scrolled down will fire resize evt
$(window).resize(function () {
	var newWidth = $(window).width();
	if (newWidth !== cachedWidth) {
		//DO RESIZE HERE
		cachedWidth = newWidth;
		location.reload();
		return false;
	}
});

var secDotPlace = document.getElementById("sec-dots-wrap");
var secDotsTarget = document.getElementsByTagName("section");
var anchorCont = ["", "ETF介紹", "巴菲特的操作", "", "ETF趨勢", "ETF實驗室", "知識文章", "注意事項"];

// append section dots
for (var i = 0, l = secDotsTarget.length; i < l; i++) {
	var secDotAnchor = document.createElement('a');
	secDotAnchor.className = 'sec-dot-anchor';
	secDotAnchor.setAttribute("data-target", secDotsTarget[i].id);
	secDotAnchor.innerHTML = "<span class='anchor-text'>" + anchorCont[i] + "</span>";
	secDotPlace.appendChild(secDotAnchor);
}

var anchorDots = document.getElementsByClassName("sec-dot-anchor");
var navItem = document.getElementsByClassName("nav-item");
var idx;

// hit section
$("section")
	.waypoint(function (direction) {
		idx = $(this.element).index();
		console.log(`idx:${idx}`)
		loopThroughElm(anchorDots, idx);
		if (idx !== 0) {
			anchorDots[idx].classList.add('active');
		} else if (idx === 0) {
			anchorDots[0].classList.add('active');
		} else {
			if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
				alert('bottom');
				anchorDots[dotslength].classList.add('active');
			}
		}
	}, {
		offset: "50%"
	})

window.onscroll = function (ev) {
	// if scroll to top of page
	if (window.scrollY == 0) {
		anchorDots[0].classList.add('active');
		anchorDots[idx].classList.remove('active');
	}
	// if scroll to bottom of page
	if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
		loopThroughElm(anchorDots, idx);
		anchorDots[anchorDots.length - 2].classList.remove('active');
		anchorDots[anchorDots.length - 1].classList.add('active');
	}
};

function loopThroughElm(elms, currentIndex) {
	var length = elms.length;
	for (var k = 0; k < length; k++) {
		if (k !== currentIndex) {
			elms[k].classList.remove('active');
		}
	}
}

scrollBtnScroll(anchorDots);
scrollBtnScroll(navItem);