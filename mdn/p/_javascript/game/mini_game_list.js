
var timer_ladder;
var timer_deadline;
var app_episode = 0;
var app_deadline_interval = 0;

$(window).load(function() {
	reload_episode();
	reload_deadline();
	
	timer_ladder = window.setInterval("reload_episode()", 5000);
	timer_deadline = window.setInterval("reload_deadline()", 1000);

	$("#wrap_ladder iframe").attr('scrolling', 'no');
	$("#wrap_ladder iframe").attr('src', minigame_iframe_url);
	
	const urlParams = new URLSearchParams(window.location.search);
	const me_location = parseInt(urlParams.get("menu"));
	
	if(me_location == 11 || me_location == 12 || me_location == 13 || me_location == 14 || me_location == 60 || me_location == 61 || me_location == 17 || me_location == 18 || me_location == 21 || me_location == 22){
		$('.mini_game_wrap').removeClass('mini_game_wrap').addClass('mini_game_wrap2');
	}
});
 
$(window).unload(function() {
	clearInterval(timer_ladder);
	clearInterval(timer_deadline);
});

function reload_deadline()
{
		//
	var deadlind_seconds = app_deadline_interval - 1;
	app_deadline_interval -= 1;

	if(deadlind_seconds <= 0) {
		deadlind_seconds = 0;
		$(".no_mini_game").html("지금은 배팅할 수 없습니다.");
		$(".no_mini_game").show();
	} else {
		$(".no_mini_game").hide();
	}

	$("#deadlind_seconds").html(deadlind_seconds);
	
	//
	switch(minigame_menu_uid) {
		case 72:
			$.ajax({
				type: "post",
				url: $path['url']+"ajax",
				data: { 
					'action': 'minigame',
					'value': 'read_odds',
					'type': minigame_type,
				},
				dataType: "json",
				success : function(response) 
				{
					if(response.result == 0) {
					} else {
						const json_obj = JSON.parse(response.data);
						if(app_episode == json_obj.round) {
							on_reload_holdem_odds(json_obj);
						}
					}
				},
				error: function(xhr, status) 
				{
					//alert('[' + status + ']\n\n' + xhr.responseText);
				}
			});
			break;
	}
}

function reload_game_list()
{
	$.ajax({
		type: "post",
		url: $path['url']+"ajax",
		data: { 
			'action': 'minigame',
			'value': 'game_info',
			'type': minigame_type,
		},
		dataType: "json",
		success : function(response) 
		{
			if(response.result == 0) {
			} else {
				const json_obj = JSON.parse(response.data);
				
				var episode = json_obj.episode;

				app_deadline_interval = json_obj.deadline_interval;
				app_episode = episode;

				$("input[name=p_episode]").val(episode);
				$("#episode_ad").text(episode);

				on_reload_mini_game_listup(minigame_menu_uid, episode, json_obj.data, 1, json_obj.dataArray);
				if(json_obj.bettings === undefined ) {
					
				} else {
					on_reload_betting_list(json_obj.bettings);
				}
			}
		},
		error: function(xhr, status) 
		{
			//alert('[' + status + ']\n\n' + xhr.responseText);
		}
	});
	
}

function reload_episode()
{
	$.ajax({
		type: "post",
		url: $path['url']+"ajax",
		data: { 
			'action': 'minigame',
			'value': 'episode',
			'type': minigame_type,
		},
		dataType: "json",
		success : function(response) {
			if(response.result == 0)
				return;
			
			if(response.data != app_episode) {
				reload_game_list();
				on_clear();
			}
		},
		error: function(xhr, status) 
		{
			//alert('[' + status + ']\n\n' + xhr.responseText);
		}
	});
	$.ajax({
		type: "post",
		url: $path['url']+"ajax",
		data: { 
			'action': 'read_cash',
		},
		dataType: "json",
		success : function(response) {
			$("#p_balance").html(number_format(response.result));
		},
		error: function(xhr, status) 
		{
			//alert('[' + status + ']\n\n' + xhr.responseText);
		}
	});
}

function on_clear_betting_list()
{
	if(!confirm("진행중인 배팅을 제외한 나머지 내역을 삭제하시겠습니까?"))
		return;
	
	$.ajax({
		type: "post",
		url: $path['url']+"ajax",
		data: { 
			'action': 'betting',
			'value': 'hide_all',
			'menu_uid': minigame_menu_uid,
		},
		dataType: "json",
		success : function(response) {
			if(response.result == 0) {
				alert(response.err);
				return;
			}
			
			alert("처리되었습니다.");
			location.href = $path['url_path'] + "&deadline_type=3";
		},
		error: function(xhr, status) {
			alert("일시적인 통신장애입니다. 새로고침을 해주십시요.");
			//alert('[' + status + ']\n\n' + xhr.responseText);
		}
	});
}

function on_reload_betting_list(bettings) {
	var html = '';
	if(bettings.length <= 0) {
		html += '배팅내역이 없습니다.';
	} else {
		for(var i=0; i<bettings.length; ++i) {
			var betting = bettings[i];
			var odds_1 = betting.odds_1==null ? "" : betting.odds_1;
			var odds_2 = betting.odds_2==null ? "" : betting.odds_2;
			
			html += ' \
					<div class="result_title_list game_bet_list">	\
						<div class="result_title_list_title">'+betting.started+'</div>	\
						<ul>	\
							<li class="result_time">'+betting.episode+' 회차</li>	\
							<li class="result_league"></li>	\
							<li class="result_team1 '+(betting.selected == '1'?'active':'')+'"><span class="team_l">'+betting.home_desc+'</span><span class="team_r"> &nbsp;'+odds_1+'</span></li>	\
							<li class="result_tie '+(betting.selected == 'x'?'active':'')+'">'+betting.vs_desc+'</li>	\
							<li class="result_team2 '+(betting.selected == '2'?'active':'')+'"><span class="team_l">'+odds_2+'&nbsp; </span><span class="team_r">'+betting.away_desc+'</span></li>	\
							<li class="result_state">';
							
							
			if(betting.status == "0") {
				html += '<span class="font06">진행</span>';
			} else if(betting.status == "1") {
				html += '<span class="font07">당첨</span>';
			} else if(betting.status == "2") {
				html += '<span class="font08">미적중</span>';
			} else if(betting.status == "3") {
				html += '<span class="font04">취소</span>';
			} else {
				html += '<span class="font07">적특</span>';
			}
			
			
			html += '	</li></ul>	\
					</div>	\
			';
			
			// html += ' \
			// 	<div class="bet_list_tr"> \
			// 		<div class="bet_cell bet1">'+betting.started+'</div> \
			// 		<div class="bet_cell bet6">'+betting.episode+' 회차</div> \
			// 		<div class="bet_cell bet2 '+(betting.selected == '1'?'bet_cellon':'')+'"> <span style="float:left">'+betting.home_desc+'</span><span style="float:right"></span></div> \
			// 		<div class="bet_cell bet3 '+(betting.selected == 'x'?'bet_cellon':'')+'">'+betting.vs_desc+'</div> \
			// 		<div class="bet_cell bet4 '+(betting.selected == '2'?'bet_cellon':'')+'"> <span style="float:left">패</span><span style="float:right">'+betting.away_desc+'</span></div> \
			// 		<div class="bet_cell bet7">';
			// 		if(betting.status == "0") {
			// 			html += '<span class="font06">진행</span>';
			// 		} else if(betting.status == "1") {
			// 			html += '<span class="font07">당첨</span>';
			// 		} else if(betting.status == "2") {
			// 			html += '<span class="font08">낙첨</span>';
			// 		} else if(betting.status == "3") {
			// 			html += '<span class="font04">취소</span>';
			// 		} else {
			// 			html += '<span class="font07">적특</span>';
			// 		}
			// 	html += '</div> \
			// 	</div> \
			// ';
			// html += ' \
			// 	<div class="bet_list_tr"> \
			// 		<div class="bet_cell" style="color:white;font-weight:bold;">배당율: '+betting.betting_odds+'</div> \
			// 		<div class="bet_cell" style="color:white;font-weight:bold;">배팅금: '+betting.betting_money+'</div> \
			// 		<div class="bet_cell" style="color:white;font-weight:bold;">예상당첨금: '+betting.result_money+'</div> \
			// 	</div> \
			// ';
		}
	}

	$("#mini_game_betting_list").empty();
	$("#mini_game_betting_list").prepend(html);
}

