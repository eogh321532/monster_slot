var E_1X2 = 1;
var E_HDP = 2;
var E_UO = 3;
var E_MAX_ODDS = 100;
var E_DEFAULT_ODDS_BONUS = 1;

var m_list = new Array();

var m_odds_bonus = E_DEFAULT_ODDS_BONUS;
var m_odds_bonus_min = 0;
var m_team_bonus = "";
var m_team_bonus_node;

var on_betting_active = false;

function find(game_event_sn)
{
	for(var i=0; i<m_list.length; ++i) {
		if(m_list[i]['game_event_sn'] == game_event_sn) {
			return m_list[i];
		}
	}

	return -1;
}

function is(game_event_sn, position)
{
	for(var i=0; i<m_list.length; ++i) {
		if(m_list[i]['game_event_sn'] == game_event_sn && m_list[i]['position'] == position) {
			return true;
		}
	}

	return false;
}

function get(game_event_sn)
{
	for(var i=0; i<m_list.length; ++i) {
		if(m_list[i]['game_event_sn'] == game_event_sn) {
			return m_list[i];
		}
	}

	return -1;
}

function get_odds_selected()
{
	if(m_list.length <= 0 && m_odds_bonus <= E_DEFAULT_ODDS_BONUS)
		return 0;

	var odds_selected = 1;
	for(var i=0; i<m_list.length; ++i) {
		odds_selected *= m_list[i]['odds_selected'];
	}

	odds_selected *= m_odds_bonus;

	return parseFloat(odds_selected).toFixed(2);
}

function get_odds_selected_exclude_bonus()
{
	var odds_selected = 1;
	for(var i=0; i<m_list.length; ++i) {
		odds_selected *= m_list[i]['odds_selected'];
	}

	return Math.floor(odds_selected*100)/100;
}
 
/*
 * Update Checkbox Attribute and BackGround Css
 * return : 'inserted' or 'deleted'
 */
function toggle($tr)
{
	var game_template_sn = $tr.find('input[name=game_template_sn]').val();

	//change css class
	$tr.find('input[name=position]').each(function(index) {
		if(this.checked)
		{
			if(index == 0) {
				$(this).closest('td').prop('class', 'homepick');
			} else if(index == 1) {
				$(this).closest('td').prop('class', 'drawpick');
			} else if(index == 2) {
				$(this).closest('td').prop('class', 'awaypick');
			}

		} else {
			odds_x = $tr.find('input[name=odds_x]').val();

			if(index == 0) {
				$(this).closest('td').prop('class', 'home');
			} else if(index == 1 && game_template_sn == 1) {
				if(odds_x == '0') {
					$(this).closest('td').prop('class', 'nodraw');
				} else {
					$(this).closest('td').prop('class', 'draw');
				}
			}
			else if(index == 2) {
				$(this).closest('td').prop('class', 'away');
			}
		}
	});
	$(".game").removeClass("active");
}

// 축구 동일 경기 [승무패-언오버] 배팅불가
function check_rule_soccer_1x2_uo(game_sn, game_template_sn)
{
	for(var i=0; i<m_list.length; ++i) 
	{
		var item = m_list[i];
		if(item['game_sn'] == game_sn) {
			if(game_template_sn == E_1X2 && item['game_template_sn'] == E_UO) {
				return 0;
			}
			else if(game_template_sn == E_UO && item['game_template_sn'] == E_1X2) {
				return 0;
			}
		}
	}
	return 1;
}

// 축구 동일 경기 [양팀득점-언오버] 배팅불가
function check_rule_soccer_score_uo(started, home, away, game_template_sn)
{
	if(m_list.length <= 0) {
		return 1;
	}

	for(var i=0; i < m_list.length; ++i) 
	{
		var item = m_list[i];
		
		if(is_same_game(started, home, away, game_template_sn, item)) {
			var is_scored_item = is_scored_game(item['home']);
			var is_scored = is_scored_game(home);

			if(is_scored == 1 && game_template_sn == E_1X2 && item['game_template_sn'] == E_UO) {
				return 0;
			}
			else if(game_template_sn == E_UO && item['game_template_sn'] == E_1X2 && is_scored_item == 1) {
				return 0;
			}		
		}
	}
	
	return 1;
}

