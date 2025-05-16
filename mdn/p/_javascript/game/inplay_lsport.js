
var global_timer_task;
var global_active_game_id = 0;
var global_active_sport = 0;
var global_active_info = false;
var html_sport_1_print = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var global_sport_uid = 0;
var inplay_list = null;
var select_category = "all";

toTimerTask();
$( document ).ready(function() {
	global_timer_task = window.setInterval("toTimerTask()", 1000*1);
//	$(".in_play_info").hide();
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
			inplay_list = jQuery.parseJSON( response.data );
			inplay_list.sort(function(a, b) {
			    return a.started.localeCompare(b.started);
			});
			
			// 리스트에 없으면 제거하기.
			$(".in_play_data INPUT[name='game_id']").each(function() {
				var game_id = $(this).val();
				var check = false;
				inplay_list.forEach(function (item) {
					if(item.inplay_id == game_id)
						check = true;
				});
				if(!check) {
					$(".gameinfo_" + game_id).remove();
				}
			});
			
			// 화면에 그리기.
			inplay_list.forEach(function (item) {
				var element_game = $(".gameinfo_"+item.inplay_id+"");
				var location_name = item.location_name_kor==null||item.location_name_kor.length==0 ? item.location_name : item.location_name_kor;
				var league_name = item.league_name_kor==null||item.league_name_kor.length==0 ? item.league_name : item.league_name_kor;
				var home_name = item.home_name_kor==null||item.home_name_kor.length==0 ? item.home_name : item.home_name_kor;
				var away_name = item.away_name_kor==null||item.away_name_kor.length==0 ? item.away_name : item.away_name_kor;
				
				// 라이브 경기
				if(item.status==2) {
					if(element_game.find("INPUT[name=status]").val() != 2) {
						element_game.remove();
						element_game = $(".gameinfo_"+item.inplay_id+"");
					}
					
					if(element_game.size() > 0) {
						// 
					} else {
						// insert
						var html = ' \
							<div class="result_title_list game_bet_list g_item gameinfo_'+item.inplay_id+' game_'+item.inplay_id+'"> \
								<input type="hidden" name="league_name" value="'+item.sport_name+'_'+item.league_name+'"> \
								<input type="hidden" name="game_id" value="'+item.inplay_id+'"> \
								<input type="hidden" name="status" value="'+item.status+'"> \
								<input type="hidden" name="started" value="'+item.started+'"> \
								<div class="result_title_list_title"> \
									'+item.sport_name+' >> '+location_name+' \
								</div> \
								<ul> \
									<li class="result_time">'+change_started(item.started)+'</li> \
									<li class="result_league">'+league_name+'</li> \
									<li class="result_team1" onclick=""> \
										<span class="team_l">'+home_name+'</span> \
										<span class="team_r bet_home_score">0</span> \
									</li> \
									<li class="result_tie">VS</li> \
									<li class="result_team2"> \
										<span class="team_l bet_away_score">0</span> \
										<span class="team_r">'+away_name+'</span> \
									</li> \
									<li class="result_state bet_more_btn" onclick="openInfo(\''+item.inplay_id+'\', \''+item.sport_uid+'\', \''+item.sport_name+'\');">+<span>0</span></li> \
								</ul> \
								<div class="in_play_info" style="display: none;"></div> \
							</div> \
						';
						$("#matchList").append( html );
					}
				}
				
				// 라이브 예정경기
				if(item.status==1 || item.status==9) {
					// 있는지 확인.
					if(element_game.size() > 0)
						return;
					// 
					var html = ' \
							<div class="result_title_list game_bet_list g_item gameinfo_'+item.inplay_id+' game_'+item.inplay_id+'"> \
                            	<input type="hidden" name="league_name" value="'+item.sport_name+'_'+item.league_name+'"> \
                            	<input type="hidden" name="game_id" value="'+item.inplay_id+'"> \
                            	<input type="hidden" name="status" value="'+item.status+'"> \
                            	<input type="hidden" name="started" value="'+item.started+'"> \
								<div class="result_title_list_title"> \
									'+item.sport_name+' >> '+location_name+' \
								</div> \
								<ul> \
									<li class="result_time">'+change_started(item.started)+'</li> \
									<li class="result_league">'+league_name+'</li> \
									<li class="result_team1" onclick=""> \
										<span class="team_l">'+home_name+'</span> \
										<span class="team_r bet_home_score">0</span> \
									</li> \
									<li class="result_tie">VS</li> \
									<li class="result_team2"> \
										<span class="team_l bet_away_score">0</span> \
										<span class="team_r">'+away_name+'</span> \
									</li> \
									<li class="result_state bet_more_btn" ></li> \
								</ul> \
							</div> \
					';
					
					$("#refreshUpcoming").append( html );
				}
				
			});
			
			// 갱신하기
			inplay_list.forEach(function (item) {
				var element_game = $(".gameinfo_"+item.inplay_id+"");
				var element_game2 = $(".in_play_data INPUT[value='"+item.sport_name+"_"+item.league_name+"']");
				var location_name = item.location_name_kor==null||item.location_name_kor.length==0 ? item.location_name : item.location_name_kor;
				var league_name = item.league_name_kor==null||item.league_name_kor.length==0 ? item.league_name : item.league_name_kor;
				var home_name = item.home_name_kor==null||item.home_name_kor.length==0 ? item.home_name : item.home_name_kor;
				var away_name = item.away_name_kor==null||item.away_name_kor.length==0 ? item.away_name : item.away_name_kor;
				
				// 라이브 경기
				if(item.status==2) {
					if(element_game.size() > 0) {
						var el_gameinfo = $(".gameinfo_" + item.inplay_id);
						if(item.odds_json != null) {
							// 스코어: 출력
							// el_gameinfo.find(".bet_time").text( item.play_time );
							el_gameinfo.find(".bet_home_score").text(item.home_score);
							el_gameinfo.find(".bet_away_score").text(item.away_score);
							// 추가배팅갯수 출력
							el_gameinfo.find(".bet_more_btn SPAN").text(item.odds_json.length);
						}
					}
				}
				
				// 선택된 카테고리에 맞게 변경하기
				if(select_category == "all") {
					element_game2.parent().show();
					element_game2.parent().next().show();
				} else {
					if(select_category != item.sport_name) {
						element_game2.parent().hide();
						element_game2.parent().next().hide();
					} else {
						element_game2.parent().show();
						element_game2.parent().next().show();
					}
				}
				
				// 배당정보: 정리
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
					$.each(item.odds_json, function(k, v) {
						const key = v.Name;
						const value = v.Bets;
						const odds_name_kor = v.NameKor;
						
						// console.log( value );
						// console.log("key:" + key);
						// console.log("value:" + JSON.stringify(value));
						printHtmlOdds(item, key, key, value, odds_name_kor);
					});
				}
				// 배당정보 없으면 제거
				if (!item.odds_json) {
				    $(".gameinfo_" + item.inplay_id).find(".in_play_info").remove();
				} else {
				    $(".gameinfo_" + item.inplay_id + " .new_betting_area_zone_in").each(function() {
				        const bet_name = $(this).find(".bet_name").text();
				        const hasMatch = item.odds_json.some(v => v.Name === bet_name);
				        const hasMatch2 = item.odds_json.some(v => v.NameKor === bet_name);
				
				        // bet_name이 odds_json에 없으면 해당 .bet_info 제거
				        if (!hasMatch && !hasMatch2) {
				            $(this).remove();
				            // 배팅선택한 목록에서도 제거
				            const game_sn = $(this).find("INPUT[name='game_sn']").val();
				            on_delete_inplay(game_sn);
				        }
				    });
				}
			});
		},
		error: function(xhr, status) {
		}
	});
}
function openInfo(game_id, sport_uid, sport_name) {
//	if(global_active_game_id == game_id)
//		return;
		
	if ($(".gameinfo_"+game_id+" .in_play_info").is(":visible")) {
		//
	}
	
	$(".gameinfo_"+game_id+" .in_play_info").slideToggle();
	
	global_active_game_id = game_id;
	global_active_sport = sport_uid;
	
	// $(".bet_time").text("");
	// $(".bet_home_score").text("");
	// $(".bet_away_score").text("");
}
function printHtmlInfo(item) {
	var home_name = item.home_name_kor==null||item.home_name_kor.length==0 ? item.home_name : item.home_name_kor;
	var away_name = item.away_name_kor==null||item.away_name_kor.length==0 ? item.away_name : item.away_name_kor;
	
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
								<div class="team_name">'+home_name+'</div> \
							</div> \
							<div class="bet_score bet_home_score"></div> \
						</div> \
						<div class="bet_choose_btn bet_s default"> \
							<div class="bet_time"></div> \
						</div> \
						<div class="bet_choose_btn bet_b game" onclick=""> \
							<div class="bet_score bet_away_score"></div> \
							<div class="bet_team"> \
								<div class="team_name">'+away_name+'</div> \
							</div> \
						</div> \
					</div> \
					<div class="bet_more_btn default"><a href="javascript:openInfo(\''+item.inplay_id+'\', \''+item.sport_uid+'\', \''+item.sport_name+'\');">+0</a></div> \
				</div> \
			</div> \
			<div class="bet_info_r" style="width: 105%;display: flex;flex-wrap: nowrap;justify-content: space-around;"> \
				<div id="lmpWidget_'+item.inplay_id+'" style="width:500px;"></div> \
			</div> \
			<div class="in_play_info gameinfo_'+item.inplay_id+'" style="display: none;"></div> \
		';
		$(".bet_title INPUT[value='"+item.sport_name+"_"+item.league_name+"']").parent().next().append(html);
	} else {
		// 갯수
		// $(".game_145614480").find(".bet_more_btn A").text("+4");
		if(item.odds_json != null) {
			var count = item.odds_json.length;
			$(".game_" + item.inplay_id).find(".bet_more_btn A").text("+" + count);
		}
	}
}
function printHtmlOdds(item, odds_type, odds_type_new, odds, odds_name_kor) {
	var element_odds = $(".gameinfo_"+item.inplay_id+" INPUT[value='"+odds_type_new+"']");
	if(element_odds.size()==0) {
		// append
		printHtmlOddsAppend(item, odds_type, odds_type_new, odds, odds_name_kor);
	} else {
		// edit
		printHtmlOddsDetail(element_odds, item, odds_type, odds_type_new, odds, odds_name_kor);
	}
}
function printHtmlOddsAppend(item, odds_type, odds_type_new, odds, odds_name_kor) {
	// line bet price
	var html = ' \
		<div class="g_item in_play_odds new_betting_area_zone_in"> \
			<input type="hidden" name="odds_type" value="'+odds_type+'"> \
			<input type="hidden" name="odds_type_new" value="'+odds_type_new+'"> \
			<input type="hidden" name="game_sn" value="'+item.inplay_id+'"> \
			<input type="hidden" name="league_sub_uid" value="'+item.league_sub_uid+'"> \
				<div class="new_betting_area_title bet_name">'+(odds_name_kor!=null&&odds_name_kor.length>0 ? odds_name_kor : odds_type)+'</div> \
	';
	
	// 종류별로 표현
	if(odds[0].Line != undefined) {
		// 우선순위 배열 정의
		const priority = [
			'1', 'X', '2', 
			'Yes', 'No', 
			'Before', 'Not Before', 
			'Under', 'Over', 'Exactly', 
			'No Goal'];
		// 정렬
		odds.sort(function(a, b) {
		    return priority.indexOf(a.Name) - priority.indexOf(b.Name);
		});
		
		// 그룹화된 결과를 저장할 객체
		const groupedByLine = {};
		// 데이터를 그룹화
		odds.forEach(bet => {
		  const line = bet.Line;
		  if (!groupedByLine[line]) {
		    groupedByLine[line] = [];
		  }
		  groupedByLine[line].push(bet);
		});
		
		// 숫자로 변환 가능한지 확인하는 함수
		const isNumeric = (str) => !isNaN(str) && !isNaN(parseFloat(str));
		// 문자열을 정렬하는 함수
		const compare = (a, b) => {
		  // 숫자로 변환 가능한 경우
		  if (isNumeric(a) && isNumeric(b)) {
		    return Number(a) - Number(b);
		  }
		  // 숫자로 변환할 수 없는 경우
		  else {
		    return a.localeCompare(b);
		  }
		};
		// 그룹화된 결과를 Line 키값 기준으로 오름차순으로 정렬
		const sortedGroupedByLine = Object.entries(groupedByLine)
		  .sort(([lineA], [lineB]) => compare(lineA, lineB))
		  .reduce((acc, [line, bets]) => {
		    acc[line] = bets;
		    return acc;
		  }, {});
		
		html += ' \
				<div class="new_betting_area_box"> \
					<div class="new_betting_table1"> \
						<div class="new_betting_tr"> \
							<div>Line</div> \
							<div>Bet</div> \
							<div>Price</div> \
						</div>	 \
		';
		for (const line in sortedGroupedByLine) {
			const bets = sortedGroupedByLine[line];
		  
			html += '<div class="new_betting_td_box" odds_bet_name="'+line+'">';
			html += '	<div class="new_betting_td_col nbt_bg1 new_betting_td_col_custom"> \
							<div class="new_betting_td">'+line+'</div> \
						</div>';
						
			html += '	<div class="new_betting_td_col nbt_bg1">';
			for(var i=0 ; i<bets.length ; ++i) {
				let name = bets[i].Name;
				if(name === "1") {
					name = item.home_name_kor!=null&&item.home_name_kor.length>0?item.home_name_kor:item.home_name;
				}
				if(name === "2") {
					name = item.away_name_kor!=null&&item.away_name_kor.length>0?item.away_name_kor:item.away_name;
				}
				if(name === "x" || name === "X") {
					name = "무승부";
				}
				if(name === "Odd") {
					name = "홀";
				}
				if(name === "Even") {
					name = "짝";
				}
				html += '	<div class="new_betting_td">'+name+'</div>';
			}
			html += '	</div>';
			
			html += '	<div class="new_betting_td_col">';
			for(var i=0 ; i<bets.length ; ++i) {
				html += '<div class="new_betting_td bet_choose_btn game" odds_bet_name="'+bets[i].Name+'" onclick="on_selected_team_inplay(this, \''+bets[i].Id+'\');"><a href="#;">'+(Math.round(bets[i].Price * 100) / 100).toFixed(2)+'</a></div>';
			}
			html += '	</div>';
			
			html += '</div>';
		}
		html += '	</div> \
				</div> \
		';
	} else if(odds.length <= 3) {
		// 우선순위 배열 정의
		const priority = [
			'1', 'X', '2', 
			'Yes', 'No', 
			'Before', 'Not Before', 
			'Under', 'Over', 'Exactly', 
			'No Goal'];
		// 정렬
		odds.sort(function(a, b) {
		    return priority.indexOf(a.Name) - priority.indexOf(b.Name);
		});
		
		html += ' \
			<div class="new_betting_area_box"> \
				<div class="new_betting_table2"> \
					<div class="new_betting_tr"> \
						<div>Bet</div> \
						<div>Price</div> \
					</div>	 \
					<div class="new_betting_td_box"> \
		';
		
		html += '<div class="new_betting_td_col nbt_bg1">';
		for(var i=0 ; i<odds.length ; ++i) {
			let name = odds[i].Name;
			if(name === "1") {
				name = item.home_name_kor!=null&&item.home_name_kor.length>0?item.home_name_kor:item.home_name;
			}
			if(name === "2") {
				name = item.away_name_kor!=null&&item.away_name_kor.length>0?item.away_name_kor:item.away_name;
			}
			if(name === "x" || name === "X") {
				name = "무승부";
			}
			if(name === "Odd") {
				name = "홀";
			}
			if(name === "Even") {
				name = "짝";
			}
			html += '<div class="new_betting_td">'+name+'</div>';
		}
		html += '</div>';
		
		html += '<div class="new_betting_td_col">';
		for(var i=0 ; i<odds.length ; ++i) {
			html += '<div class="new_betting_td bet_choose_btn game" odds_bet_name="'+odds[i].Name+'" onclick="on_selected_team_inplay(this, \''+odds[i].Id+'\');"><a href="#;">'+(Math.round(odds[i].Price * 100) / 100).toFixed(2)+'</a></div>';
		}
		html += '</div>';
		
		
		html += '	</div> \
				</div> \
			</div> \
		';
	} else {
		// 정렬
		odds.sort(function(a, b) {
			return a.Name.localeCompare(b.Name);
		});
		
		html += ' \
				<div class="new_betting_area_box"> \
					<div class="new_betting_table2"> \
						<div class="new_betting_tr"> \
							<div>Bet</div> \
							<div>Price</div> \
							<div>Bet</div> \
							<div>Price</div> \
							<div>Bet</div> \
							<div>Price</div> \
							<div>Bet</div> \
							<div>Price</div> \
						</div>	 \
		';
		
		const 묶음갯수 = odds.length / 4;
		var 부족한묵음갯수 = 묶음갯수 % 4;
		if(부족한묵음갯수 < 4)
			부족한묵음갯수 = 4 - 부족한묵음갯수;
		// console.log("odds.length: "+odds.length);
		// console.log("묶음갯수: "+묶음갯수);
		// console.log("부족한묵음갯수: "+부족한묵음갯수);
		for(var i=0 ; i<묶음갯수 ; ++i) {
			if(i == 0) {
				html += '<div class="new_betting_td_box">';
			}
			
			html += '<div class="new_betting_td_col nbt_bg1">';
			for(var j=0 ; j<4 ; ++j) {
				var idx = j + (i*4);
				if(odds[idx] == undefined) {
					
				} else {
					html += '<div class="new_betting_td">'+odds[idx].Name+'</div>';
				}
			}
			html += '</div>';
			
			html += '<div class="new_betting_td_col">';
			for(var j=0 ; j<4 ; ++j) {
				var idx = j + (i*4);
				if(odds[idx] == undefined) {
				} else {
					html += '<div class="new_betting_td bet_choose_btn game" odds_bet_name="'+odds[idx].Name+'" onclick="on_selected_team_inplay(this, \''+odds[idx].Id+'\');"><a href="#;">'+(Math.round(odds[idx].Price * 100) / 100).toFixed(2)+'</a></div>';
				}
			}
			html += '</div>';
			
			if(i>1 && (i+1)%4 == 0) {
				html += '</div>';
				if(i+1<묶음갯수) {
					html += '<div class="new_betting_td_box">';
				}
			}
		}
		for(; i<묶음갯수+부족한묵음갯수 ; ++i) {
			if(i == 0) {
				html += '<div class="new_betting_td_box">';
			}
			html += '<div class="new_betting_td_col nbt_bg1">';
			for(var j=0 ; j<4 ; ++j) {
				html += '<div class="new_betting_td line"></div>';
			}
			html += '</div>';
			html += '<div class="new_betting_td_col">';
			for(var j=0 ; j<4 ; ++j) {
				html += '<div class="new_betting_td line"><a href="#;"></a></div>';
			}
			html += '</div>';
			if(i>1 && (i+1)%4 == 0) {
				html += '</div>';
				if(i+1<묶음갯수) {
					html += '<div class="new_betting_td_box">';
				}
			}
		}
		
		html += ' \
					</div> \
		';
	}
	
	html += '</div>';
	//
	var el_gameinfo = $(".gameinfo_" + item.inplay_id);
	el_gameinfo.find(".in_play_info").append(html);
}
function printHtmlOddsDetail(element_odds, item, odds_type, odds_type_new, odds, odds_name_kor) {
	// .bet_name 에서 odds_type 텍스트로 된거 찾기
	// parent로 이동후 find로 찾으면 될듯
	$(".gameinfo_" + item.inplay_id + " .new_betting_area_zone_in .bet_name").each(function() {
		const bet_name = $(this).text();
		if(bet_name === odds_type || bet_name === odds_name_kor) {
			const $div = $(this).parent();
			if(odds[0].Line != undefined) {
				for(var i=0 ; i<odds.length ; ++i) {
					const $element = $div.find('div.new_betting_td_box[odds_bet_name="'+odds[i].Line+'"]');
					const $element_odd = $element.find('div.new_betting_td[odds_bet_name="'+odds[i].Name+'"] a');
					$element_odd.text( (Math.round(odds[i].Price * 100) / 100).toFixed(2) );
				}
			} else {
				for(var i=0 ; i<odds.length ; ++i) {
				}
			}
				
			$(this).parent().find(".new_betting_area_box .new_betting_td").each(function() {
				const odds_bet_name = $(this).text();
			});
		}
	});
}
function on_selected_team_inplay(node, odds_id, position='1') {
	$tr = $(node).closest('.g_item');
	var odds_type = $tr.find('input[name=odds_type]').val();
	var odds_type_new = $tr.find('input[name=odds_type_new]').val();
	
	var game_sn = $tr.find('input[name=game_sn]').val();
	var game_league_uid = $tr.find('input[name=league_sub_uid]').val();
	var game_event_sn = game_sn + "|" + game_league_uid + "|" + odds_type + "|" + odds_type_new + "|" + odds_id;
	var game_template_sn = "4";
	var home = odds_type;
	var away = "";
	var started = $(".game_"+game_sn).find('input[name=started]').val();
	
	var home_uid = 0;
	var away_uid = 0;
	var odds_selected = $(node).text();
	if(odds_selected=="" || odds_selected=="-")
		return;
		
//	while (m_list.length > 0) { 
//		m_list.pop(); 
//	}

	{
		const game_event = game_event_sn.split('|');
		for(var i=0; i<m_list.length; ++i) {
			const result = m_list[i]['game_event_sn'].split('|');
			if(game_event[0] == result[0] && game_event[1] == result[1] && game_event[2] == result[2] && game_event[3] == result[3] && game_event[4] == result[4]) {
				m_list.splice(i, 1);
				display_betting_slip();
				return;
			}
		}
	}
	
	if(!is_append_inplay(game_sn)) {
		on_delete_inplay_group(game_sn);
	}
	
	if(on_add(game_sn, game_event_sn, home, away, '1.00', '1.00', '1.00', odds_selected, game_template_sn, position, started, count_of_max_betting, node, game_league_uid, home_uid, away_uid)) {
		toggle($tr);
	}

	display_betting_slip();
}

