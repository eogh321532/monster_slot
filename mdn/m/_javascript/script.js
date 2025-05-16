$(function(){

	$('.util_btn1').click(function(){
		$('#login').css('display','flex');
	});
	$('.util_btn2').click(function(){
		$('#join').css('display','flex');
	});	
	$('.join_open').click(function(){
		$('#join').css('display','flex');
		$('#login').css('display','none');
	});		
	$('.login_close').click(function(){
		$('#login').css('display','none');
	});	
	$('.join_close').click(function(){
		$('#join').css('display','none');
	});	
	

	
	var swiper = new Swiper({
		el: '.m_notice',
		slidesPerView: 1, //레이아웃 뷰 개수 
		spaceBetween: 0,    // 슬라이드 사이 여백
		centeredSlides: true,    //센터모드
		direction: 'vertical',
		loop : true,   // 슬라이드 반복 여부
		autoplay: {
		  delay: 5000,
		  disableOnInteraction: false,
		},
		loopAdditionalSlides : 1, // 슬라이드 반복 시 마지막 슬라이드에서 다음 슬라이드가 보여지지 않는 현상 수정
		slideToClickedSlide : true, // 해당 슬라이드 클릭시 슬라이드 위치로 이동
		initialSlide: 0,
		grabCursor: true,
		scrollbar: {
		  el: '.swiper-scrollbar',
		},
		mousewheel: {
		  enabled: false,
		},
		keyboard: {
		  enabled: false,
		}			
	});			
});
