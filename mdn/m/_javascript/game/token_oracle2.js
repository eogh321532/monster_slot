
var oracle2_status = 0;	// 0:충전, 1:환전
var timer_token;
$( document ).ready(function() {
	timer_token = window.setInterval("toTimerToken()", 1000);
});
 
$(window).on("beforeunload", function() {
	clearInterval(timer_token);
});

function toTimerToken() {
	$.ajax({
		type: "post",
		url: $path['url']+"ajax",
		data: { 
			'action': 'member_token_oracle2',
			'value': '머니조회',
		},
		dataType: "json",
		success : function(response) {
			$("#p_casino").text(response.data);
			current_oracle = response.data;
			current_oracle = parseInt(current_oracle.replace(",", ""));
		},
		error: function(xhr, status) {
		}
	});
}

function on_oracle_status() {
	if(oracle2_status == 0)
		oracle2_status = 1;
	else
		oracle2_status = 0;
	if(oracle2_status == 0) {
		$("#p_amount_charge").val( number_format(current_cash) );
	} else {
		$("#p_amount_charge").val( number_format(current_oracle) );
	}
}

function on_oracle2() {
	if(oracle2_status == 0)
		on_charge();
	else
		on_exchange();
}

function on_charge() {
	$.ajax({
		type: "post",
		url: $path['url']+"ajax",
		data: { 
			'action': 'member_token_oracle2',
			'value': '충전',
			'amount': $("#p_amount_charge").val()
		},
		dataType : "json",
		success: function(response) {
			alert("처리되었습니다.");
			location.reload();
		},
		error: function(xhr, status) {
			alert('[' + status + ']\n\n' + xhr.responseText);
		}
	});
}

function on_exchange() {
	$.ajax({
		type: "post",
		url: $path['url']+"ajax",
		data: { 
			'action': 'member_token_oracle2',
			'value': '환전',
		},
		dataType : "json",
		success: function(response) {
			alert("처리되었습니다.");
			location.reload();
		},
		error: function(xhr, status) {
			alert('[' + status + ']\n\n' + xhr.responseText);
		}
	});
}