function is_append_inplay(game_sn)
{
	for(var i=0; i<m_list.length; ++i) {
		// 선택한 경기가 현재 등록된 아이디와 동일하면 무시
		// 동일 경기 2폴더 이상 안되야함.
		if(m_list[i]['game_sn'] == game_sn) {
			return false;
		}
	}

	return true;
}

function on_delete_inplay_group(game_sn)
{
	for(var i=0; i<m_list.length; ++i) {
		if(m_list[i]['game_sn'] == game_sn) {
			m_list.splice(i, 1);
			break;
		}
	}
}

function on_delete_inplay(game_event_sn)
{
	const game_event = game_event_sn.split('|');
	for(var i=0; i<m_list.length; ++i) {
		const result = m_list[i]['game_event_sn'].split('|');
		if(game_event[0] == result[0] && game_event[1] == result[1] && game_event[2] == result[2] && game_event[3] == result[3]) {
			m_list.splice(i, 1);
			break;
		}
	}
}

function on_category(cate) {
	select_category = cate;
	$(".live_cate").find("a").removeClass("on");
	$(".cate_" + cate.replace(/\s+/g, '')).find("a").addClass("on");
}

function change_started(dateString) {
	// 문자열을 Date 객체로 변환
	const date = new Date(dateString);
	
	// 월, 일, 요일, 시간 추출 및 포맷팅
	const months = ["01월", "02월", "03월", "04월", "05월", "06월", "07월", "08월", "09월", "10월", "11월", "12월"];
	const days = ['일', '월', '화', '수', '목', '금', '토'];
	
	// 월, 일
	const month = months[date.getMonth()];
	const day = String(date.getDate()).padStart(2, '0');  // 날짜가 한 자리수일 때 앞에 0을 붙임
	
	// 요일
	const dayOfWeek = days[date.getDay()];
	
	// 시간
	const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
	
	// 최종 문자열 생성
	return `${month}${day}일(${dayOfWeek}) ${time}`;
}