// 승무패-무, 언더오버-언더 조합
function check_rule_x_u(game_sn, game_template_sn)
{
	for(var i=0; i<m_list.length; ++i) 
	{
		var item = m_list[i];
		if(item['game_sn'] == game_sn) {
			if(game_template_sn == E_1X2 && item['game_template_sn'] == E_UO) {
				return 0;
			}
			else if(game_template_sn == E_UO && item['game_template_sn'] == E_1X2) {
				return 0;
			}
		}
	}
	return 1;
}

// [승무패]+[핸디캡] 조합불가
function check_rule_1x2_hdp(game_sn, game_template_sn)
{
	for(var i=0; i<m_list.length; ++i) 
	{
		var item = m_list[i];
		if(item['game_sn'] == game_sn) {
			if(game_template_sn == E_1X2 && item['game_template_sn'] == E_HDP) {
				return 0;
			}
			else if(game_template_sn == E_HDP && item['game_template_sn'] == E_1X2) {
				return 0;
			}
		}
	}
	
	return 1;
}

// 야구, [1이닝 득점/무득점]과 언오버 베팅불가
function check_rule_baseball_uo_scored(started, home, away, game_template_sn)
{
	if(m_list.length <= 0) {
		return 1;
	}

	for(var i=0; i < m_list.length; ++i) 
	{
		var item = m_list[i];
		
		if(is_same_game(started, home, away, game_template_sn, item)) {
			var is_scored_item = is_1inning_scored_game(item['home']);
			var is_scored = is_1inning_scored_game(home);

			if(is_scored == 1 && game_template_sn == E_1X2 && item['game_template_sn'] == E_UO) {
				return 0;
			}
			else if(game_template_sn == E_UO && item['game_template_sn'] == E_1X2 && is_scored_item == 1) {
				return 0;
			}		
		}
	}
	
	return 1;	
}

// 야구, [1이닝 승무패] 와 [4이닝 언더오버] 베팅불가
function check_rule_baseball_1x2_uo(started, home, away, game_template_sn)
{
	if(m_list.length <= 0) {
		return 1;
	}

	for(var i=0; i < m_list.length; ++i) 
	{
		var item = m_list[i];
		
		if(is_same_game(started, home, away, game_template_sn, item)) {
			var is_1_1x2_item = is_1inning_1x2_game(item['home']);
			var is_1_1x2 = is_1inning_1x2_game(home);
			

			if(is_1_1x2 == 1 && game_template_sn == E_1X2 && is_4inning_uo_game(item['home'], item['game_template_sn'])) {
				return 0;
			}
			else if(is_4inning_uo_game(home, game_template_sn) && item['game_template_sn'] == E_1X2 && is_1_1x2_item == 1) {
				return 0;
			}		
		}
	}
	
	return 1;	
}

function is_same_game(started, home, away, game_template_sn, item) {

	var game_template_sn_item = item['game_template_sn'];

	if(started != item['started']) {
		return 0;
	}

	var splited_home = splited(home);
	var splited_away = splited(away);
	var splited_home_item = splited(item['home']);
	var splited_away_item = splited(item['away']);

	if(splited_home == splited_home_item && splited_away == splited_away_item) {
		return 1;
	}

	return 0;
}

// [양팀 득점/무득점] 게임인지를 판단.
function is_scored_game(home) {
	if(home.indexOf("양팀 득점") != -1) {
		return 1;
	}
	return 0;
}

// [1이닝 득점/무득점] 게임인지를 판단.
function is_1inning_scored_game(home) {
	if(home.indexOf("1이닝 득점") != -1) {
		return 1;
	}
	return 0;
}

// [1이닝 승무패] 게임인지를 판단.
function is_1inning_1x2_game(home) {
	if(home.indexOf("1이닝 승무패") != -1) {
		return 1;
	}
	return 0;
}

// [4이닝 언오버] 게임인지를 판단.
function is_4inning_uo_game(home, game_template_sn) {
	if(home.indexOf("4이닝") != -1 && game_template_sn == E_UO) {
		return 1;
	}

	return 0;
}

function splited(team) {
	var pos = team.indexOf("[");
	if(pos == -1) {
		return team;
	}

	var filterd = team.substr(0, pos);

	return filterd.trim();
}

