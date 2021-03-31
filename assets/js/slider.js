// slick slider
//- invoke kv slider not SCROLLEVT
$(".etf-slider-wrap").slick({
    autoplay: false,
    centerMode: false,
    infinite: false,
    arrows: true,
    centerPadding: "32px",
    slidesToShow: 1,
    pauseOnFocus: false,
    pauseOnHover: false,
});

$(".etf-group").slick({
    infinite: true,
    dots: true,
    slidesToShow: 3,
    slidesToScroll: 3,
    centerPadding: "32px",
    responsive: [
        {
            breakpoint: 1200,
            settings: {
                centerPadding: "20px",
                slidesToShow: 2,
                slidesToScroll: 2,
            },
        },
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
            },
        },
    ],
});


$("#notice-collapse").on("show.bs.collapse", function () {
    $("#notice-arrow").addClass("active"); // addClass
});
$("#notice-collapse").on("hide.bs.collapse", function () {
    $("#notice-arrow").removeClass("active");
});