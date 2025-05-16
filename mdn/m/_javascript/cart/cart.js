
$(document).ready(function(e){
	$(".cart_title").bind("click", onMoving);
})

// 하단에서 나오는 메뉴
var current_cart_mode = false;
function onMoving() {
	onCartMoving(current_cart_mode);
}

function onCartMoving(hide) {
	$cartWrap = $(".cart_wrap");
	$cartWrap.stop();
	if (hide) {
		current_cart_mode = false;
		$cartWrap.animate({bottom:-305},500);
		$(".cart_down").hide();
		$(".cart_up").show();
	} else {
		current_cart_mode = true;
		$cartWrap.animate({bottom:0},500);
		$(".cart_down").show();
		$(".cart_up").hide();
	}
}