function on_selected_team(node, position)
{
	$tr = $(node).closest('.g_item');

	var game_sn = $tr.find('input[name=game_sn]').val();
	var game_event_sn = $tr.find('input[name=game_event_sn]').val();
	var game_league_uid = $tr.find('input[name=game_league_uid]').val();
	var home = $tr.find('input[name=home]').val();
	var away = $tr.find('input[name=away]').val();
	var home_uid = $tr.find('input[name=home_uid]').val();
	var away_uid = $tr.find('input[name=away_uid]').val();
	var odds_1 = $tr.find('input[name=odds_1]').val();
	var odds_x = $tr.find('input[name=odds_x]').val();
	var odds_2 = $tr.find('input[name=odds_2]').val();
	var started = $tr.find('input[name=started]').val();
	var game_template_sn = $tr.find('input[name=game_template_sn]').val();
	var sport_sn = $tr.find('input[name=sport_sn]').val();
	
	// if(!check_rule_x_u(game_sn, game_template_sn))
	// {
	// 	alert("[승무패]-무+[언더오버]-언더 조합은 배팅 불가능합니다.");
	// 	return;
	// }

	//특이조건- 승무패와 언오버는 동일경기, 축구 배팅불가
	if(sport_sn == 4 && !check_rule_soccer_1x2_uo(game_sn, game_template_sn))
	{
		alert("축구, 동일경기 [승무패]+[언더오버] 조합은 배팅 불가능합니다.");
		return;
	}
	
	//if(!check_rule_1x2_hdp(game_sn, game_template_sn))
	//{
	//	alert("[승무패]+[핸디캡] 조합은 배팅 불가능합니다.");
	//	return;
	//}

	if(sport_sn == 4 && !check_rule_soccer_score_uo(started, home, away, game_template_sn))
	{
		alert("축구, 동일경기 [양팀득점] + [언더오버] 조합은 배팅 불가능합니다.");
		return;
	}

	if(sport_sn == 3 && !check_rule_baseball_uo_scored(started, home, away, game_template_sn))
	{
		alert("야구, 동일경기 [언더오버]+[1이닝 득점/무득점] 조합은 배팅 불가능합니다.");
		return;
	}

	if(sport_sn == 3 && !check_rule_baseball_1x2_uo(started, home, away, game_template_sn))
	{
		alert("야구, 동일경기 [1이닝 승무패]+[4이닝 언오버] 조합은 배팅 불가능합니다.");
		return;
	}
	
	var odds_selected = '1';
	if('1' == position) {
		odds_selected = odds_1;
	} else if('x' == position) {
		odds_selected = odds_x;
	} else if('2' == position) {
		odds_selected = odds_2;
	}

	$tr.find('input[name=position]').each(function() {
		this.checked = false;
	});

	if(is(game_event_sn, position)) {
		on_delete(game_event_sn);
		toggle($tr);
	} else if(-1 != get(game_event_sn)) {
		on_delete(game_event_sn);
		if(on_add(game_sn, game_event_sn, home, away, odds_1, odds_x, odds_2, odds_selected, game_template_sn, position, started, count_of_max_betting, node)) {
			if(position == '1') {
				$tr.find('input[name=position]:eq(0)').prop("checked", true);
			} else if(position == 'x') {
				$tr.find('input[name=position]:eq(1)').prop("checked", true);
			}
			 else if(position == '2') {
				$tr.find('input[name=position]:eq(2)').prop("checked", true);
			}
			toggle($tr);
		}
	} else {
		if(on_add(game_sn, game_event_sn, home, away, odds_1, odds_x, odds_2, odds_selected, game_template_sn, position, started, count_of_max_betting, node)) {
			if(position == '1') {
				$tr.find('input[name=position]:eq(0)').prop("checked", true);
			} else if(position == 'x') {
				$tr.find('input[name=position]:eq(1)').prop("checked", true);
			}
			 else if(position == '2') {
				$tr.find('input[name=position]:eq(2)').prop("checked", true);
			}

			toggle($tr);
		}
	}

	display_betting_slip();
}

