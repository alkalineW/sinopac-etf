$(function () {
	// 用 bootstrap 4.41 實現 menuIcon 動畫效果
	var navMenuIcon = document.getElementById('navMenuIcon');
	var menuIconCollapsed = true; // flag for detect collapsed or not
	function menuIconAni(targetElm) {
		var iconbar = $('.iconbar');
		if (menuIconCollapsed) {
			menuIconCollapsed = !menuIconCollapsed; // set menuIconCollapsed from true to false
			iconbar.addClass('open');

			console.log($(targetElm).closest(".navbar"));


			$(targetElm).closest(".navbar").css('background', '#fcebca');
		} else {
			iconbar.removeClass('open');
			$(targetElm).closest(".navbar").css('background', 'rgba(255, 255, 255, 0.6)');
			menuIconCollapsed = true
		}
	}

	navMenuIcon.addEventListener("click", function () {
		console.log(this);
		menuIconAni(this);
		// $('.navbar').css("background-color", "rgba(255,255,255,.6)");
	});
})