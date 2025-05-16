
var global_timer_task;
var global_active_game_id = 0;
var global_active_sport = 0;
var global_active_info = false;
var html_sport_1_print = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var global_sport_uid = 0;

toTimerTask();
$( document ).ready(function() {
	// test style
	var styles = ".bet_score {color:#ffdf00;font-weight:900;font-size:22px;}";
	var css = document.createElement('style');
	css.type = 'text/css';
	if (css.styleSheet) 
        css.styleSheet.cssText = styles;
    else 
        css.appendChild(document.createTextNode(styles));
    document.getElementsByTagName("head")[0].appendChild(css);
    
	global_timer_task = window.setInterval("toTimerTask()", 1000*1);
});

function toTimerTask() {
	$.ajax({
		type: "post",
		url: $path['url']+"ajax",
		data: { 
			'action': 'ajax_inplay',
			'value': 'update',
			'sport': global_sport_uid,
			'active_game_id': global_active_game_id,
			'active_sport': global_active_sport
		},
		dataType: "json",
		success : function(response) {
			if(response.result<=0 || response.data=="")
				return;
			
			//
			var obj = jQuery.parseJSON( response.data );
			
			// 리스트에 없으면 제거하기.
			$(".in_play_data INPUT[type=hidden]").each(function(){
				var game_id = $(this).val();
				var check = false;
				obj.forEach(function (item) {
					if(item.inplay_id == game_id)
						check = true;
				});
				if(!check) {
					$(".game_" + game_id).remove();
					$(".gameinfo_" + game_id).remove();
				}
			});
			$(".bet_info_wrap").each(function(){
				if($(this).children().length == 0) {
					$(this).prev().remove();
					$(this).remove();
				}
			});
			
			// 화면에 그리기.
			obj.forEach(function (item) {
				// 
				switch(item.sport_name) {
					case "축구":
						break;
					default:
						return;
				}
				
				// 리그정보
				if($(".bet_title INPUT[value='"+item.sport_name+"_"+item.league_name+"']").size() == 0) {
					var html = ' \
						<li class="bet_title"> \
							<input type="hidden" name="league_name" value="'+item.sport_name+'_'+item.league_name+'"> \
							<div class="bet_title_l"> \
								<div class="bet_country">'+item.sport_name+'</div> \
								<div class="bet_right_arrow"><i class="fa-solid fa-angles-right"></i></div> \
								<div class="bet_game_title">'+item.league_name+'</div> \
							</div> \
							<div class="bet_title_r"><i class="fa-solid fa-angle-down"></i></div> \
						</li> \
						<div class="bet_info_wrap"></div> \
					';
					$("UL.bet_list").append(html);
				}
				// 경기정보
				printHtmlInfo(item);
				// 배당정보: 정리
				if(global_active_game_id == item.inplay_id) {
					$(".gameinfo_"+item.inplay_id+" INPUT[type=hidden]").each(function(){
						var select_odds_type = $(this).val();
						var check = false;
						$.each(item.odds_json, function(k, v){
							$.each(v, function(key, value){
								if(key == select_odds_type)
									check = true;
							});
						});
						if(!check) {
							$(this).parent().find(".bet_choose_btn .bet_odd").eq(0).text("-");
							$(this).parent().find(".bet_choose_btn .bet_odd").eq(1).text("-");
							$(this).parent().find(".bet_choose_btn .bet_odd").eq(2).text("-");
						}
					});
					// 배당정보: 출력
					if(item.odds_json != null) {
						$.each(item.odds_json, function(k, v){
							$.each(v, function(key, value){
								// console.log("key:" + key);
								// console.log("value:" + JSON.stringify(value));
								switch(key) {
									case "Team Totals":
										printHtmlOdds(item, key, key+" Home", value);
										printHtmlOdds(item, key, key+" Away", value);
										break;
									case "Final Score":
										for(var i=value["min"] ; i<=value["max"] ; ++i) {
											for(var j=value["min"] ; j<=value["max"] ; ++j) {
												if(value[i+"-"+j]) {
													printHtmlOdds(item, key, key+" ("+i+"-"+j+")", value);
												}
											}
										}
										break;
									case "Alternative Match Goals":
									case "1st Half Corners":
									case "2nd Half Corners":
										$.each(value, function(odds_key, odds_value){
											printHtmlOdds(item, key, key+" "+odds_key, odds_value);
										});
										break;
									case "1st Half Asian Handicap (":
									case "Asian Handicap (":
										$.each(value, function(odds_key, odds_value){
											printHtmlOdds(item, key, key+" "+odds_value["x"], odds_value);
										});
										break;
									case "1st Half Goal Line (":
									case "Goal Line (":
										$.each(value, function(odds_key, odds_value){
											printHtmlOdds(item, key, key+" "+odds_value["x"], odds_value);
										});
										break;
									default:
										printHtmlOdds(item, key, key, value);
										break;
								}
							});
						});
					}
					// 스코어: 출력
					if(item.odds_json != null) {
						var el_gameinfo = $(".gameinfo_" + item.inplay_id);
						el_gameinfo.parent().find(".bet_time").text( item.play_time );
						el_gameinfo.parent().find(".bet_home_score").text(item.home_score);
						el_gameinfo.parent().find(".bet_away_score").text(item.away_score);
					}
				}
			});
			
		},
		error: function(xhr, status) {
		}
	});
}
function openInfo(game_id, sport) {
	if(global_active_game_id == game_id)
		return;
		
	$(".in_play_info").hide();
	$(".gameinfo_"+game_id).show("slow");
	global_active_game_id = game_id;
	global_active_sport = sport;
	
	$(".bet_time").text("");
	$(".bet_home_score").text("");
	$(".bet_away_score").text("");
}
function printHtmlInfo(item) {
	if($(".game_" + item.inplay_id).size() == 0) {
		// append
		var html = ' \
			<div class="bet_info g_item in_play_data game_'+item.inplay_id+'"> \
				<input type="hidden" name="started" value="'+item.started+'"> \
				<input type="hidden" name="game_id" value="'+item.inplay_id+'"> \
				<div class="bet_info_l"> \
					<div class="time">'+item.time+'</div> \
				</div> \
				<div class="bet_info_r"> \
					<div class="bet_choose_btn_box"> \
						<div class="bet_choose_btn bet_b game" onclick=""> \
							<div class="bet_team"> \
								<div class="team_name">'+(item.home_name_kor.length>0?item.home_name_kor:item.home_name)+'</div> \
							</div> \
							<div class="bet_score bet_home_score"></div> \
						</div> \
						<div class="bet_choose_btn bet_s default"> \
							<div class="bet_time"></div> \
						</div> \
						<div class="bet_choose_btn bet_b game" onclick=""> \
							<div class="bet_score bet_away_score"></div> \
							<div class="bet_team"> \
								<div class="team_name">'+(item.away_name_kor.length>0?item.away_name_kor:item.away_name)+'</div> \
							</div> \
						</div> \
					</div> \
					<div class="bet_more_btn default"><a href="javascript:openInfo(\''+item.inplay_id+'\', \''+item.inplay_sport_uid+'\');">+0</a></div> \
				</div> \
			</div> \
			<div class="in_play_info gameinfo_'+item.inplay_id+'"></div> \
		';
		$(".bet_title INPUT[value='"+item.sport_name+"_"+item.league_name+"']").parent().next().append(html);
	} else {
		// edit
		// $(".game_145614480").find(".bet_more_btn A").text("+4");
		if(item.odds_json != null)
			$(".game_" + item.inplay_id).find(".bet_more_btn A").text("+" + item.odds_json.length);
	}
}
function printHtmlOdds(item, odds_type, odds_type_new, odds) {
	var element_odds = $(".gameinfo_"+item.inplay_id+" INPUT[value='"+odds_type_new+"']");
	if(element_odds.size() == 0) {
		// append
		printHtmlOddsAppend(item, odds_type, odds_type_new);
	} else {
		// edit
		switch(item.sport_name) {
			case "축구":
				printHtmlOddsDetail축구(element_odds, item, odds_type, odds_type_new, odds);
				break;
			case "농구":
				printHtmlOddsDetail농구(element_odds, item, odds_type_new, odds);
				break;
			case "야구":
				printHtmlOddsDetail야구(element_odds, item, odds_type_new, odds);
				break;
		}
	}
}
function printHtmlOddsAppend(item, odds_type, odds_type_new) {
	//
	var html = ' \
		<div class="bet_info g_item in_play_odds"> \
			<input type="hidden" name="odds_type" value="'+odds_type+'"> \
			<input type="hidden" name="odds_type_new" value="'+odds_type_new+'"> \
			<input type="hidden" name="game_sn" value="'+item.inplay_id+'"> \
			<input type="hidden" name="league_sub_uid" value=""> \
			<div class="bet_info_l"> \
				<div class="bet_name"></div> \
			</div> \
			<div class="bet_info_r"> \
				<div class="bet_choose_btn_box"> \
					<div class="bet_choose_btn bet_b game" onclick="on_selected_team_inplay(this, \'1\');"> \
						<div class="bet_team"><div class="team_name"></div></div> \
						<div class="bet_odd">-</div> \
					</div> \
	';
	switch(odds_type) {
		case "Team Totals":
		case "Asian Corners":
		case "Alternative Match Goals":
		case "1st Half Corners":
		case "2nd Half Corners":
		case "1st Half Asian Handicap (":
		case "Asian Handicap (":
		case "Asian Handicap":
		case "1st Half Goal Line (":
		case "Goal Line (":
			html += '<div class="bet_choose_btn bet_s game">';
			break;
		default:
			html += '<div class="bet_choose_btn bet_s game" onclick="on_selected_team_inplay(this, \'x\');">';
			break;
	}
	html += '			<div class="bet_team"><div class="team_name"></div></div> \
						<div class="bet_odd">-</div> \
					</div> \
					<div class="bet_choose_btn bet_b game" onclick="on_selected_team_inplay(this, \'2\');"> \
						<div class="bet_odd">-</div> \
						<div class="bet_team"><div class="team_name"></div></div> \
					</div> \
				</div> \
			</div> \
		</div> \
	';
	//
	var el_gameinfo = $(".gameinfo_" + item.inplay_id);
	if(el_gameinfo.find("INPUT[value='"+item.league_sub_uid[odds_type][0]+"']").size() == 0)
		el_gameinfo.append(html);
	else
	 	el_gameinfo
	 	.find("INPUT[value='"+item.league_sub_uid[odds_type][0]+"']")
	 	.last()
	 	.append(html);
}
function printHtmlOddsDetail야구(element_odds, item, odds_type, odds) {
	switch(odds_type) {
		case "Game Lines":{
			element_odds.parent().find("INPUT[name='league_sub_uid']").val(item.league_sub_uid[odds_type][0]);
			element_odds.parent().find(".bet_name").text(item.league_sub_uid[odds_type][1]);
			element_odds.parent().find(".bet_choose_btn .team_name").eq(0).text("승");
			element_odds.parent().find(".bet_choose_btn .team_name").eq(2).text("패");
			if(odds[item.home_name]["Money Line"] != null)
				element_odds.parent().find(".bet_choose_btn .bet_odd").eq(0).text( odds[item.home_name]["Money Line"]["ODDS"] );
			if(odds[item.away_name]["Money Line"] != null)
				element_odds.parent().find(".bet_choose_btn .bet_odd").eq(2).text( odds[item.away_name]["Money Line"]["ODDS"] );
			break;
		}
		case "Team Totals Home": {
			element_odds.parent().find("INPUT[name='league_sub_uid']").val(item.league_sub_uid[odds_type][0]);
			element_odds.parent().find(".bet_name").text(item.league_sub_uid[odds_type][1]);
			element_odds.parent().find(".bet_choose_btn .team_name").eq(0).text("언더");
			element_odds.parent().find(".bet_choose_btn .team_name").eq(2).text("오버");
			if(odds[item.home_name]["Over"] != null) {
				element_odds.parent().find(".bet_choose_btn .bet_odd").eq(0).text( odds[item.home_name]["Over"]["ODDS"] );
				element_odds.parent().find(".bet_choose_btn .bet_odd").eq(1).text( odds[item.home_name]["Over"]["HD"][1] );
				element_odds.parent().find(".bet_choose_btn .bet_odd").eq(2).text( odds[item.home_name]["Under"]["ODDS"] );
			}
			break;
		}
		case "Team Totals Away": {
			element_odds.parent().find("INPUT[name='league_sub_uid']").val(item.league_sub_uid[odds_type][0]);
			element_odds.parent().find(".bet_name").text(item.league_sub_uid[odds_type][1]);
			element_odds.parent().find(".bet_choose_btn .team_name").eq(0).text("언더");
			element_odds.parent().find(".bet_choose_btn .team_name").eq(2).text("오버");
			if(odds[item.away_name]["Over"] != null) {
				element_odds.parent().find(".bet_choose_btn .bet_odd").eq(0).text( odds[item.away_name]["Over"]["ODDS"] );
				element_odds.parent().find(".bet_choose_btn .bet_odd").eq(1).text( odds[item.away_name]["Over"]["HD"][1] );
				element_odds.parent().find(".bet_choose_btn .bet_odd").eq(2).text( odds[item.away_name]["Under"]["ODDS"] );
			}
			break;
		}
	}
}
function printHtmlOddsDetail농구(element_odds, item, odds_type, odds) {
	switch(odds_type) {
		case "Game Lines":
		case "1st Half":{
			element_odds.parent().find("INPUT[name='league_sub_uid']").val(item.league_sub_uid[odds_type][0]);
			element_odds.parent().find(".bet_name").text(item.league_sub_uid[odds_type][1]);
			element_odds.parent().find(".bet_choose_btn .team_name").eq(0).text("승");
			element_odds.parent().find(".bet_choose_btn .team_name").eq(2).text("패");
			if(odds[item.home_name]["Money Line"] != null)
				element_odds.parent().find(".bet_choose_btn .bet_odd").eq(0).text( odds[item.home_name]["Money Line"]["ODDS"] );
			if(odds[item.away_name]["Money Line"] != null)
				element_odds.parent().find(".bet_choose_btn .bet_odd").eq(2).text( odds[item.away_name]["Money Line"]["ODDS"] );
			break;
		}
		case "Team Totals Home": {
			element_odds.parent().find("INPUT[name='league_sub_uid']").val(item.league_sub_uid[odds_type][0]);
			element_odds.parent().find(".bet_name").text(item.league_sub_uid[odds_type][1]);
			element_odds.parent().find(".bet_choose_btn .team_name").eq(0).text("언더");
			element_odds.parent().find(".bet_choose_btn .team_name").eq(2).text("오버");
			if(odds[item.home_name]["Over"] != null) {
				element_odds.parent().find(".bet_choose_btn .bet_odd").eq(0).text( odds[item.home_name]["Over"]["ODDS"] );
				element_odds.parent().find(".bet_choose_btn .bet_odd").eq(1).text( odds[item.home_name]["Over"]["HD"][1] );
				element_odds.parent().find(".bet_choose_btn .bet_odd").eq(2).text( odds[item.home_name]["Under"]["ODDS"] );
			}
			break;
		}
		case "Team Totals Away": {
			element_odds.parent().find("INPUT[name='league_sub_uid']").val(item.league_sub_uid[odds_type][0]);
			element_odds.parent().find(".bet_name").text(item.league_sub_uid[odds_type][1]);
			element_odds.parent().find(".bet_choose_btn .team_name").eq(0).text("언더");
			element_odds.parent().find(".bet_choose_btn .team_name").eq(2).text("오버");
			if(odds[item.away_name]["Over"] != null) {
				element_odds.parent().find(".bet_choose_btn .bet_odd").eq(0).text( odds[item.away_name]["Over"]["ODDS"] );
				element_odds.parent().find(".bet_choose_btn .bet_odd").eq(1).text( odds[item.away_name]["Over"]["HD"][1] );
				element_odds.parent().find(".bet_choose_btn .bet_odd").eq(2).text( odds[item.away_name]["Under"]["ODDS"] );
			}
			break;
		}
	}
}
function printHtmlOddsDetail축구(element_odds, item, odds_type, odds_type_new, odds) {
	element_odds.parent().find("INPUT[name='league_sub_uid']").val(item.league_sub_uid[odds_type][0]);
	//
	switch(odds_type) {
		case "Result / Both Teams To Score": {
			element_odds.parent().find(".bet_name").text(item.league_sub_uid[odds_type][1]);
			element_odds.parent().find(".bet_choose_btn .team_name").eq(0).text("Yes");
			element_odds.parent().find(".bet_choose_btn .team_name").eq(2).text("No");
			if(odds["Yes"]["NAME"] == item.home_name) {
				element_odds.parent().find(".bet_choose_btn .bet_odd").eq(0).text(odds["Yes"]["ODDS"]);
			} else if(odds["No"]["NAME"] == item.home_name) {
				element_odds.parent().find(".bet_choose_btn .bet_odd").eq(0).text(odds["No"]["ODDS"]);
			}
			if(odds["No"]["NAME"] == item.away_name) {
				element_odds.parent().find(".bet_choose_btn .bet_odd").eq(2).text(odds["No"]["ODDS"]);
			} else if(odds["Yes"]["NAME"] == item.away_name) {
				element_odds.parent().find(".bet_choose_btn .bet_odd").eq(2).text(odds["Yes"]["ODDS"]);
			}
			break;
		}
		case "1st Half Goal Line (":
		case "Goal Line (": {
			element_odds.parent().parent().find("INPUT[value='"+item.league_sub_uid[odds_type][0]+"']")
			.eq(0).parent().find(".bet_name").text(item.league_sub_uid[odds_type][1]);
			element_odds.parent().find(".bet_choose_btn .team_name").eq(0).text("언더");
			element_odds.parent().find(".bet_choose_btn .team_name").eq(2).text("오버");
			element_odds.parent().find(".bet_choose_btn .bet_odd").eq(0).text(odds["1"]);
			element_odds.parent().find(".bet_choose_btn .bet_odd").eq(1).text(odds["x"]);
			element_odds.parent().find(".bet_choose_btn .bet_odd").eq(2).text(odds["2"]);
			break;
		}
		case "1st Half Asian Handicap (":
		case "Asian Handicap (": {
			element_odds.parent().parent().find("INPUT[value='"+item.league_sub_uid[odds_type][0]+"']")
			.eq(0).parent().find(".bet_name").text(item.league_sub_uid[odds_type][1]);
			element_odds.parent().find(".bet_choose_btn .team_name").eq(0).text("HOME");
			element_odds.parent().find(".bet_choose_btn .team_name").eq(2).text("AWAY");
			element_odds.parent().find(".bet_choose_btn .bet_odd").eq(0).text(odds["1"]);
			element_odds.parent().find(".bet_choose_btn .bet_odd").eq(1).text(odds["x"]);
			element_odds.parent().find(".bet_choose_btn .bet_odd").eq(2).text(odds["2"]);
			break;
			break;
		}
		case "1st Half Corners":
		case "2nd Half Corners":
		case "Alternative Match Goals": {
			element_odds.parent().parent().find("INPUT[value='"+item.league_sub_uid[odds_type][0]+"']")
			.eq(0).parent().find(".bet_name").text(item.league_sub_uid[odds_type][1]);
			element_odds.parent().find(".bet_choose_btn .team_name").eq(0).text("언더");
			element_odds.parent().find(".bet_choose_btn .team_name").eq(2).text("오버");
			element_odds.parent().find(".bet_choose_btn .bet_odd").eq(0).text(odds["1"]);
			element_odds.parent().find(".bet_choose_btn .bet_odd").eq(1).text(odds["x"]);
			element_odds.parent().find(".bet_choose_btn .bet_odd").eq(2).text(odds["2"]);
			break;
		}
		case "Asian Corners": {
			element_odds.parent().find(".bet_name").text(item.league_sub_uid[odds_type][1]);
			element_odds.parent().find(".bet_choose_btn .team_name").eq(0).text("언더");
			element_odds.parent().find(".bet_choose_btn .team_name").eq(2).text("오버");
			element_odds.parent().find(".bet_choose_btn .bet_odd").eq(0).text(odds["1"]);
			element_odds.parent().find(".bet_choose_btn .bet_odd").eq(1).text(odds["x"]);
			element_odds.parent().find(".bet_choose_btn .bet_odd").eq(2).text(odds["2"]);
			break;
		}
		case "Final Score": {
			element_odds.parent().parent().find("INPUT[value='"+item.league_sub_uid[odds_type][0]+"']")
			.eq(0).parent().find(".bet_name").text(item.league_sub_uid[odds_type][1]);
			var key = odds_type_new.substring(odds_type_new.indexOf("(")+1, odds_type_new.length-1);
			var key_score = key.split("-");
			element_odds.parent().find(".bet_choose_btn .team_name").eq(0).text(key_score[0]+"-"+key_score[1]);
			element_odds.parent().find(".bet_choose_btn .team_name").eq(2).text(key_score[1]+"-"+key_score[0]);
			element_odds.parent().find(".bet_choose_btn .bet_odd").eq(0).text(odds[key]["1"]);
			element_odds.parent().find(".bet_choose_btn .bet_odd").eq(1).text(odds[key]["x"]);
			element_odds.parent().find(".bet_choose_btn .bet_odd").eq(2).text(odds[key]["2"]);
			break;
		}
		case "Fulltime Result": {
			element_odds.parent().find(".bet_name").text(item.league_sub_uid[odds_type][1]);
			element_odds.parent().find(".bet_choose_btn .team_name").eq(0).text("승");
			element_odds.parent().find(".bet_choose_btn .team_name").eq(2).text("패");
			element_odds.parent().find(".bet_choose_btn .bet_odd").eq(0).text(odds["1"]);
			element_odds.parent().find(".bet_choose_btn .bet_odd").eq(1).text(odds["x"]);
			element_odds.parent().find(".bet_choose_btn .bet_odd").eq(2).text(odds["2"]);
			break;
		}
		case "Double Chance": {
			element_odds.parent().find(".bet_name").text(item.league_sub_uid[odds_type][1]);
			element_odds.parent().find(".bet_choose_btn .team_name").eq(0).text("홈승/무승부");
			element_odds.parent().find(".bet_choose_btn .team_name").eq(2).text("원정승/무승부");
			element_odds.parent().find(".bet_choose_btn .bet_odd").eq(0).text(odds["홈승/무승부"]);
			element_odds.parent().find(".bet_choose_btn .bet_odd").eq(1).text(odds["홈승/원정승"]);
			element_odds.parent().find(".bet_choose_btn .bet_odd").eq(2).text(odds["원정승/무승부"]);
			break;
		}
		case "Match Goals": {
			element_odds.parent().find(".bet_name").text(item.league_sub_uid[odds_type][1]);
			element_odds.parent().find(".bet_choose_btn .team_name").eq(0).text("언더");
			element_odds.parent().find(".bet_choose_btn .team_name").eq(2).text("오버");
			element_odds.parent().find(".bet_choose_btn .bet_odd").eq(0).text(odds["1"]);
			element_odds.parent().find(".bet_choose_btn .bet_odd").eq(1).text(odds["x"]);
			element_odds.parent().find(".bet_choose_btn .bet_odd").eq(2).text(odds["2"]);
			break;
		}
		case "Asian Handicap": {
			element_odds.parent().find(".bet_name").text(item.league_sub_uid[odds_type][1]);
			element_odds.parent().find(".bet_choose_btn .team_name").eq(0).text("HOME");
			element_odds.parent().find(".bet_choose_btn .team_name").eq(2).text("AWAY");
			element_odds.parent().find(".bet_choose_btn .bet_odd").eq(0).text(odds["1"]);
			element_odds.parent().find(".bet_choose_btn .bet_odd").eq(1).text(odds["x"]);
			element_odds.parent().find(".bet_choose_btn .bet_odd").eq(2).text(odds["2"]);
			break;
		}
		case "Goals Odd/Even": {
			element_odds.parent().find(".bet_name").text(item.league_sub_uid[odds_type][1]);
			element_odds.parent().find(".bet_choose_btn .team_name").eq(0).text("홀");
			element_odds.parent().find(".bet_choose_btn .team_name").eq(2).text("짝");
			element_odds.parent().find(".bet_choose_btn .bet_odd").eq(0).text(odds["even"]);
			element_odds.parent().find(".bet_choose_btn .bet_odd").eq(2).text(odds["odd"]);
			break;
		}
		case "To Win 2nd Half": {
			element_odds.parent().find(".bet_name").text(item.league_sub_uid[odds_type][1]);
			element_odds.parent().find(".bet_choose_btn .team_name").eq(0).text("승");
			element_odds.parent().find(".bet_choose_btn .team_name").eq(2).text("패");
			element_odds.parent().find(".bet_choose_btn .bet_odd").eq(0).text(odds["1"]);
			element_odds.parent().find(".bet_choose_btn .bet_odd").eq(1).text(odds["x"]);
			element_odds.parent().find(".bet_choose_btn .bet_odd").eq(2).text(odds["2"]);
			break;
		}
	}
}
function on_selected_team_inplay(node, position) {
	$tr = $(node).closest('.g_item');
	var odds_type = $tr.find('input[name=odds_type]').val();
	var odds_type_new = $tr.find('input[name=odds_type_new]').val();
	
	var game_sn = $tr.find('input[name=game_sn]').val();
	var game_league_uid = $tr.find('input[name=league_sub_uid]').val();
	var game_event_sn = game_sn + "|" + game_league_uid + "|" + odds_type + "|" + odds_type_new;
	var game_template_sn = "4";
	var home = $(".game_"+game_sn).find(".team_name").eq(0).text();
	var away = $(".game_"+game_sn).find(".team_name").eq(1).text();
	var started = $(".game_"+game_sn).find('input[name=started]').val();
	
	var element_odds = $(".gameinfo_"+game_sn+" INPUT[value='"+odds_type_new+"']");
	var odds_1 = element_odds.parent().find(".bet_choose_btn .bet_odd").eq(0).text();
	var odds_x = element_odds.parent().find(".bet_choose_btn .bet_odd").eq(1).text();
	var odds_2 = element_odds.parent().find(".bet_choose_btn .bet_odd").eq(2).text();

	var home_uid = 0;
	var away_uid = 0;
	var odds_selected = '1';
	if('1' == position) {
		odds_selected = odds_1;
	} else if('x' == position) {
		odds_selected = odds_x;
	} else if('2' == position) {
		odds_selected = odds_2;
	}
	
	if(odds_selected=="" || odds_selected=="-")
		return;

	if(is(game_event_sn, position)) {
		on_delete(game_event_sn);
		toggle($tr);
	} else if(-1 != get(game_event_sn)) {
		on_delete(game_event_sn);
		if(on_add(game_sn, game_event_sn, home, away, odds_1, odds_x, odds_2, odds_selected, game_template_sn, position, started, 1, node, game_league_uid, home_uid, away_uid)) {
			toggle($tr);
		}
	} else {
		on_clear();
		if(on_add(game_sn, game_event_sn, home, away, odds_1, odds_x, odds_2, odds_selected, game_template_sn, position, started, 1, node, game_league_uid, home_uid, away_uid)) {
			toggle($tr);
		}
	}

	display_betting_slip();
}