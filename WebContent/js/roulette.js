$(function() {

    /*
	 *
	 * MODIFY AS NEEDED
	 *
	 */
	var prizes = [
		"Macbook\nPro",
		"Mac\nMini",
		"iPad",
		"iPhone",
		"Macbook\n	Air",
		"Apple TV",
		"Mac Pro",
		"Bean"];

	var scaleFactor = 0.17; // large decimal is bigger font
	var fontColor = "#FFFFFF" // color of prize text
	var color = ["#8dc653", "#78bde7", "#d4de57", "#71afac"]; // alternating gaming peice colors
	var random = [744, 3478]; // [minimum number of rotations in degrees, max number of rotations]
	var seconds = 8000;  // how long animation runs
	var colorArrow = ["#000000", "#000000", 4]; // [fill color, border color, border width]

	/*
	 *
	 * DO NOT MODIFY
	 *
	 */
	var w = $(document).width(); // full w of html
	var h = $(document).height(); // full h of html
	var rOuter = h / 2.2; // prevents wheel edge from hitting viewport edge
	var rInner = rOuter * .40;
	var strokeWidth = 1;
	var sectionAngle = 360 / prizes.length;

	var curvePoint = Math.PI / 180;

	var arrow = null;
	var sections = [];
	var labels = [];


	var fontSize = null; // used by app to calculate scale don't touch
	var selected = null;

	// go full screen
	var paper = Raphael(0, 0, w, h);

	var center = {
		x : w / 2,
		y : h / 2
	};

	var init = function() {

		$(document).keydown(function(evt) {
		    if (evt.keyCode == 32) {
		    	spin();
		    }
		});

		$logo = $('#logo');
		$logo.width(rOuter);

		drawSections();
		arrow = drawArrow();

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

	var getFontScale = function(_size) {
        var scaleSource = _size;
        fontSize = scaleSource * scaleFactor; //Multiply the width of the body by the scaling factor:

	};

	var drawSections = function() {

		var beginAngle = 0;
		var endAngle = sectionAngle;

		for(var i = 0; i < prizes.length; i++) {
			var points = getPoints(center.x, center.y, rOuter, rInner, beginAngle, endAngle);

			var edge1 = drawSectionBorder(points, true);

			var arc1 = drawArc(rOuter, beginAngle, endAngle, points);

			var edge2 = drawSectionBorder(points, false);

			var section = paper.path(edge1 + arc1 + edge2 + " z").attr({ // z close path
				stroke: color[i % color.length],
				"stroke-width" : strokeWidth,
				'stroke-linejoin': 'round',
				fill: color[i % color.length]
			});
			section.toBack();
			section.node.id = 'section'+i;
			section.node.zIndex = 0;

			if(i === 0) {
				getFontScale(section.getBBox().width);
			}
			sections[i] = section;

			var label = drawLabel(prizes[i], beginAngle + sectionAngle/2, i);
			label.toFront();
			label.node.id = 'label'+i;
			labels[i] = label;

			beginAngle = endAngle;
			endAngle += sectionAngle;
		}

	};

	var drawSectionBorder = function(points, isLeftBorder) {
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
		circle.id = "circle";
	};

	var drawArrow = function() {
		var arrowWidth = rOuter / 7;
		var arrowHeight  = arrowWidth / 3;
		var arrow = paper.path("M"+(center.x+rOuter-arrowHeight)+" "+center.y+"l "+arrowWidth+" -"+arrowHeight+" l 0 "+(arrowHeight*2)+" z").attr({
			stroke: colorArrow[1],
			"stroke-width": 4,
			'stroke-linejoin': 'round',
			fill: colorArrow[0]
		});
		arrow.toFront();
		arrow.node.id = "arrow";
		arrow.node.zIndex = 100;
		return arrow;

	};

	var drawLabel = function(label, angle, points, i) {

		var attr = {
				font: fontSize+'px Arial, Helvetica',
				"text-anchor": 'start',
				fill: fontColor,
				"font-weight": "bold"

		};

		var text = paper.text(center.x + rInner + 10, center.y, label).attr(attr);
		text.node.id = 'text'+i;
		text.node.zIndex = 10;
		//text.node.setAttribute("filter", "url('filters.svg#dropShadow')");
		text.rotate(angle, center.x, center.y);
		return text;
	};

	var drawArc = function(radius, startAngle, endAngle, points) {
		return circularArcPath(radius, startAngle, endAngle, points);
	};

	var arcPath = function(startX, startY, endX, endY, radius1, radius2, angle) {
		var arcSVG = [ radius1, radius2, angle, 0, 1, endX, endY ].join(' ');
		return " a " + arcSVG;
	};

	var circularArcPath = function(radius, startAngle,
			endAngle, points) {

		return arcPath(points.outer.x1, points.outer.y1, points.outer.x2 - points.outer.x1, points.outer.y2 - points.outer.y1, radius, radius, 0);
	};

	var spin = function() {
		var degree = randomFromTo();

		if(selected) {
			selected.attr({
				"stroke-width": strokeWidth
			});
			arrow.show();
			var label = document.getElementById("label"+selected.node.id.split("section")[1]);
	    	selected.toBack();

		}

		for(var z = 0; z < prizes.length; z++) {

			if(sections[z].attr("rotation")) {
				if(z === 0) {
					sections[z].stop().animate({ rotation: (degree + +sections[z].attr("rotation").split(" ").shift()) + " " + center.x + " " + center.y}, seconds, '>', highlight);
				}else {
					sections[z].stop().animateWith(sections[0], { rotation: (degree + +sections[z].attr("rotation").split(" ").shift()) + " " + center.x + " " + center.y}, seconds, '>');
				}
			}else {
				if(z === 0) {
					sections[z].stop().animate({rotation: degree + " " + center.x + " " + center.y}, seconds,'>', highlight);
				}
				else {
					sections[z].stop().animateWith(sections[0], {rotation: degree + " " + center.x + " " + center.y}, seconds,'>');
				}
			}
		}

		for (var i = 0; i < prizes.length; i++) {
		    // node.attr("rotation") returns something like 50 200 200, so we have to split the string and grab the first number with shift
			labels[i].stop().animateWith(sections[0], { rotation: (degree + +labels[i].attr("rotation").split(" ").shift()) + " " + center.x + " " + center.y}, seconds, '>');
		}
	};

	var highlight = function() {
		var section = document.elementFromPoint(center.x+rInner + 2, center.y);

	    if(section.raphael) {
	    	selected = section.raphael;
	    	//section.raphael.toBack();
	    	var label = document.getElementById("label"+section.id.split("section")[1]);
	    	arrow.hide();
	    	section.raphael.toFront();
	    	label.raphael.toFront();
			section.raphael.animate({"stroke-width": 30}, 2000, "elastic");

		}

	};

	var randomFromTo = function() {
		var number = Math.floor(Math.random() * (random[0] - random[1]) + random[1]);

		return number;
	};


	init();

	return {
		spin: spin
	};

});
