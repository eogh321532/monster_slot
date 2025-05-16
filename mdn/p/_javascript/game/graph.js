
var graph_status = 0;	// 0:충전, 1:환전
var timer_graph;
$( document ).ready(function() {
	timer_graph = window.setInterval("toTimerGraph()", 1000);
});
 
$(window).on("beforeunload", function() {
	clearInterval(timer_graph);
});

function toTimerGraph() {
	$.ajax({
		type: "post",
		url: $path['url']+"ajax",
		data: { 
			'action': 'minigame',
			'value': 'read_graph_cash',
		},
		dataType: "json",
		success : function(response) {
			$("#p_casino").text(response.data);
			current_graph = response.data;
			current_graph = parseInt(current_graph.replace(",", ""));
		},
		error: function(xhr, status) {
		}
	});
}

function on_graph_status() {
	if(graph_status == 0)
		graph_status = 1;
	else
		graph_status = 0;
	if(graph_status == 0) {
		$("#p_amount_charge").val( number_format(current_cash) );
	} else {
		$("#p_amount_charge").val( number_format(current_graph) );
	}
}

function on_graph() {
	if(graph_status == 0) {
		on_charge();
	} else {
		on_exchange();
	}
}

function on_charge() {
	$.ajax({
		type: "post",
		url: $path['url']+"ajax",
		data: { 
			'action': 'member_graph',
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
			'action': 'member_graph',
			'value': '환전',
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
