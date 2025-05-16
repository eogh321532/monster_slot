
jQuery.extend({ stringify : function stringify(obj) { 
	if ("JSON" in window) { 
		return JSON.stringify(obj); 
	} 
	var t = typeof (obj); 
	if (t != "object" || obj === null) { 
		if (t == "string") 
			obj = '"' + obj + '"'; 
		return String(obj); 
	} else {
		var n, v, json = [], arr = (obj && obj.constructor == Array); 
		for (n in obj) { 
			v = obj[n]; t = typeof(v); 
			if (obj.hasOwnProperty(n)) { 
				if (t == "string") { v = '"' + v + '"'; 
				} else if (t == "object" && v !== null) {
					v = jQuery.stringify(v); 
				} 
				json.push((arr ? "" : '"' + n + '":') + String(v)); 
			} 
		} return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}"); 
	} 
} 
});

function on_changed_money(p_betting_money)
{
	display_betting_slip();
	return number_format(p_betting_money);
}

function on_clicked_reset()
{
	$("#p_slip_betting_money").val("0");
	display_betting_slip();
}

function on_clicked_maxbet()
{	
	var odd = $("#p_slip_odds").html();
	var amount = $("#p_balance").html();
	amount = amount.replace(/[^0-9]/g,"");

	if( odd!="0.00")
	{
		if( odd*amount > max_prize) 
		{
			amount = parseInt(max_prize/odd/1000);
			amount = amount*1000;
		}
	}
	
	if(amount >= max_prize) {
		amount = max_prize;
	}

	if(amount >= max_betting) {
		amount = max_betting;
	}

	amount = number_format(amount);
	
	$("#p_slip_betting_money").val(amount);

	on_changed_money(amount);
}

function on_clicked_betting_money(amount) {
	var pre = $("#p_slip_betting_money").val();
	if(pre == "") {
		pre = "0";
	}

	pre = remove_comma(pre);

	amount = parseInt(amount) + parseInt(pre);
	
	var odd = $("#p_slip_odds").html();
	
	if( odd != "0.00")
	{
		// 당첨금이 최대금보다 높으면
		if(odd*amount > max_prize) 
		{
			amount = parseInt(max_prize/odd/1000);
			amount = amount*1000;
		}
	}

	if(amount >= max_prize) {
		amount = max_prize;
	}

	amount = number_format(amount);
	
	$("#p_slip_betting_money").val(amount);

	on_changed_money(amount);
}