function on_reload_mini_game_listup(menu_templaten_sn, episode, games, count_of_max_betting, gamesArray)
{
	var html = "";
	if(menu_templaten_sn == 5 || menu_templaten_sn == 70 || menu_templaten_sn == 201 || menu_templaten_sn == 202 || menu_templaten_sn == 204) {
		html = on_listup_ladder("사다리", episode, games, count_of_max_betting)
	} 
	else if(menu_templaten_sn == 1120 || menu_templaten_sn == 1121 || menu_templaten_sn == 1122) 
	{
		html = on_listup_ladder("오다리", episode, games, count_of_max_betting)
	} 
	else if(menu_templaten_sn == 25) 
	{
		html = on_listup_ladder("파워사다리", episode, games, count_of_max_betting)
	} 
	else if(menu_templaten_sn == 26) 
	{
		html = on_listup_ladder("키노사다리", episode, games, count_of_max_betting)
	} 
	else if(menu_templaten_sn == 44) 
	{
		html = on_listup_ladder("피그사다리", episode, games, count_of_max_betting)
	} 
	else if(menu_templaten_sn == 49) 
	{
		html = on_listup_ladder("핀볼", episode, games, count_of_max_betting)
	} 
	else if(menu_templaten_sn == 7) 
	{
		html = on_listup_ladder("네임드 다리다리", episode, games, count_of_max_betting)
	} 
	else if(menu_templaten_sn == 6) 
	{ // E_MENU_RACING
		html = on_listup_racing(episode, games, count_of_max_betting)
	} 
	else if(
		menu_templaten_sn == 15 || menu_templaten_sn == 16 || menu_templaten_sn == 27 || menu_templaten_sn == 28 || 
		menu_templaten_sn == 31 || menu_templaten_sn == 36 || menu_templaten_sn == 37 || menu_templaten_sn == 41 || menu_templaten_sn == 42 ||
		menu_templaten_sn == 43 || menu_templaten_sn == 45 || menu_templaten_sn == 1130
	) 
	{ // E_MENU_CHOICE_GIRL, E_MENU_PHARAO, E_MENU_ROULETTE, E_MENU_SUN_MOON, E_MENU_SUPER_MARIO, E_MENU_ANGELS_DEMONS, E_MENU_PK, E_MENU_HAMMER
		html = on_listup_gamenlive(menu_templaten_sn, episode, games, count_of_max_betting)
	} 
	else if(menu_templaten_sn == 10 || menu_templaten_sn == 71 || menu_templaten_sn == 1007) 
	{ //E_MENU_POWERBALL
		html = on_listup_powerball(episode, games, count_of_max_betting);
	}
	else if(menu_templaten_sn==200 || menu_templaten_sn==203 || menu_templaten_sn==205 || menu_templaten_sn==206 || menu_templaten_sn==207) {
		html = on_listup_powerball2(episode, games, count_of_max_betting);
	}
	else if(menu_templaten_sn==209) {
		html = on_listup_powerball3(episode, games, count_of_max_betting);
	}
	else if(menu_templaten_sn == 29) 
	{ // E_MENU_NINE_BALL
		html = on_listup_nine_ball("나인볼", episode, games, count_of_max_betting)
	}
	else if(menu_templaten_sn == 38)
	{
		html = on_listup_ladder("1분 별다리", episode, games, count_of_max_betting)
	} 
	else if(menu_templaten_sn == 39)
	{
		html = on_listup_ladder("2분 별다리", episode, games, count_of_max_betting)
	}
	else if(menu_templaten_sn == 40)
	{
		html = on_listup_ladder("3분 별다리", episode, games, count_of_max_betting)
	}
	else if(menu_templaten_sn == 48)
	{
		html = on_listup_max_roulette(episode, games, count_of_max_betting);
	}
	else if(menu_templaten_sn == 23 || menu_templaten_sn == 30 || menu_templaten_sn == 17 || 
			menu_templaten_sn == 18 || menu_templaten_sn == 33 || menu_templaten_sn == 34 || 
			menu_templaten_sn == 35 || menu_templaten_sn == 46 || menu_templaten_sn == 47 ||
			menu_templaten_sn == 21 || menu_templaten_sn == 22 || menu_templaten_sn == 32 || (menu_templaten_sn>=50 && menu_templaten_sn<=58)
	){
		html = on_reload_mini_game_5_listup(menu_templaten_sn, games, count_of_max_betting, gamesArray);
	}
	else if(menu_templaten_sn == 11 || menu_templaten_sn == 12 || menu_templaten_sn == 13 || menu_templaten_sn == 14)
	{
		html = on_reload_virtual_soccer(menu_templaten_sn, games, 10);
	}
	else if(menu_templaten_sn == 60 || menu_templaten_sn == 61)
	{
		html = on_reload_virtual_basketball(menu_templaten_sn, games, 10);
	}
	else if(menu_templaten_sn == 80 || menu_templaten_sn == 81 || menu_templaten_sn == 82)
	{
		html = on_reload_virtual_HorseRacing(menu_templaten_sn, games, 1);
	}
	else if(menu_templaten_sn == 90 || menu_templaten_sn == 91)
	{
		html = on_reload_virtual_DogRacing(menu_templaten_sn, games, 1);
	}
	else if(menu_templaten_sn == 72)
	{
		html = on_reload_holdem(episode, games, count_of_max_betting, gamesArray);
	}
	else 
	{
		alert("mini_game_list.js 등록필요");
	}
	$("#minigame5").remove();
	$("#mini_game_panel").empty();
	$("#mini_game_panel").prepend(html);
}
 
function on_listup_ladder(game, episode, games, count_of_max_betting)
{ 
	var html = ' \
				<input type="hidden" name="p_episode" value="'+episode+'" /> \
				<input type="hidden" name="count_of_max_betting" value="'+count_of_max_betting+'" /> \
					<div class="mini_game_box"> \
						<div class="mini_game_title">'+episode+'회차 [홀/짝]</div> \
						<div class="mini_btn_box"> \
						      <div class="row_btn width50 game" onclick="on_selected_team('+games[0].sn+', this, \'1\', '+games[0].odds_1+', \'홀수\', '+episode+', '+games[0].league_sub+');"> \
						        <div class="btn_top_blue"></div> \
						        <div class="btn_button_bottom_off"></div> \
						        <p class="mini_btn_type mini_btn_type2">홀</p> \
						        <h1>'+games[0].odds_1+'</h1> \
						      </div> \
						      <div class="row_btn width50 game" onclick="on_selected_team('+games[0].sn+', this, \'2\', '+games[0].odds_2+', \'짝수\', '+episode+', '+games[0].league_sub+');"> \
						        <div class="btn_top_red"></div> \
						        <div class="btn_button_bottom_off"></div> \
						        <p class="mini_btn_type mini_btn_type1">짝</p> \
						        <h1>'+games[0].odds_2+'</h1> \
						      </div> \
						</div> \
					</div> \
					<div class="mini_game_box"> \
						<div class="mini_game_title">'+episode+'회차 [좌출/우출/3줄/4줄]</div> \
						<div class="mini_btn_box"> \
						      <div class="cul_btn width50 game" onclick="on_selected_team('+games[1].sn+', this, \'1\', '+games[1].odds_1+', \'좌 시작\', '+episode+', '+games[1].league_sub+');"> \
						        <p class="mini_btn_type mini_btn_type2">좌</p> \
						        <h1>'+games[1].odds_1+'</h1> \
						      </div> \
						      <div class="cul_btn width50 game" onclick="on_selected_team('+games[1].sn+', this, \'2\', '+games[1].odds_2+', \'우 시작\', '+episode+', '+games[1].league_sub+');"> \
						        <p class="mini_btn_type mini_btn_type1">우</p> \
						        <h1>'+games[1].odds_2+'</h1> \
						      </div> \
						      <div class="cul_btn width50 game" onclick="on_selected_team('+games[2].sn+', this, \'1\', '+games[2].odds_1+', \'3줄\','+episode+', '+games[2].league_sub+');"> \
						        <p class="mini_btn_type mini_btn_type2">3줄</p> \
						        <h1>'+games[2].odds_1+'</h1> \
						      </div> \
						      <div class="cul_btn width50 game" onclick="on_selected_team('+games[2].sn+', this, \'2\', '+games[2].odds_2+', \'4줄\','+episode+', '+games[2].league_sub+');"> \
						        <p class="mini_btn_type mini_btn_type1">4줄</p> \
						        <h1>'+games[2].odds_2+'</h1> \
						      </div> \
						</div> \
					</div> \
					<div class="mini_game_box"> \
						<div class="mini_game_title">'+episode+'회차 [조합]</div> \
						<div class="mini_btn_box"> \
						      <div class="cul_btn width50 game" onclick="on_selected_team('+games[3].sn+', this, \'1\', '+games[3].odds_1+', \'우 / 3 / 홀\', '+episode+', '+games[3].league_sub+');"> \
						        <p class="mini_btn_type mini_btn_type2">홀3 \
						        	<span class="mini_btn_type_att ab_r">3</span> \
						        </p> \
						        <h1>'+games[3].odds_1+'</h1> \
						      </div> \
						      <div class="cul_btn width50 game" onclick="on_selected_team('+games[3].sn+', this, \'2\', '+games[3].odds_2+', \'우 / 4 / 짝\', '+episode+', '+games[3].league_sub+');"> \
						        <p class="mini_btn_type mini_btn_type1">짝4\
						        	<span class="mini_btn_type_att ab_r">4</span> \
						        </p> \
						        <h1>'+games[3].odds_2+'</h1> \
						      </div> \
						      <div class="cul_btn width50 game" onclick="on_selected_team('+games[4].sn+', this, \'1\', '+games[4].odds_1+', \'좌 / 4 / 홀\', '+episode+', '+games[4].league_sub+');"> \
						        <p class="mini_btn_type mini_btn_type2">홀4\
						        	<span class="mini_btn_type_att ab_l">4</span> \
						        </p> \
						        <h1>'+games[4].odds_1+'</h1> \
						      </div> \
						      <div class="cul_btn width50 game" onclick="on_selected_team('+games[4].sn+', this, \'2\', '+games[4].odds_2+', \'좌 / 3 / 짝\', '+episode+', '+games[4].league_sub+');"> \
						        <p class="mini_btn_type mini_btn_type1">짝3\
						        	<span class="mini_btn_type_att ab_l">3</span> \
						        </p> \
						        <h1>'+games[4].odds_2+'</h1> \
						      </div> \
						</div> \
					</div> \
	';

	return html;
}

