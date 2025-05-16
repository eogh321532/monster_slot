

function on_popup(url,w,h) 
{
	//var winl = (screen.width - w) / 2;
	//var wint = (screen.height - h) / 2;
    var winl = 10;
    var wint = 10;
    
	winprops = 'width='+w+',height='+h+',top='+wint+',left='+winl+',resizable=no,scrollbars=yes,toolbars=no,status=no,menu=no';
	win = window.open(url, "", winprops)
}

function remove_comma(str)
{
	return str.replace(/,/gi,"");
}

/**
 * PHP 함수 number_format 같이 천자리마다 ,를 자동으로 찍어줌
 * @param num number|string : 숫자
 * @param decimals int default 0 : 보여질 소숫점 자리숫
 * @param dec_point char default . : 소수점을 대체 표시할 문자
 * @param thousands_sep char default , : 천자리 ,를 대체 표시할 문자
 * @returns {string}
 */
function number_format(num, decimals, dec_point, thousands_sep) 
{
    var str = num.toString();
    str = remove_comma(str);

    num = parseFloat(str);
    if(isNaN(num)) return '0';
 
    if(typeof(decimals) == 'undefined') decimals = 0;
    if(typeof(dec_point) == 'undefined') dec_point = '.';
    if(typeof(thousands_sep) == 'undefined') thousands_sep = ',';
    decimals = Math.pow(10, decimals);
 
    num = num * decimals;
    num = Math.round(num);
    num = num / decimals;
 
    num = String(num);
    var reg = /(^[+-]?\d+)(\d{3})/;
    var tmp = num.split('.');
    var n = tmp[0];
    var d = tmp[1] ? dec_point + tmp[1] : '';
 
    while(reg.test(n)) n = n.replace(reg, "$1"+thousands_sep+"$2");
 
    return n + d;
}