function on_selected_bonus(team, odds_bonus, odds_bonus_min, node)
{
	
	if(m_odds_bonus == odds_bonus) {
		on_clear_bonus();
	} else {
		m_odds_bonus = odds_bonus;
		m_odds_bonus_min = odds_bonus_min;
		m_team_bonus = team;
		m_team_bonus_node = node;

		$("input[name=p_odds_bonus]").val(m_odds_bonus);
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
	$(".game").removeClass("active");
	$(".bonus_game").removeClass("active");

	var p_betting_money = get_betting_money();
	var p_odds_selected = get_odds_selected();
	var p_slip_prize = Math.floor(p_betting_money * p_odds_selected);

	$("#p_slip_odds").html(p_odds_selected);
	$("#p_slip_prize").html(number_format(p_slip_prize));

	// display bonus
	if(m_odds_bonus > E_DEFAULT_ODDS_BONUS) {
		display_position = "BONUS";
		display_team = m_team_bonus;
		$(m_team_bonus_node).addClass("active");

		var html = 	""+
					"	<div class='cart_bet'>"+
					"		<div class='cart_bet_title'>"+
					"			<div class='cart_bet_tip'>"+display_team+"</div>"+
					"			<div class='cart_bet_close' onclick='on_clear_bonus()'><i class='fa-regular fa-circle-xmark'></i></div>"+
					"		</div>"+
					"		<div class='cart_bet_info'>"+
					"			<div class='cart_bet_info1'>"+display_position+"</div>"+
					"			<div class='cart_bet_info2'>"+parseFloat(m_odds_bonus).toFixed(2)+"</div>"+
					"		</div>"+
					"	</div>"+
					"";
		$("#picklist").append(html);
	}

	for(var i=0; i < m_list.length; ++i) {

		var item = m_list[i];
		var position = item['position'];

		$(item['node']).addClass("active");

		if(position == '1') {
			display_position = "HOME";
			display_team = item['home'];
		} else if(position == 'x') {
			display_position = "DRAW";
			display_team = item['home'];
		} else if(position == '2') {
			display_position = "AWAY";
			display_team = item['away'];
		}


		var html = 	""+
					"	<div class='cart_bet'>"+
					"		<div class='cart_bet_title'>"+
					"			<div class='cart_bet_tip'>"+item['home']+" vs "+item['away']+"</div>"+
					"			<div class='cart_bet_close' onclick='on_cancel(\'"+item['game_event_sn']+"\');'><i class='fa-regular fa-circle-xmark'></i></div>"+
					"		</div>"+
					"		<div class='cart_bet_info'>"+
					"			<div class='cart_bet_info1'>"+display_position+"</div>"+
					"			<div class='cart_bet_info2'>"+parseFloat(item['odds_selected']).toFixed(2)+"</div>"+
					"		</div>"+
					"	</div>"+
					"";
		$("#picklist").append(html);
	}
	
	$("#p_select_cnt").text("("+m_list.length+")");
}

function on_cancel(game_event_sn)
{
	on_delete(game_event_sn);

	$('input[name=game_event_sn]').each(function() {
		if($(this).val() == game_event_sn) 
		{
			$tr = $(this).parent();
			$tr.find('input[name=position]').each(function() {
			this.checked = false;
			});
			toggle($tr);
		}
	});
	
	display_betting_slip();
}

function on_clear_bonus()
{
	$('td[name=p_bonus]').each(function() {
		$(this).prop('class', 'home');
	});

	m_odds_bonus = E_DEFAULT_ODDS_BONUS;
	m_team_bonus = "";
	m_odds_bonus_min = 0;
	$("input[name=p_odds_bonus]").val(E_DEFAULT_ODDS_BONUS);

	display_betting_slip();
}

function on_clear()
{
	$('input[name=position]').each(function(index) {
		this.checked = false;
		var position = $(this).val();
		if(position == '1')
		{
			$(this).parent().prop('class', 'home');
		} else if(position == 'x') {
			var x_class = $(this).parent().prop('class');
			if(x_class == 'nodraw') {
				$(this).parent().prop('class', 'nodraw');
			} else {
				$(this).parent().prop('class', 'draw');
			}

		} else if(position == '2') {
			$(this).parent().prop('class', 'away');
		}
	});

	while (m_list.length > 0) { 
		m_list.pop(); 
	}
	$('#p_slip_betting_money').val("");
	on_clear_bonus();

	display_betting_slip();
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

function on_add(game_sn, game_event_sn, home, away, odds_1, odds_x, odds_2, odds_selected, game_template_sn, position, started, count_of_max_betting, node)
{
	if(m_list.length >= count_of_max_betting) {

		alert("최대 "+count_of_max_betting+"경기까지 선택하실수 있습니다.");
		return false;
	}

	if(get_odds_selected()*odds_selected >= E_MAX_ODDS) {
		alert("100배당 이상은 배팅이 불가능 합니다.");
		return false;
	}

	var item = new Object;

	item['game_sn'] = game_sn;
	item['game_event_sn'] = game_event_sn;
	item['home'] = home;
	item['away'] = away;
	item['odds_1'] = odds_1;
	item['odds_x'] = odds_x;
	item['odds_2'] = odds_2;
	item['odds_selected'] = odds_selected;
	item['game_template_sn'] = game_template_sn;
	item['position'] = position;
	item['started'] = started;
	item['node'] = node;

	m_list.push(item);

	return true;
}

function on_betting()
{
	var betting_money = get_betting_money();
	var prize =  $("#p_slip_prize").html();
	prize = prize.replace(/,/gi,"");
	prize = parseInt(prize);
	
	// by 1000
	var len = String(betting_money).length;
	var tmp = (String(betting_money).substring(len-3, len));
	var actual_betting_money = betting_money - parseInt(tmp);

	var game_count = m_list.length;

	if(game_count <= 0) {
		alert("배팅할 경기를 선택하십시오.");
		return false;
	}

	if(isNaN(actual_betting_money)) {
		alert("배팅하실 금액을 정확히 입력하여 주십시오");
		return false;
	}
	
	if(game_count == 1) {
		// if(min_betting == 0 || max_betting_1f == 0) {
		// 	alert("단폴더는 제한되어 있습니다.");
		// 	return false;
		// }
		if (actual_betting_money < min_betting || actual_betting_money > max_betting_1f) {
			alert("단폴더는 "+number_format(min_betting)+"~"+number_format(max_betting_1f)+"원 사이입니다.");
			return false;
		}
	} else {
		if(min_betting>0 && max_betting>0) {
			if (actual_betting_money < min_betting || actual_betting_money > max_betting) {
				alert("베팅액은 "+number_format(min_betting)+"~"+number_format(max_betting)+"원 사이입니다.");
				return false;
			}
		}
	}

	if(prize>max_prize) {
		alert("최대적중금은 "+number_format(max_prize)+" 를 넘을 수 없습니다.");
		return false;
	}

	if(m_odds_bonus_min > 0 && parseFloat(m_odds_bonus_min) > parseFloat(get_odds_selected_exclude_bonus())) {
		alert("폴더보너스 최소조합배당률은 "+m_odds_bonus_min+" 입니다.");
		return false;
	}
	
	// 배당이 변경된 상태인지 확인
	var json_encode = JSON.stringify(m_list);

	if(on_betting_active)
		return;
	
	on_betting_active = true;
	$.ajax({
		type: "post",
		url: $path['url']+"ajax",
		data: { 
			'action': 'betting',
			'value': 'compared_odd_json',
			'json': json_encode
		},
		dataType: "json",
		success : function(response) {
			var check = false;
			if(response.result == 0) {
				if(confirm(response.data)) {
					check = true;
				} else {
					return;
				}
			}

			if(check || confirm("베팅하시겠습니까?")) 
			{
				$.ajax({
					type: "post",
					url: $path['url']+"ajax",
					data: { 
						'action': 'betting',
						'value': 'betting_json',
						'json': json_encode,
					},
					dataType: "json",
					success : function(response) 
					{
						if(response.result == 0) {
							alert(response.data);
							return;
						}
						
						// 인플레이
						if(menu_uid == 101)
							$('form[name=frm_betting_slip] input[name="action"]').val("user_betting_inplay_lsport");
						
						$('form[name=frm_betting_slip] input[name=p_json]').val(json_encode);
						$('form[name=frm_betting_slip] input[name=p_pre_prize]').val(prize);
						$('form[name=frm_betting_slip] input[name=sport_uid]').val(sport_uid);
						$('form[name=frm_betting_slip] input[name=menu_uid]').val(menu_uid);
						$('form[name=frm_betting_slip]').submit();
					},
					error: function(xhr, status) 
					{
						alert("일시적인 통신장애입니다. 새로고침을 해주십시요.[1]");
						on_betting_active = false;
						return false;
					}
				});
			}			
		},
		error: function(request,status,error) {
			alert("일시적인 통신장애입니다. 새로고침을 해주십시요.[2]" + error);
		}
	});

	on_betting_active = false;
	return true;
}

function popped(text)
{
	var ScreenWidth=window.screen.width;
	var ScreenHeight=window.screen.height;
	var movefromedge=0;
	placementx=(ScreenWidth/2)-((400)/2);
	placementy=(ScreenHeight/2)-((300+50)/2);
	WinPop=window.open("About:Blank","","width=400,height=300,toolbar=0,location=0,directories=0,status=0,scrollbars=0,menubar=0,resizable=0,left="+placementx+",top="+placementy+",scre enX="+placementx+",screenY="+placementy+",");
	var SayWhat = text;
	document.write('<html>\n<head>\n</head>\n<body>'+SayWhat+'</body></html>');
}