function on_listup_racing(episode, games, count_of_max_betting)
{ 
	var event_icon = "";

	if(games[0].event_home == "Y") {
		event_icon = "<img src='/img/icon_mini_event.png' width='55' height='30'>";
	}

	var html = ' \
	<input type="hidden" name="p_episode" value="'+episode+'" /> \
	<input type="hidden" name="count_of_max_betting" value="'+count_of_max_betting+'" /> \
	<div class="game_wrap"> \
		<div class="game_title"> \
			<span>게임선택</span> \
			<dl> \
				<dt>게임분류</dt><dd>[네임드 달팽이]</dd> \
				<dt>게임선택</dt><dd>[네/임/드] 달팽이 1등 한다/못한다</dd> \
			</dl> \
		</div> \
		<div class="game_select racing big"> \
			<h3><i class="fa fa-folder-open"></i>1게임 <b>'+episode+'회차 [네팽이] 1등 한다/못한다</b> 선택</h3> \
			<div> \
				<button type="button" class="game" onclick="on_selected_team('+games[0].sn+', this, \'1\', '+games[0].odds_1+', \'네\', '+episode+', '+games[0].league_sub+');"> \
					<span class="icon me">한다</span> \
					<span class="rate">'+games[0].odds_1+'</span>'+event_icon+' \
				</button> \
				<button type="button" class="game" onclick="on_selected_team('+games[0].sn+', this, \'2\', '+games[0].odds_2+', \'임\', '+episode+', '+games[0].league_sub+');"> \
					<span class="icon me">못한다</span> \
					<span class="rate">'+games[0].odds_2+'</span>'+event_icon+' \
				</button> \
			</div> \
		</div> \
		<div class="game_select racing big"> \
			<h3><i class="fa fa-folder-open"></i>2게임 <b>'+episode+'회차 [임팽이] 1등 한다/못한다</b> 선택</h3> \
			<div> \
				<button type="button" class="game type3" onclick="on_selected_team('+games[1].sn+', this, \'1\', '+games[1].odds_1+', \'네\', '+episode+', '+games[1].league_sub+');"> \
					<span class="icon na">한다</span> \
					<span class="rate">'+games[1].odds_1+'</span>'+event_icon+' \
				</button> \
				<button type="button" class="game" onclick="on_selected_team('+games[1].sn+', this, \'2\', '+games[1].odds_2+', \'임\', '+episode+', '+games[1].league_sub+');"> \
					<span class="icon na">못한다</span> \
					<span class="rate">'+games[1].odds_2+'</span>'+event_icon+' \
				</button> \
			</div> \
		</div> \
		<div class="game_select racing big fr"> \
			<h3><i class="fa fa-folder-open"></i>3게임 <b>'+episode+'회차 [드팽이] 1등 한다/못한다</b> 선택</h3> \
			<div> \
				<button type="button" class="game" onclick="on_selected_team('+games[2].sn+', this, \'1\', '+games[2].odds_1+', \'네\', '+episode+', '+games[2].league_sub+');"> \
					<span class="icon de">한다</span> \
					<span class="rate">'+games[2].odds_1+'</span>'+event_icon+' \
				</button> \
				<button type="button" class="game" onclick="on_selected_team('+games[2].sn+', this, \'2\', '+games[2].odds_2+', \'임\', '+episode+', '+games[2].league_sub+');"> \
					<span class="icon de">못한다</span> \
					<span class="rate">'+games[2].odds_2+'</span>'+event_icon+' \
				</button> \
			</div> \
		</div> \
		<div class="game_title"> \
			<span>게임선택</span> \
			<dl> \
				<dt>게임분류</dt><dd>[네임드 달팽이]</dd> \
				<dt>게임선택</dt><dd>[네/임/드] 달팽이 1등, 2등 맞추기</dd> \
			</dl> \
		</div> \
		<div class="game_select racing mix"> \
			<h3><i class="fa fa-folder-open"></i><b>'+episode+'회차 [1,2등]</b> 선택</h3> \
			<div> \
				<button type="button" class="game" onclick="on_selected_team('+games[3].sn+', this, \'1\', '+games[3].odds_1+', \'네\', '+episode+', '+games[3].league_sub+');"> \
					<span class="icon me">네</span><span class="icon na">임</span> \
					<span class="rate">'+games[3].odds_1+'</span>'+event_icon+' \
				</button> \
				<button type="button" class="game" onclick="on_selected_team('+games[3].sn+', this, \'2\', '+games[3].odds_2+', \'임\', '+episode+', '+games[3].league_sub+');"> \
					<span class="icon me">네</span><span class="icon de">드</span> \
					<span class="rate">'+games[3].odds_2+'</span>'+event_icon+' \
				</button> \
			</div> \
		</div> \
		<div class="game_select racing mix"> \
			<h3><i class="fa fa-folder-open"></i><b>'+episode+'회차 [1,2등]</b> 선택</h3> \
			<div> \
				<button type="button" class="game" onclick="on_selected_team('+games[4].sn+', this, \'1\', '+games[4].odds_1+', \'네\', '+episode+', '+games[4].league_sub+');"> \
					<span class="icon na">임</span><span class="icon me">네</span> \
					<span class="rate">'+games[4].odds_1+'</span>'+event_icon+' \
				</button> \
				<button type="button" class="game" onclick="on_selected_team('+games[4].sn+', this, \'2\', '+games[4].odds_2+', \'임\', '+episode+', '+games[4].league_sub+');"> \
					<span class="icon na">임</span><span class="icon de">드</span> \
					<span class="rate">'+games[4].odds_2+'</span>'+event_icon+' \
				</button> \
			</div> \
		</div> \
		<div class="game_select racing mix"> \
			<h3><i class="fa fa-folder-open"></i><b>'+episode+'회차 [1,2등]</b> 선택</h3> \
			<div> \
				<button type="button" class="game" onclick="on_selected_team('+games[5].sn+', this, \'1\', '+games[5].odds_1+', \'네\', '+episode+', '+games[5].league_sub+');"> \
					<span class="icon de">드</span><span class="icon me">네</span> \
					<span class="rate">'+games[5].odds_1+'</span>'+event_icon+' \
				</button> \
				<button type="button" class="game" onclick="on_selected_team('+games[5].sn+', this, \'2\', '+games[5].odds_2+', \'임\', '+episode+', '+games[5].league_sub+');"> \
					<span class="icon de">드</span><span class="icon na">임</span> \
					<span class="rate">'+games[5].odds_2+'</span>'+event_icon+' \
				</button> \
			</div> \
		</div> \
	</div>';

	return html;
}

