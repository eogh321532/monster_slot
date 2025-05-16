
var m_list = new Array();
var m_episode = 0;

function find(game_event_sn)
{
	for(var i=0; i<m_list.length; ++i) {
		if(m_list[i]['game_event_sn'] == game_event_sn) {
			return m_list[i];
		}
	}

	return -1;
}

function is(game_event_sn, position, episode, league_sub)
{
	for(var i=0; i<m_list.length; ++i) {
		if(
			m_list[i]['game_event_sn'] == game_event_sn && 
			m_list[i]['position'] == position && m_list[i]['episode'] == episode && 
			m_list[i]['league_sub']==league_sub
		) {
			return true;
		}
	}

	return false;
}

function is2(game_event_sn, episode, league_sub)
{
	for(var i=0; i<m_list.length; ++i) {
		if(
			m_list[i]['game_event_sn'] == game_event_sn && 
			m_list[i]['episode'] == episode && 
			m_list[i]['league_sub']==league_sub
		) {
			return true;
		}
	}

	return false;
}

function get_odds_selected()
{
	if(m_list.length <= 0)
		return 0;

	var odds_selected = 1;
	for(var i=0; i<m_list.length; ++i) {
		odds_selected *= m_list[i]['odds'];
	}

	return parseFloat(odds_selected).toFixed(2);

	//return Math.floor(odds_selected*100)/100;
}

function toggle(node)
{	
	$(node).addClass("pick");
}

function toggle_clear()
{
	$(".game").removeClass("on");
	$(".game").removeClass("g_gr_o");
	$(".game").removeClass("active");
	$(".game").removeClass("clicked");

	$(".home").removeClass("pick");
	$(".away").removeClass("pick");
	$(".draw").removeClass("pick");
}

function on_selected_team(game_event_sn, node, position, odds, selected, episode, league_sub)
{
	
	// 겹치지않게 처리
	switch(league_sub) {
		case 480:
		case 477:
		case 476:
		case 1868:
		case 1865:
		case 1864:
			// ui 지우고
			toggle_clear();
			// 
			if(league_sub == 480) {
				on_delete2(game_event_sn, 476);
				on_delete2(game_event_sn, 477);
			}
			if(league_sub == 477) {
				on_delete2(game_event_sn, 476);
				on_delete2(game_event_sn, 480);
			}
			if(league_sub == 476) {
				on_delete2(game_event_sn, 477);
				on_delete2(game_event_sn, 480);
			}
			if(league_sub==1864) {
				on_delete2(game_event_sn, 1865);
				on_delete2(game_event_sn, 1868);
			}
			if(league_sub==1865) {
				on_delete2(game_event_sn, 1864);
				on_delete2(game_event_sn, 1868);
			}
			if(league_sub==1868) {
				on_delete2(game_event_sn, 1865);
				on_delete2(game_event_sn, 1864);
			}
		
			if(is(game_event_sn, position, episode, league_sub)) {
				on_delete2(game_event_sn, league_sub);
			} else {
				if(is2(game_event_sn, episode, league_sub))
					on_delete2(game_event_sn, league_sub);
				on_add(game_event_sn, position, odds, selected, episode, league_sub, node);
			}
		
			display_betting_slip();
			return;
	}
	
	
	
	toggle_clear();

	if(is(game_event_sn, position, episode, league_sub)) {
		on_delete(game_event_sn);
	} else {
		m_list = [];
		on_add(game_event_sn, position, odds, selected, episode, league_sub, node);
		toggle(node);
		m_episode = episode;
	}

	display_betting_slip();
}

function get_betting_money()
{
	var p_betting_money = $('#p_slip_betting_money').val();
	if(p_betting_money == "") {
		return 0;
	}
	
	p_betting_money = p_betting_money.replace(/,/gi,"");
	p_betting_money = parseInt(p_betting_money);

	return p_betting_money;
}

function display_betting_slip()
{
	$("#picklist").empty();
	
	var p_betting_money = get_betting_money();
	var p_odds_selected = get_odds_selected();

	var p_slip_prize = Math.floor(p_betting_money * p_odds_selected);

	$("#p_slip_odds").html(p_odds_selected);
	$("#p_slip_prize").html(number_format(p_slip_prize));

	for(var i=0; i < m_list.length; ++i) {

		var item = m_list[i];
		var position = item['position'];
		
		$(item['node']).addClass("on");
		$(item['node']).addClass("g_gr_o");
		$(item['node']).addClass("active");
		$(item['node']).addClass("clicked");

		if(position == '1') {
			display_position = "HOME";
		} else if(position == '2') {
			display_position = "AWAY";
		} else if(position == 'x') {
			display_position = "DRAW";
		}

		display_team = item['selected'];
		var html = 	""+
					"	<div class='cart_bet'>"+
					"		<div class='cart_bet_title'>"+
					"			<div class='cart_bet_tip'>"+item['episode']+"회차 ["+display_team+"]</div>"+
					"			<div class='cart_bet_x' onclick='on_cancel("+item['game_event_sn']+")'><i class='fa-regular fa-circle-xmark'></i></div>"+
					"		</div>"+
					"		<div class='cart_bet_info'>"+
					"			<div class='bet_bet_team'>"+
					"				<div class='bet_team_name'>"+display_position+"</div>"+
					"				<div class='bet_bet_odd'>"+parseFloat(item['odds']).toFixed(2)+"</div>"+
					"			</div>"+
					"		</div>"+
					"	</div>"+
					"";
		$('#picklist').html(html);
	}
	
	$("#open_cart .odds").text(p_odds_selected);
	$("#open_cart b").text(m_list.length);
	
	// 
	onCartMoving(m_list.length == 0);
}

