// finish the line to arc path then close it with fill.

$(function() {

	var prizes = [ "iPad 2", "Macbook Pro", "iPhone 4", "Mac Pro", "Mac Mini",
			"iPod", "Apple TV", "Macbook Air", "Ipod Mini" ];

	// full w/h of html
	var w = $(document).width();
	var h = $(document).height();
	var rOuter = h / 2.2; // prevents wheel edge from hitting viewport edge
	var rInner = rOuter / 2;
	var strokeWidth = 3;
	var sectionAngle = 360 / prizes.length;
	var curvePoint = Math.PI / 180;
	var color = ["#77A636", "#E0BC32", "#7EC7D0"];

	// go full screen
	var paper = Raphael(0, 0, w, h);

	var center = {
		x : w / 2,
		y : h / 2
	};

	var init = function() {

		drawCircle();
		drawSections();

	};


	/**
	 * Finds the start and end point for arc on a circle with a given radius, start and end angle
	 */
	var getPoints = function(centerX, centerY, rOuter, rInner, startAngle, endAngle) {

		var points = {};
		points.inner = {};
		points.outer = {};

		points.inner.x1 =  center.x + rInner * Math.cos(startAngle * curvePoint);
		points.inner.y1 = center.y + rInner * Math.sin(startAngle * curvePoint);
		points.inner.x2 = center.x + rInner * Math.cos(endAngle * curvePoint);
		points.inner.y2 = center.y + rInner * Math.sin(endAngle * curvePoint);

		points.outer.x1 =  center.x + rOuter * Math.cos(startAngle * curvePoint);
		points.outer.y1 = center.y + rOuter * Math.sin(startAngle * curvePoint);
		points.outer.x2 = center.x + rOuter * Math.cos(endAngle * curvePoint);
		points.outer.y2 = center.y + rOuter * Math.sin(endAngle * curvePoint);

		return points;
	};

	var drawSections = function() {

		var beginAngle = 0;
		var endAngle = sectionAngle;

		var section = paper.set();

		for(var i = 0; i < prizes.length; i++) {
			var points = getPoints(center.x, center.y, rOuter, rInner, beginAngle, endAngle);
			debugger;
			var edge1 = drawLine(points, true);
			var arc1 = drawArc(rOuter, beginAngle, endAngle, color[i % color.length]);

			var edge2 = drawLine(points, false);
			section.push(paper.path(edge1 + arc1 + edge2 + " z").attr({
				stroke: color[i % color.length],
				"stroke-width" : strokeWidth,
				fill: color[i % color.length]

			}));

			beginAngle = endAngle;
			endAngle += sectionAngle;
		}

		section.animate({rotation:"300 " + center.x + " " + center.y}, 10000,'>');
	};

	var drawLine = function(points, isLeftBorder) {
		var _edge;
		if(isLeftBorder) {
			_edge = 'M' + points.inner.x1+ ' ' + points.inner.y1 + "L" + points.outer.x1 + ' ' + points.outer.y1;
		}else {
			_edge = 'L' + points.inner.x2+ ' ' + points.inner.y2;
		}
		return _edge;
	};

	var drawCircle = function() {
		var circle = paper.circle(center.x, center.y, rOuter);
		circle.attr({
			"stroke" : "#E1E1E1",
			"stroke-width" : strokeWidth
		});
	};

	var drawArc = function(radius, startAngle, endAngle, color) {
		return circularArcPath(radius, startAngle, endAngle);
	};

	var arcPath = function(startX, startY, endX, endY, radius1, radius2, angle) {
		var arcSVG = [ radius1, radius2, angle, 0, 1, endX, endY ].join(' ');
		return " a " + arcSVG;
	};

	var circularArcPath = function(radius, startAngle,
			endAngle) {
		var startX = center.x + radius * Math.cos(startAngle * curvePoint);
		var startY = center.y + radius * Math.sin(startAngle * curvePoint);
		var endX = center.x + radius * Math.cos(endAngle * curvePoint);
		var endY = center.y + radius * Math.sin(endAngle * curvePoint);

		return arcPath(startX, startY, endX - startX, endY - startY, radius, radius, 0);
	};

	var clearCanvas = function() {
		paper.clear();
	};

	init();

});