function on_listup_gamenlive(menu_template_sn, episode, games, count_of_max_betting)
{
	var game = "";
	var home = "";
	var away = "";
	var home_class = "";
	var away_class = "";
	var virtual_episode = episode;

	var event_icon = "";

	if(games[0].event_home == "Y") {
		event_icon = "<img src='/img/icon_mini_event.png' width='55' height='30'>";
	}

	if(menu_template_sn == 14) { //E_MENU_CHOICE_GIRL
		game = "초이스";
		home = "Black";
		away = "White";
		home_class = "odd";
		away_class = "even";
	} else if(menu_template_sn == 15) { //E_MENU_PHARAO
		game = "파라오";
		home = "하트";
		away = "스페이드";
		home_class = "odd";
		away_class = "even";
	} else if(menu_template_sn == 16) { //E_MENU_ROULETTE
		game = "룰렛";
		home = "레드";
		away = "블랙";
		home_class = "red";
		away_class = "right";
	} else if(menu_template_sn == 27) { //E_MENU_DARTS
		game = "다트";
		home = "Black";
		away = "White";
		home_class = "black";
		away_class = "white";
		virtual_episode = js_ingamezone_episode(episode);
	} else if(menu_template_sn == 28) { //E_MENU_PLAY9
		game = "플레이9";
		home = "PLAYER";
		away = "BANKER";
		home_class = "even";
		away_class = "odd";
		virtual_episode = js_ingamezone_episode(episode);
	} else if(menu_template_sn == 31) { //E_MENU_SUN_MOON
		game = "해와달";
		home = "SUN";
		away = "MOON";
		home_class = "sun";
		away_class = "moon";
		virtual_episode = js_ingamezone_episode(episode);
	} else if(menu_template_sn == 36) { //E_MENU_SUPER_MARIO
		game = "슈퍼마리오";
		home = "실버";
		away = "골드";
		home_class = "silver";
		away_class = "gold";
		virtual_episode = js_jwcasino_episode(episode);
	} else if(menu_template_sn == 37) { //E_MENU_ANGELS_DEMONS
		game = "천사&악마";
		home = "천사";
		away = "악마";
		home_class = "angels";
		away_class = "demons";
		virtual_episode = js_jwcasino_episode(episode);
	} else if(menu_template_sn == 41) { //E_MENU_PK
		game = "패널티킥";
		home = "키커";
		away = "키퍼";
		home_class = "angels";
		away_class = "demons";
	} else if(menu_template_sn == 42) { //E_MENU_HAMMER
		game = "망치망치";
		home = "LEFT";
		away = "RIGHT";
		home_class = "angels";
		away_class = "demons";
	} else if(menu_template_sn == 43) {
		game = "스플릿";
		home = "홀";
		away = "짝";
		home_class = "odd";
		away_class = "even";
	} else if(menu_template_sn == 45) {
		game = "라이언&무지";
		home = "라이언";
		away = "무지";
		home_class = "lion";
		away_class = "muji";
	} else if(menu_template_sn == 1130) {
		game = "토끼와 거북이";
		home = "거북이";
		away = "토끼";
		home_class = "odd";
		away_class = "even";
	}

	var html = ' \
		<input type="hidden" name="p_episode" value="'+episode+'" /> \
		<input type="hidden" name="count_of_max_betting" value="'+count_of_max_betting+'" /> \
		<div class="mini_power_big_wrap" style="width:100%;">																			\
			<table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">																			\
				<tr>																			\
					<td width="100%" align="center"><span class="mini_power_title">'+virtual_episode+'회차 ['+home+'/'+away+']</span></td>																			\
				</tr>																			\
			</table>																			\
			<table width="100%" border="0" align="center" cellpadding="0" cellspacing="1">																			\
				<tr>																			\
					<td width="10%"><span class="mini_power_btn1 game" onclick="on_selected_team('+games[0].sn+', this, \'1\', '+games[0].odds_1+', \''+home+'\', '+episode+', '+games[0].league_sub+');"><span class="mini_power_font">'+home+'</span><br>'+games[0].odds_1+'</span></td>																			\
					<td width="10%"><span class="mini_power_btn2 game" onclick="on_selected_team('+games[0].sn+', this, \'2\', '+games[0].odds_2+', \''+away+'\', '+episode+', '+games[0].league_sub+');"><span class="mini_power_font">'+away+'</span><br>'+games[0].odds_2+'</span></td>																			\
				</tr>																			\
			</table>																			\
		</div>																			\
	';
	html = ' \
				<input type="hidden" name="p_episode" value="'+episode+'" /> \
				<input type="hidden" name="count_of_max_betting" value="'+count_of_max_betting+'" /> \
					<div class="mini_game_wrap"> \
						<div class="mini_game_box"> \
							<div class="mini_game_title">'+virtual_episode+'회차 ['+home+'/'+away+']</div> \
							<div class="mini_btn_box"> \
						      <div class="cul_btn width50 game" onclick="on_selected_team('+games[0].sn+', this, \'1\', '+games[0].odds_1+', \''+home+'\', '+episode+', '+games[0].league_sub+');"> \
						        <p class="mini_btn_type mini_btn_type2">'+home+'</p> \
						        <h1>'+games[0].odds_1+'</h1> \
						      </div> \
						      <div class="cul_btn width50 game" onclick="on_selected_team('+games[0].sn+', this, \'2\', '+games[0].odds_2+', \''+away+'\', '+episode+', '+games[0].league_sub+');"> \
						        <p class="mini_btn_type mini_btn_type1">'+away+'</p> \
						        <h1>'+games[0].odds_2+'</h1> \
						      </div> \
							</div> \
						</div> \
					</div> \
	';
	return html;
}

/**
 * 대중소 제거
 */
function on_listup_powerball2(episode, games, count_of_max_betting) {
	var html = ' \
				<input type="hidden" name="p_episode" value="'+episode+'" /> \
				<input type="hidden" name="count_of_max_betting" value="'+count_of_max_betting+'" /> \
					<div class="mini_game_box"> \
						<div class="mini_game_title">'+episode+'회차 [일반볼 홀/짝]</div> \
						<div class="mini_btn_box"> \
						      <div class="cul_btn width50 game" onclick="on_selected_team('+games[0].sn+', this, \'1\', '+games[0].odds_1+', \'홀수\', '+episode+', '+games[0].league_sub+');"> \
						        <p class="mini_btn_type mini_btn_type2">홀</p> \
						        <h1>'+games[0].odds_1+'</h1> \
						      </div> \
						      <div class="cul_btn width50 game" onclick="on_selected_team('+games[0].sn+', this, \'2\', '+games[0].odds_2+', \'짝수\', '+episode+', '+games[0].league_sub+');"> \
						        <p class="mini_btn_type mini_btn_type1">짝</p> \
						        <h1>'+games[0].odds_2+'</h1> \
						      </div> \
						</div> \
					</div> \
					<div class="mini_game_box"> \
						<div class="mini_game_title">'+episode+'회차 [파워볼 홀/짝]</div> \
						<div class="mini_btn_box"> \
						      <div class="cul_btn width50 game" onclick="on_selected_team('+games[1].sn+', this, \'1\', '+games[1].odds_1+', \'홀수\', '+episode+', '+games[1].league_sub+');"> \
						        <p class="mini_btn_type mini_btn_type2">홀</p> \
						        <h1>'+games[1].odds_1+'</h1> \
						      </div> \
						      <div class="cul_btn width50 game" onclick="on_selected_team('+games[1].sn+', this, \'2\', '+games[1].odds_2+', \'짝수\', '+episode+', '+games[1].league_sub+');"> \
						        <p class="mini_btn_type mini_btn_type1">짝</p> \
						        <h1>'+games[1].odds_2+'</h1> \
						      </div> \
						</div> \
					</div> \
					<div class="mini_game_box"> \
						<div class="mini_game_title">'+episode+'회차 [일반볼 언더/오버]</div> \
						<div class="mini_btn_box"> \
						      <div class="cul_btn width50 game" onclick="on_selected_team('+games[2].sn+', this, \'1\', '+games[2].odds_1+', \'언더\', '+episode+', '+games[2].league_sub+');"> \
						        <p class="mini_btn_type mini_btn_type2">언더</p> \
						        <h1>'+games[2].odds_1+'</h1> \
						      </div> \
						      <div class="cul_btn width50 game" onclick="on_selected_team('+games[2].sn+', this, \'2\', '+games[2].odds_2+', \'오버\', '+episode+', '+games[2].league_sub+');"> \
						        <p class="mini_btn_type mini_btn_type1">오버</p> \
						        <h1>'+games[2].odds_2+'</h1> \
						      </div> \
						</div> \
					</div> \
					<div class="mini_game_box"> \
						<div class="mini_game_title">'+episode+'회차 [파워볼 언더/오버]</div> \
						<div class="mini_btn_box"> \
						      <div class="cul_btn width50 game" onclick="on_selected_team('+games[3].sn+', this, \'1\', '+games[3].odds_1+', \'언더\', '+episode+', '+games[3].league_sub+');"> \
						        <p class="mini_btn_type mini_btn_type2">언더</p> \
						        <h1>'+games[3].odds_1+'</h1> \
						      </div> \
						      <div class="cul_btn width50 game" onclick="on_selected_team('+games[3].sn+', this, \'2\', '+games[3].odds_2+', \'오버\', '+episode+', '+games[3].league_sub+');"> \
						        <p class="mini_btn_type mini_btn_type1">오버</p> \
						        <h1>'+games[3].odds_2+'</h1> \
						      </div> \
						</div> \
					</div> \
	';
	
	return html;
}