function on_cancel(game_event_sn)
{
	on_delete(game_event_sn);

	toggle_clear();

	$('#p_slip_betting_money').val("");
	display_betting_slip();
}

function on_clear()
{
	while (m_list.length > 0) { 
		m_list.pop(); 
	}
	on_cancel();
}

function on_delete(game_event_sn)
{
	for(var i=0; i<m_list.length; ++i) {
		if(m_list[i]['game_event_sn'] == game_event_sn) {
			m_list.splice(i, 1);
			break;
		}
	}
}

function on_delete2(game_event_sn, league_sub)
{
	for(var i=0; i<m_list.length; ++i) {
		if(m_list[i]['game_event_sn'] == game_event_sn && m_list[i]['league_sub']==league_sub) {
			m_list.splice(i, 1);
			break;
		}
	}
}

function on_delete_all()
{
	for(var i=0; i<m_list.length; ++i) {
		if(m_list[i]['game_event_sn'] == game_event_sn) {
			m_list.splice(i, 1);
			break;
		}
	}
}

function on_add(game_event_sn, position, odds, selected, episode, league_sub, node)
{
	var item = new Object;

	item['game_event_sn'] = game_event_sn;
	item['position'] = position;
	item['selected'] = selected;
	item['odds'] = odds;
	item['episode'] = String(episode);
	item['league_sub'] = String(league_sub);
	item['node'] = node;

	m_list.push(item);

	return true;
}

function on_betting()
{
	var min_betting = $("#min_betting").val();
	var max_betting = $("#max_betting").val();
	var max_betting_1f = $("#max_betting_1f").val();
	var max_prize = $("#max_prize").val();
	var menu_template_sn = $("#menu_template_sn").val();
	var betting_money = get_betting_money();
	var prize =  $("#p_slip_prize").html();
	var csrf_name = $("#csrf_name");
	var csrf_hash = $("#csrf_hash");

	prize = prize.replace(/,/gi,"");
	prize = parseInt(prize);
	
	// by 1000 기획변경됨
	//var len = String(betting_money).length;
	//var tmp = (String(betting_money).substring(len-3, len));
	//var actual_betting_money = betting_money - parseInt(tmp);
	var actual_betting_money = betting_money;

	var game_count = m_list.length;

	if(game_count <= 0) {
		alert("배팅할 경기를 선택하십시오.");
		return false;
	}

	if(isNaN(actual_betting_money)) {
		alert("배팅하실 금액을 정확히 입력하여 주십시오");
		return false;
	}
	
	// 1Folder
	if(game_count == 1) {
		if (actual_betting_money < min_betting || actual_betting_money > max_betting_1f) {
			alert("단폴더는 "+number_format(min_betting)+"~"+number_format(max_betting_1f)+"원 사이입니다.");
			return false;
		}
	} else {
		if (actual_betting_money < min_betting || actual_betting_money > max_betting) {
			alert("베팅액은 "+number_format(min_betting)+"~"+number_format(max_betting)+"원 사이입니다.");
			return false;
		}
	}
	
	// 파워볼은 단폴더만 가능
	switch(m_list[0]['league_sub']|0) {
		case 480:
		case 477:
		case 476:
		case 1868:
		case 1865:
		case 1864:
			if(game_count > 1) {
				alert("'대/중/소'와 파워볼 및 일반볼은 함게 배팅할 수 없습니다.");
				return false;
			}
			break;
	}

	if(prize > max_prize) {
		alert("최대적중금은 "+number_format(max_prize)+" 를 넘을 수 없습니다.");
		return false;
	}

	var json_encode = JSON.stringify(m_list);

	if(confirm("베팅하시겠습니까?")) {
		$.ajax(
		{
			type: 'post',
			url: $path['url']+"ajax",
			async: false,
			data: { 
				'action': 'betting',
				'value': 'betting_minigame',
				'p_json': json_encode,
				'type': minigame_type,
				'p_slip_betting_money': $('#p_slip_betting_money').val(),
				'p_odds_bonus': $("input[name=p_odds_bonus]").val(),
				'p_pre_prize': prize,
			}, 
			dataType : "json",
			success: function(response) {
				if(response.result == 0) {
					alert(response.err);
					on_clear();
					return;
				}
				
				alert("베팅 완료되었습니다.");
				on_clear();

				const json_obj = JSON.parse(response.data);
				var balance = json_obj.balance;
				$("#p_balance").html(number_format(balance));
				$("#p_top_money").html(number_format(balance));

				reload_game_list();
			},
			error: function(request,status,error) 
			{
				on_clear();
				
				//alert("일시적인 통신장애입니다.");
				alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
			}
		});
	}
}