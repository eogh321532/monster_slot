
var token_status = 0;	// 0:충전, 1:환전
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
			'action': 'minigame',
			'value': 'read_token_cash',
		},
		dataType: "json",
		success : function(response) {
			$("#p_top_money_token").text(response.data);
			current_token = response.data;
			current_token = parseInt(current_token.replace(",", ""));
		},
		error: function(xhr, status) {
		}
	});
}

function on_token_status() {
	if(token_status == 0)
		token_status = 1;
	else
		token_status = 0;
	if(token_status == 0) {
		$("#p_amount_charge").val( number_format(current_cash) );
	} else {
		$("#p_amount_charge").val( number_format(current_token) );
	}
}

function on_token() {
	if(token_status == 0)
		on_charge();
	else
		on_exchange();
}

function on_charge() {
	$.ajax({
		type: "post",
		url: $path['url']+"ajax",
		data: { 
			'action': 'member_token',
			'value': '충전',
			'amount': $("#p_amount_charge").val()
		},
		dataType : "json",
		success: function(response) {
			if(response.result == 0) {
				alert( response.err );
				return;
			}
			
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
			'action': 'member_token',
			'value': '환전',
		},
		dataType : "json",
		success: function(response) {
			if(response.result == 0) {
				alert( response.err );
				return;
			}
			
			alert("처리되었습니다.");
			location.reload();
		},
		error: function(xhr, status) {
			alert('[' + status + ']\n\n' + xhr.responseText);
		}
	});
}