function on_listup_powerball(episode, games, count_of_max_betting)
{ 
	var html = ' \
		<input type="hidden" name="p_episode" value="'+episode+'" /> \
		<input type="hidden" name="count_of_max_betting" value="'+count_of_max_betting+'" /> \
		<div class="mini_power_big_wrap w50">																			\
			<table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">																			\
				<tr>																			\
					<td width="100%" align="center"><span class="mini_power_title">'+episode+'회차 [일반볼 홀/짝]</span></td>																			\
				</tr>																			\
			</table>																			\
			<table width="100%" border="0" align="center" cellpadding="0" cellspacing="1">																			\
				<tr>																			\
					<td width="10%"><span class="mini_power_btn1 game" onclick="on_selected_team('+games[0].sn+', this, \'1\', '+games[0].odds_1+', \'홀\', '+episode+', '+games[0].league_sub+');"><span class="mini_power_font">홀</span><br>'+games[0].odds_1+'</span></td>																			\
					<td width="10%"><span class="mini_power_btn2 game" onclick="on_selected_team('+games[0].sn+', this, \'2\', '+games[0].odds_2+', \'짝\', '+episode+', '+games[0].league_sub+');"><span class="mini_power_font">짝</span><br>'+games[0].odds_2+'</span></td>																			\
				</tr>																			\
			</table>																			\
		</div>																			\
		<div class="mini_power_big_wrap w50">																			\
			<table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">																			\
				<tr>																			\
					<td width="100%" align="center"><span class="mini_power_title">'+episode+'회차 [파워볼 홀/짝]</span></td>																			\
				</tr>																			\
			</table>																			\
			<table width="100%" border="0" align="center" cellpadding="0" cellspacing="1">																			\
				<tr>																			\
					<td width="10%"><span class="mini_power_btn1 game" onclick="on_selected_team('+games[1].sn+', this, \'1\', '+games[1].odds_1+', \'홀\', '+episode+', '+games[1].league_sub+');"><span class="mini_power_font">홀</span><br>'+games[1].odds_1+'</span></td>																			\
					<td width="10%"><span class="mini_power_btn2 game" onclick="on_selected_team('+games[1].sn+', this, \'2\', '+games[1].odds_2+', \'짝\', '+episode+', '+games[1].league_sub+');"><span class="mini_power_font">짝</span><br>'+games[1].odds_2+'</span></td>																			\
				</tr>																			\
			</table>																			\
		</div>																			\
		<div class="mini_power_big_wrap" style="width:100%;">																			\
			<table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">																			\
				<tr>																			\
					<td width="100%" align="center"><span class="mini_power_title">'+episode+'회차 [대/중/소]</span></td>																			\
				</tr>																			\
			</table>																			\
			<table width="100%" border="0" align="center" cellpadding="0" cellspacing="1">																			\
				<tr>																			\
					<td width="10%"><span class="mini_power_btn3 game" onclick="on_selected_team('+games[2].sn+', this, \'1\', '+games[2].odds_1+', \'대\', '+episode+', '+games[2].league_sub+');"><span class="mini_power_font">대</span><br>'+games[2].odds_1+'</span></td>																			\
					<td width="10%"><span class="mini_power_btn3 game" onclick="on_selected_team('+games[2].sn+', this, \'x\', '+games[2].odds_x+', \'중\', '+episode+', '+games[2].league_sub+');"><span class="mini_power_font">중</span><br>'+games[2].odds_x+'</span></td>																			\
					<td width="10%"><span class="mini_power_btn3 game" onclick="on_selected_team('+games[2].sn+', this, \'2\', '+games[2].odds_2+', \'소\', '+episode+', '+games[2].league_sub+');"><span class="mini_power_font">소</span><br>'+games[2].odds_2+'</span></td>																			\
				</tr>																			\
			</table>                                																			\
		</div>																			\
	';
	
	html = ' \
				<input type="hidden" name="p_episode" value="'+episode+'" /> \
				<input type="hidden" name="count_of_max_betting" value="'+count_of_max_betting+'" /> \
					<div class="mini_game_box"> \
						<div class="mini_game_title">'+episode+'회차 [일반볼 홀/짝]</div> \
						<div class="mini_btn_box"> \
							<div class="row_btn width50 game" onclick="on_selected_team('+games[0].sn+', this, \'1\', '+games[0].odds_1+', \'홀수\', '+episode+', '+games[0].league_sub+');"> \
								<div class="mini_btn_type mini_btn_type2">홀</div> \
								<div class="mini_btn_odd">'+games[0].odds_1+'</div> \
							</div> \
							<div class="row_btn width50 game" onclick="on_selected_team('+games[0].sn+', this, \'2\', '+games[0].odds_2+', \'짝수\', '+episode+', '+games[0].league_sub+');"> \
								<div class="mini_btn_type mini_btn_type1">짝</div> \
								<div class="mini_btn_odd">'+games[0].odds_2+'</div> \
							</div> \
						</div> \
					</div> \
					<div class="mini_game_box"> \
						<div class="mini_game_title">'+episode+'회차 [파워볼 홀/짝]</div> \
						<div class="mini_btn_box"> \
							<div class="row_btn width50 game" onclick="on_selected_team('+games[1].sn+', this, \'1\', '+games[1].odds_1+', \'홀수\', '+episode+', '+games[1].league_sub+');"> \
								<div class="mini_btn_type mini_btn_type2">홀</div> \
								<div class="mini_btn_odd">'+games[1].odds_1+'</div> \
							</div> \
							<div class="row_btn width50 game" onclick="on_selected_team('+games[1].sn+', this, \'2\', '+games[1].odds_2+', \'짝수\', '+episode+', '+games[1].league_sub+');"> \
								<div class="mini_btn_type mini_btn_type1">짝</div> \
								<div class="mini_btn_odd">'+games[1].odds_2+'</div> \
							</div> \
						</div> \
					</div> \
					<div class="mini_game_box"> \
						<div class="mini_game_title">'+episode+'회차 [대/중/소]</div> \
						<div class="mini_btn_box"> \
							<div class="cul_btn width30 game" onclick="on_selected_team('+games[2].sn+', this, \'1\', '+games[2].odds_1+', \'대\', '+episode+', '+games[2].league_sub+');"> \
								<div class="mini_btn_type mini_btn_type2">대</div> \
								<div class="mini_btn_odd">'+games[2].odds_1+'</div> \
							</div> \
							<div class="cul_btn width30 game" onclick="on_selected_team('+games[2].sn+', this, \'x\', '+games[2].odds_x+', \'중\', '+episode+', '+games[2].league_sub+');"> \
								<div class="mini_btn_type mini_btn_type1">중</div> \
								<div class="mini_btn_odd">'+games[2].odds_x+'</div> \
							</div> \
							<div class="cul_btn width30 game" onclick="on_selected_team('+games[2].sn+', this, \'2\', '+games[2].odds_2+', \'소\', '+episode+', '+games[2].league_sub+');"> \
								<div class="mini_btn_type mini_btn_type3">소</div> \
								<div class="mini_btn_odd">'+games[2].odds_2+'</div> \
							</div> \
						</div> \
					</div> \
	';
	
	return html;
}

function on_listup_powerball3(episode, games, count_of_max_betting)
{ 
	var html = ' \
				<input type="hidden" name="p_episode" value="'+episode+'" /> \
				<input type="hidden" name="count_of_max_betting" value="'+count_of_max_betting+'" /> \
					<div class="mini_game_box"> \
						<div class="mini_game_title">'+episode+'회차 [일반볼 홀/짝]</div> \
						<div class="mini_btn_box"> \
							<div class="row_btn width50 game" onclick="on_selected_team('+games[0].sn+', this, \'1\', '+games[0].odds_1+', \'홀수\', '+episode+', '+games[0].league_sub+');"> \
								<div class="mini_btn_type mini_btn_type2">홀</div> \
								<div class="mini_btn_odd">'+games[0].odds_1+'</div> \
							</div> \
							<div class="row_btn width50 game" onclick="on_selected_team('+games[0].sn+', this, \'2\', '+games[0].odds_2+', \'짝수\', '+episode+', '+games[0].league_sub+');"> \
								<div class="mini_btn_type mini_btn_type1">짝</div> \
								<div class="mini_btn_odd">'+games[0].odds_2+'</div> \
							</div> \
						</div> \
					</div> \
					<div class="mini_game_box"> \
						<div class="mini_game_title">'+episode+'회차 [일반볼 대/중/소]</div> \
						<div class="mini_btn_box"> \
							<div class="cul_btn width30 game" onclick="on_selected_team('+games[1].sn+', this, \'1\', '+games[1].odds_1+', \'대\', '+episode+', '+games[1].league_sub+');"> \
								<div class="mini_btn_type mini_btn_type2">대</div> \
								<div class="mini_btn_odd">'+games[1].odds_1+'</div> \
							</div> \
							<div class="cul_btn width30 game" onclick="on_selected_team('+games[1].sn+', this, \'x\', '+games[1].odds_x+', \'중\', '+episode+', '+games[1].league_sub+');"> \
								<div class="mini_btn_type mini_btn_type1">중</div> \
								<div class="mini_btn_odd">'+games[1].odds_x+'</div> \
							</div> \
							<div class="cul_btn width30 game" onclick="on_selected_team('+games[1].sn+', this, \'2\', '+games[1].odds_2+', \'소\', '+episode+', '+games[1].league_sub+');"> \
								<div class="mini_btn_type mini_btn_type3">소</div> \
								<div class="mini_btn_odd">'+games[1].odds_2+'</div> \
							</div> \
						</div> \
					</div> \
					<div class="mini_game_box"> \
						<div class="mini_game_title">'+episode+'회차 [파워볼 언더/오버]</div> \
						<div class="mini_btn_box"> \
							<div class="row_btn width50 game" onclick="on_selected_team('+games[2].sn+', this, \'1\', '+games[2].odds_1+', \'언더\', '+episode+', '+games[2].league_sub+');"> \
								<div class="mini_btn_type mini_btn_type2">언더</div> \
								<div class="mini_btn_odd">'+games[2].odds_1+'</div> \
							</div> \
							<div class="row_btn width50 game" onclick="on_selected_team('+games[2].sn+', this, \'2\', '+games[2].odds_2+', \'오버\', '+episode+', '+games[2].league_sub+');"> \
								<div class="mini_btn_type mini_btn_type1">오버</div> \
								<div class="mini_btn_odd">'+games[2].odds_2+'</div> \
							</div> \
						</div> \
					</div> \
	';
	
	return html;
}
 
