/*eslint-disable */
import Vue from 'vue';

function domain (url) {

	let urlParser = document.createElement('a');

	urlParser.href = url;
  
	let domain = urlParser.hostname;
	
	urlParser=null;
	
	return domain;
}

function amount(s,n) {

	// s amount   n  保留的小数位数

	if(n===undefined)
		n=2;

	s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";

	var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1], t = "";

	for (var i = 0; i < l.length; i++) {

		t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
	}
	
	var res=t.split("").reverse().join("");
	
	if(n==0)
		return res;
	
	return res + "." + r;
}

//浮点数相加
function plus(a,b,mulipty) {

	mulipty=mulipty || 100;
	
	a=(a||0)*mulipty;
	
	b=(b||0)*mulipty;
	
	return (a+b)/mulipty;
}

//浮点数相减
function minus(a,b,mulipty) {
	
	mulipty=mulipty || 100;
	
	a=(a||0)*mulipty;
	
	b=(b||0)*mulipty;
	
	return (a-b)/mulipty;
}

function dict(id,dictArray) {
	
	if(id===undefined || id===null)
		return "";
	
	for(var i=0,l=dictArray.length;i<l;i++)
		if(dictArray[i].id==id)
			return dictArray[i].text;
	
	return "";
}

function datetime (datetimeNum,format) {
	
	format=format || 'YYYY-MM-DD hh:mm:ss';
	
	if(!datetimeNum || datetimeNum < 0)
		return "";
	
	return moment(new Date(datetimeNum)).format(format);
}

function date (dateNum,format) {
	
	format=format || 'YYYY-MM-DD';
	
	if(!dateNum || dateNum < 0)
		return "";
	
	return moment(new Date(dateNum)).format(format);
}

function time (timeNum,format) {
	
	format=format || 'hh:mm:ss';
	
	if(!timeNum || timeNum < 0)
		return "";

	if(typeof time=='number')
		return moment(new Date(timeNum)).format(format);
}

function fromNow (time) {
  const between = Date.now() / 1000 - Number(time);
  
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

function pluralize(time, label) {
    if (time === 1) {
        return time + label
    }

    return time + label + 's';
}

Vue.filter('plus', plus);

Vue.filter('minus', minus);

Vue.filter('dict', dict);

Vue.filter('fromNow', fromNow);

Vue.filter('domain', domain);

Vue.filter('amount', amount);

Vue.filter('datetime', datetime);

Vue.filter('date', date);

Vue.filter('time', time);
/*eslint-enable */
