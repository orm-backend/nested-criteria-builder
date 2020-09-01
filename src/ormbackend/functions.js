"use strict";
if (typeof openPopupWindow === 'undefined') {
	function openPopupWindow(url, width, height) {
		var w, h;
		
		if (!width && !height) {
			width = 900;
			height = 700;
		}
		
		if (window.navigator.userAgent.indexOf("Opera")) {
			w = document.body.offsetWidth;
			h = document.body.offsetHeight;
		} else {
			w = screen.width;
			h = screen.height;
		}
		
		return window.open(url, '', 'status=no,scrollbars=yes,resizable=yes,width='+width+',height='+height+',top='+Math.floor((h - height)/2-14)+',left='+Math.floor((w - width)/2-5));
	}
	
	window.openPopupWindow = openPopupWindow;
}

if (typeof Array.isArray === 'undefined') {
	Array.isArray = function(obj) {
		return Object.prototype.toString.call(obj) === '[object Array]';
	}
}