function on_listup_nine_ball(game, episode, games, count_of_max_betting)
{ 
	var event_icon = "";

	if(games[0].event_home == "Y") {
		event_icon = "<img src='/img/icon_mini_event.png' width='55' height='30'>";
	}

	var html = ' \
	<input type="hidden" name="p_episode" value="'+episode+'" /> \
	<input type="hidden" name="count_of_max_betting" value="'+count_of_max_betting+'" /> \
	<div class="game_wrap type_nineball"> \
		<div class="game_title"> \
			<span>게임선택</span> \
			<dl> \
				<dt>게임분류</dt><dd>['+game+']</dd> \
				<dt>게임선택</dt><dd>[일반]</dd> \
			</dl> \
		</div> \
		<div class="game_select wide triple"> \
			<h3><i class="fa fa-folder-open"></i>1게임 <b>'+episode+'회차 [홀/짝]</b> 선택</h3> \
			<div> \
				<button type="button" class="game" onclick="on_selected_team('+games[0].sn+', this, \'1\', '+games[0].odds_1+', \'홀수\', '+episode+', '+games[0].league_sub+');"> \
					<span class="icon odd">홀</span> \
					<span class="rate">'+games[0].odds_1+'</span>'+event_icon+' \
				</button> \
				<button type="button" class="game type3 nohover"> \
					<span class="icon vs">VS</span> \
				</button> \
				<button type="button" class="game"  onclick="on_selected_team('+games[0].sn+', this, \'2\', '+games[0].odds_2+', \'짝수\', '+episode+', '+games[0].league_sub+');"> \
					<span class="icon even">짝</span> \
					<span class="rate">'+games[0].odds_2+'</span>'+event_icon+' \
				</button> \
			</div> \
		</div> \
		<div class="game_select wide triple"> \
			<h3><i class="fa fa-folder-open"></i>2게임 <b>'+episode+'회차 [LEFT/RIGHT]</b> 선택</h3> \
			<div> \
				<button type="button" class="game" onclick="on_selected_team('+games[1].sn+', this, \'1\', '+games[1].odds_1+', \'LEFT\', '+episode+', '+games[1].league_sub+');"> \
					<span class="icon left">LEFT</span> \
					<span class="rate">'+games[1].odds_1+'</span>'+event_icon+' \
				</button> \
				<button type="button" class="game" onclick="on_selected_team('+games[1].sn+', this, \'x\', '+games[1].odds_x+', \'TIE\', '+episode+', '+games[1].league_sub+');"> \
					<span class="icon tie">TIE</span> \
					<span class="rate">'+games[1].odds_x+'</span>'+event_icon+' \
				</button> \
				<button type="button" class="game" onclick="on_selected_team('+games[1].sn+', this, \'2\', '+games[1].odds_2+', \'RIGHT\', '+episode+', '+games[1].league_sub+');"> \
					<span class="icon right">RIGHT</span> \
					<span class="rate">'+games[1].odds_2+'</span>'+event_icon+' \
				</button> \
			</div> \
		</div> \
	</div> ';

	return html;
}

function on_listup_max_roulette(episode, games, count_of_max_betting)
{ 
	var event_icon = "";

	if(games[0].event_home == "Y") {
		event_icon = "<img src='/img/icon_mini_event.png' width='55' height='30'>";
	}

	var html = ' \
	<input type="hidden" name="p_episode" value="'+episode+'" /> \
	<input type="hidden" name="count_of_max_betting" value="'+count_of_max_betting+'" /> \
	<div class="game_wrap"> \
		<div class="game_title"> \
			<span>게임선택</span> \
			<dl> \
				<dt>게임분류</dt><dd>[룰렛]</dd> \
				<dt>게임선택</dt><dd>[실버/골드]</dd> \
			</dl> \
		</div> \
		<div class="game_select wide double"> \
			<h3><i class="fa fa-folder-open"></i>1게임 <b>'+episode+'회차 [실버/골드]</b> 선택</h3> \
			<div> \
				<button type="button" class="game" onclick="on_selected_team('+games[0].sn+', this, \'1\', '+games[0].odds_1+', \'실버\', '+episode+', '+games[0].league_sub+');"> \
					<span class="icon silver">실버</span> \
					<span class="rate">'+games[0].odds_1+'</span>'+event_icon+' \
				</button> \
				<button type="button" class="game"  onclick="on_selected_team('+games[0].sn+', this, \'2\', '+games[0].odds_2+', \'골드\', '+episode+', '+games[0].league_sub+');"> \
					<span class="icon gold">골드</span> \
					<span class="rate">'+games[0].odds_2+'</span>'+event_icon+' \
				</button> \
			</div> \
		</div> \
		<div class="game_select wide quad"> \
			<h3><i class="fa fa-folder-open"></i>2게임 <b>'+episode+'회차 [A/B/C/D]</b> 선택</h3> \
			<div> \
				<button type="button" class="game" onclick="on_selected_team('+games[1].sn+', this, \'1\', '+games[1].odds_1+', \'A\', '+episode+', '+games[1].league_sub+');"> \
					<span class="icon high">A</span> \
					<span class="rate">'+games[1].odds_1+'</span>'+event_icon+' \
				</button> \
				<button type="button" class="game" onclick="on_selected_team('+games[1].sn+', this, \'2\', '+games[1].odds_2+', \'B\', '+episode+', '+games[1].league_sub+');"> \
					<span class="icon high">B</span> \
					<span class="rate">'+games[1].odds_2+'</span>'+event_icon+' \
				</button> \
				<button type="button" class="game" onclick="on_selected_team('+games[2].sn+', this, \'1\', '+games[2].odds_1+', \'C\', '+episode+', '+games[2].league_sub+');"> \
					<span class="icon low">C</span> \
					<span class="rate">'+games[2].odds_1+'</span>'+event_icon+' \
				</button> \
				<button type="button" class="game" onclick="on_selected_team('+games[2].sn+', this, \'2\', '+games[2].odds_2+', \'D\', '+episode+', '+games[2].league_sub+');"> \
					<span class="icon low">D</span> \
					<span class="rate">'+games[2].odds_2+'</span>'+event_icon+' \
				</button> \
			</div> \
		</div> \
	</div> ';

	return html;
}

function on_reload_mini_game_5_listup(menu_templaten_sn, games, count_of_max_betting, gamesArray)
{
	var html = "";

	if(gamesArray.length > 0) {
		for(var i=0; i<gamesArray.length && i<2; ++i) {
			for(var j=0; j<Object.keys(gamesArray[i]).length; ++j) {
				game = gamesArray[i][j];
				let episode = game.episode;
				
				// 3개식 출력해야되서
				switch(menu_templaten_sn) {
					case 58:
					case 54:
						if(j==1 || j==3)
							continue;
						break;
				}
				
				html += ' \
					<div class="mini_game_wrap"> \
					<div class="mini_game_box">\
						<div class="mini_game_title">'+game.home+' '+minigame_type+'</div> \
				';
				
				if(menu_templaten_sn == 58) {
					// 3개
					html += ' \
						<div class="mini_btn_box"> \
						      <div class="row_btn on width50" onclick="on_selected_team('+game.sn+', this, \'1\', '+game.odds_1+', \''+game.home_desc+'\', '+game.episode+', '+game.league_sub+');"> \
						        <p class="mini_btn_type mini_btn_type2">플</p> \
						        <h1 class="mini_btn_odd">'+game.odds_1+'</h1> \
						      </div> \
						      <div class="row_btn on width50" onclick="on_selected_team('+game.sn+', this, \'2\', '+game.odds_2+', \''+game.away_desc+'\', '+game.episode+', '+game.league_sub+');"> \
						        <p class="mini_btn_type mini_btn_type1">뱅</p> \
						        <h1 class="mini_btn_odd">'+game.odds_2+'</h1> \
						      </div> \
						      <div class="row_btn on width50" onclick="on_selected_team('+games[i][j+1].sn+', this, \'1\', '+games[i][j+1].odds_1+', \''+games[i][j+1].home_desc+'\', '+games[i][j+1].episode+', '+games[i][j+1].league_sub+');"> \
						        <p class="mini_btn_type mini_btn_type3">타</p> \
						        <h1 class="mini_btn_odd">'+games[i][j+1].odds_1+'</h1> \
						      </div> \
						</div> \
					';
					
				} else if(menu_templaten_sn == 54) {
					// 3개
					html += ' \
						<div class="mini_btn_box"> \
							<div class="cul_btn width50 game" onclick="on_selected_team('+game.sn+', this, \'1\', '+game.odds_1+', \''+game.home_desc+'\', '+game.episode+', '+game.league_sub+');"> \
								<div class="mini_btn_type mini_btn_type2">'+game.home_desc+'</div> \
								<div class="mini_btn_odd">'+game.odds_1+'</div> \
							</div> \
							<div class="cul_btn width50 game" onclick="on_selected_team('+game.sn+', this, \'2\', '+game.odds_2+', \''+game.away_desc+'\', '+game.episode+', '+game.league_sub+');"> \
								<div class="mini_btn_type mini_btn_type1">'+game.away_desc+'</div> \
								<div class="mini_btn_odd">'+game.odds_2+'</div> \
							</div> \
							<div class="cul_btn width50 game" onclick="on_selected_team('+games[i][j+1].sn+', this, \'1\', '+games[i][j+1].odds_1+', \''+games[i][j+1].home_desc+'\', '+games[i][j+1].episode+', '+games[i][j+1].league_sub+');"> \
								<div class="mini_btn_type mini_btn_type3">타</div> \
								<div class="mini_btn_odd">'+games[i][j+1].odds_1+'</div> \
							</div> \
						</div> \
					';
					
				} else {
					// 2개
					html += ' \
						<div class="mini_btn_box"> \
						      <div class="row_btn width50 game" onclick="on_selected_team('+game.sn+', this, \'1\', '+game.odds_1+', \''+game.home_desc+'\', '+game.episode+', '+game.league_sub+');"> \
						        <p class="mini_btn_type mini_btn_type2">'+game.home_desc+'</p> \
						        <h1>'+game.odds_1+'</h1> \
						      </div> \
						      <div class="row_btn width50 game" onclick="on_selected_team('+game.sn+', this, \'2\', '+game.odds_2+', \''+game.away_desc+'\', '+game.episode+', '+game.league_sub+');"> \
						        <p class="mini_btn_type mini_btn_type1">'+game.away_desc+'</p> \
						        <h1>'+game.odds_2+'</h1> \
						      </div> \
						</div> \
					';
				}
				
				html += '</div></div>';
			}
				
			// 1번만 출력하기
			if(menu_templaten_sn>=50 && menu_templaten_sn<=58) {
				break;
			}
		}
	}
	return html;
}

function on_reload_virtual_soccer(p_menu_template_sn, games, count_of_max_betting)
{
	var upload_url = $path['url_upload'] + "league";
	var html = "";

	if(games.length > 0) {
		for(var i=0; i<games.length; ++i) {
			html += ''+
					'	<div class="con_box10">'+
					'		<div class="result_title_wrap">'+
					'			<div class="result_title_list game_bet_list">'+
					'				<div class="result_title_list_title">BET365 <img src="'+$path['url_image']+'icon_sports02.png" width="20px"> '+games[i][0].episode+'회차</div>'+
					'';
			for(var j=0; j<Object.keys(games[i]).length; ++j) {
				game = games[i][j];
				html += ''+
						'				<ul class="g_item">'+
						'					<input type="hidden" name="game_sn" value="'+game.episode+'" />'+
						'					<input type="hidden" name="game_event_sn" value="'+game.sn+'" />'+
						'					<input type="hidden" name="home" value="'+game.home+'" />'+
						'					<input type="hidden" name="away" value="'+game.away+'" />'+
						'					<input type="hidden" name="odds_1" value="'+game.odds_1+'" />'+
						'					<input type="hidden" name="odds_x" value="'+game.odds_x+'" />'+
						'					<input type="hidden" name="odds_2" value="'+game.odds_2+'" />'+
						'					<input type="hidden" name="started" value="'+game.started+'" />'+
						'					<input type="hidden" name="game_template_sn" value="'+game.game_template_sn+'" />'+
						'					<input type="hidden" name="count_of_max_betting" value="'+count_of_max_betting+'" />'+
						'					<input type="hidden" name="league_sub" value="'+game.league_sub+'" />'+
						'					<li class="result_time">'+game.started+'</li>'+
						'					<li class="result_league">'+minigame_type+'</li>'+
						'					<li class="result_team1 game" onclick="on_selected_team(this, \'1\');">'+
						'						<span class="team_l">'+game.home+' '+game.home_desc+'</span>'+
						'						<span class="team_r"> '+game.odds_1+'</span>'+
						'					</li>';
						if(j == 0) {
							html +=			'<li class="result_tie game" onclick="on_selected_team(this, \'x\');">'+game.odds_x+'</li>';
						} else {
							html +=			'<li class="result_tie">'+game.odds_x+'</li>';
						}
						html += '			<li class="result_team2 game" onclick="on_selected_team(this, \'2\');">'+
						'						<span class="team_l">'+game.odds_2+' </span>'+
						'						<span class="team_r">'+game.away_desc+' '+game.away+'</span>'+
						'					</li>'+
						'					<li class="result_state">베팅</li>'+
						'				</ul>'+
						'';
			}
			html += '				</div>'+
					'			</div>'+
					'		</div>'+
					'	</div>'+
					'';
		}
	}

	return html;
}

function on_reload_virtual_basketball(p_menu_template_sn, games, count_of_max_betting)
{
	var upload_url = $path['url_upload'] + "league";
	var html = "";

	if(games.length > 0) {
		for(var i=0; i<games.length; ++i) {
			html += ''+
					'	<div class="con_box10">'+
					'		<div class="result_title_wrap">'+
					'			<div class="result_title_list game_bet_list">'+
					'				<div class="result_title_list_title">BET365 <img src="'+$path['url_image']+'icon_sports02.png" width="20px"> '+games[i][0].episode+'회차</div>'+
					'';
			for(var j=0; j<Object.keys(games[i]).length; ++j) {
				game = games[i][j];
				html += ''+
						'				<ul class="g_item">'+
						'					<input type="hidden" name="game_sn" value="'+game.episode+'" />'+
						'					<input type="hidden" name="game_event_sn" value="'+game.sn+'" />'+
						'					<input type="hidden" name="home" value="'+game.home+'" />'+
						'					<input type="hidden" name="away" value="'+game.away+'" />'+
						'					<input type="hidden" name="odds_1" value="'+game.odds_1+'" />'+
						'					<input type="hidden" name="odds_x" value="'+game.odds_x+'" />'+
						'					<input type="hidden" name="odds_2" value="'+game.odds_2+'" />'+
						'					<input type="hidden" name="started" value="'+game.started+'" />'+
						'					<input type="hidden" name="game_template_sn" value="'+game.game_template_sn+'" />'+
						'					<input type="hidden" name="count_of_max_betting" value="'+count_of_max_betting+'" />'+
						'					<input type="hidden" name="league_sub" value="'+game.league_sub+'" />'+
						'					<li class="result_time">'+game.started+'</li>'+
						'					<li class="result_league">'+minigame_type+'</li>'+
						'					<li class="result_team1 game" onclick="on_selected_team(this, \'1\');">'+
						'						<span class="team_l">'+game.home+' '+game.home_desc+'</span>'+
						'						<span class="team_r"> '+game.odds_1+'</span>'+
						'					</li>';
						html +=				'<li class="result_tie">'+game.odds_x+'</li>';
						html += '			<li class="result_team2 game" onclick="on_selected_team(this, \'2\');">'+
						'						<span class="team_l">'+game.odds_2+' </span>'+
						'						<span class="team_r">'+game.away_desc+' '+game.away+'</span>'+
						'					</li>'+
						'					<li class="result_state">베팅</li>'+
						'				</ul>'+
						'';
			}
			html += '				</div>'+
					'			</div>'+
					'		</div>'+
					'	</div>'+
					'';
		}
	}
	
	return html;
}

function on_reload_virtual_HorseRacing(p_menu_template_sn, games, count_of_max_betting) {
	var game = games[0];
	
	var html = ' \
			<div class="con_box10"> \
				<div class="bet_title2"> \
					<div class="bet_title2_font">['+game.started2+'] '+game.episode+'회차 </div> \
				</div> \
				<div class="bet_list1"> \
	';
			
	for(var i=1 ; i<=Object.keys(game.HorseRacing).length ; ++i) {
		html += ' \
				<div class="bet_list_tr g_item"> \
					<input type="hidden" name="game_sn" value="'+game.episode+'" /> \
					<input type="hidden" name="game_event_sn" value="1" /> \
					<input type="hidden" name="home" value="'+game.HorseRacing[i][0]+'" /> \
					<input type="hidden" name="away" value="" /> \
					<input type="hidden" name="odds_1" value="'+game.HorseRacing[i][1]+'" /> \
					<input type="hidden" name="odds_x" value="'+game.HorseRacing[i][1]+'" /> \
					<input type="hidden" name="odds_2" value="'+game.HorseRacing[i][1]+'" /> \
					<input type="hidden" name="started" value="'+game.started+'" /> \
					<input type="hidden" name="game_template_sn" value="'+game.game_template_sn+'" /> \
					<input type="hidden" name="count_of_max_betting" value="'+count_of_max_betting+'" /> \
					<input type="hidden" name="league_sub" value="'+game.league_sub+'" /> \
					<div class="bet_cell bet1">'+i+'</div> \
					<div class="bet_cell bet2 game" onclick="on_selected_team(this, \''+i+'\');"> \
						<span style="float:left">'+game.HorseRacing[i][0]+'</span> \
					</div> \
					<div class="bet_cell bet5"><span class="bet_fontstyle"> '+game.HorseRacing[i][1]+'</span></div> \
				</div> \
		';
	}
	html += '</div></div>';
	
	return html;
}

function on_reload_virtual_DogRacing(p_menu_template_sn, games, count_of_max_betting) {
	var game = games[0][0];
	
	var html = ' \
			<div class="con_box10"> \
				<div class="bet_title2"> \
					<div class="bet_title2_font">['+game.started2+'] '+game.episode+'회차 </div> \
				</div> \
				<div class="bet_list1"> \
	';
	for(var i=1 ; i<=Object.keys(game.HorseRacing).length ; ++i) {
		html += ' \
				<div class="bet_list_tr g_item"> \
					<input type="hidden" name="game_sn" value="'+game.episode+'" /> \
					<input type="hidden" name="game_event_sn" value="1" /> \
					<input type="hidden" name="home" value="'+game.HorseRacing[i][0]+'" /> \
					<input type="hidden" name="away" value="" /> \
					<input type="hidden" name="odds_1" value="'+game.HorseRacing[i][1]+'" /> \
					<input type="hidden" name="odds_x" value="'+game.HorseRacing[i][1]+'" /> \
					<input type="hidden" name="odds_2" value="'+game.HorseRacing[i][1]+'" /> \
					<input type="hidden" name="started" value="'+game.started+'" /> \
					<input type="hidden" name="game_template_sn" value="'+game.game_template_sn+'" /> \
					<input type="hidden" name="count_of_max_betting" value="'+count_of_max_betting+'" /> \
					<input type="hidden" name="league_sub" value="'+game.league_sub+'" /> \
					<div class="bet_cell bet1">'+i+'</div> \
					<div class="bet_cell bet2 game" onclick="on_selected_team(this, \''+i+'\');"> \
						<span style="float:left">'+game.HorseRacing[i][0]+'</span> \
					</div> \
					<div class="bet_cell bet5"><span class="bet_fontstyle"> '+game.HorseRacing[i][1]+'</span></div> \
				</div> \
		';
	}
	html += '</div></div>';
	
	return html;
}

function on_reload_holdem(episode, games, count_of_max_betting, gamesArray) {
	var game = games[0];
	
	var html = "";
	for(var j=0; j<Object.keys(gamesArray[0]).length; ++j) {
		html += ' \
		<div class="mini_game_box">\
			<div class="mini_game_title">\
				 '+gamesArray[0][j].league_sub_name+'\
			</div>\
		';
		for(var i=0; i<gamesArray.length && i<1; ++i) {
			games = gamesArray[i][j];
			let episode = games.episode;
			html += `
				<div class="bet_list1 show_on hid g_item">
					<div class="bet_list_tr mini_btn_box" style="display: flex; gap: 10px;">
			`;
			for(var k=6 ; k>0 ; --k) {
				html += '<div class="cul_btn  game" onclick="if($(this).find(\'.mini_btn_odd\').text()!=\'-\'){ on_selected_team('+game.sn+', this, \'p'+k+'\', $(this).find(\'.mini_btn_odd\').text(), \'P'+k+'\', '+episode+', '+game.league_sub+'); }" style="display: flex;flex-direction: column;width: 100%;align-items: center;height: auto;gap: 10px;">\
							<font color="hotpink" class="mini_btn_type">P'+k+'</font> <span class="mini_btn_odd p'+k+'_odds">00.00</span>\
						</div>\
				';
			}
			html += `	<div style="width:5%; text-align:center;padding:0" class="bet_cell"><span class="bet_fontstyle"><span class="deadlind_seconds">마감</span></span></div>
					</div>
				</div>
			`;
		}
		html += `</div>`;
	}
	
	return html;
}
function on_reload_holdem_odds(odds) {
	$("#mini_game_panel span.p1_odds").html( odds.p1_odds );
	$("#mini_game_panel span.p2_odds").html( odds.p2_odds );
	$("#mini_game_panel span.p3_odds").html( odds.p3_odds );
	$("#mini_game_panel span.p4_odds").html( odds.p4_odds );
	$("#mini_game_panel span.p5_odds").html( odds.p5_odds );
	$("#mini_game_panel span.p6_odds").html( odds.p6_odds );
	if(odds.p1_odds < 1) {
		var mini_btn_type = $("#mini_game_panel span.p1_odds").parent().find("font.mini_btn_type");
		mini_btn_type.removeClass("mini_btn_type2");
		mini_btn_type.addClass("mini_btn_type1");
		$("#mini_game_panel span.p1_odds").html( "-" );
	} else {
		var mini_btn_type = $("#mini_game_panel span.p1_odds").parent().find("font.mini_btn_type");
		mini_btn_type.addClass("mini_btn_type2");
		mini_btn_type.removeClass("mini_btn_type1");
	}
	if(odds.p2_odds < 1) {
		var mini_btn_type = $("#mini_game_panel span.p2_odds").parent().find("font.mini_btn_type");
		mini_btn_type.removeClass("mini_btn_type2");
		mini_btn_type.addClass("mini_btn_type1");
		$("#mini_game_panel span.p2_odds").html( "-" );
	} else {
		var mini_btn_type = $("#mini_game_panel span.p2_odds").parent().find("font.mini_btn_type");
		mini_btn_type.addClass("mini_btn_type2");
		mini_btn_type.removeClass("mini_btn_type1");
	}
	if(odds.p3_odds < 1) {
		var mini_btn_type = $("#mini_game_panel span.p3_odds").parent().find("font.mini_btn_type");
		mini_btn_type.removeClass("mini_btn_type2");
		mini_btn_type.addClass("mini_btn_type1");
		$("#mini_game_panel span.p3_odds").html( "-" );
	} else {
		var mini_btn_type = $("#mini_game_panel span.p3_odds").parent().find("font.mini_btn_type");
		mini_btn_type.addClass("mini_btn_type2");
		mini_btn_type.removeClass("mini_btn_type1");
	}
	if(odds.p4_odds < 1) {
		var mini_btn_type = $("#mini_game_panel span.p4_odds").parent().find("font.mini_btn_type");
		mini_btn_type.removeClass("mini_btn_type2");
		mini_btn_type.addClass("mini_btn_type1");
		$("#mini_game_panel span.p4_odds").html( "-" );
	} else {
		var mini_btn_type = $("#mini_game_panel span.p4_odds").parent().find("font.mini_btn_type");
		mini_btn_type.addClass("mini_btn_type2");
		mini_btn_type.removeClass("mini_btn_type1");
	}
	if(odds.p5_odds < 1) {
		var mini_btn_type = $("#mini_game_panel span.p5_odds").parent().find("font.mini_btn_type");
		mini_btn_type.removeClass("mini_btn_type2");
		mini_btn_type.addClass("mini_btn_type1");
		$("#mini_game_panel span.p5_odds").html( "-" );
	} else {
		var mini_btn_type = $("#mini_game_panel span.p5_odds").parent().find("font.mini_btn_type");
		mini_btn_type.addClass("mini_btn_type2");
		mini_btn_type.removeClass("mini_btn_type1");
	}
	if(odds.p6_odds < 1) {
		var mini_btn_type = $("#mini_game_panel span.p6_odds").parent().find("font.mini_btn_type");
		mini_btn_type.removeClass("mini_btn_type2");
		mini_btn_type.addClass("mini_btn_type1");
		$("#mini_game_panel span.p6_odds").html( "-" );
	} else {
		var mini_btn_type = $("#mini_game_panel span.p6_odds").parent().find("font.mini_btn_type");
		mini_btn_type.addClass("mini_btn_type2");
		mini_btn_type.removeClass("mini_btn_type1");
	}
}

