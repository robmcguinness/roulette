// finish the line to arc path then close it with fill.

$(function() {

	var prizes = [ "iPad 2", "Macbook Pro", "iPhone 4", "Mac Pro", "Mac Mini",
			"iPod", "Apple TV", "Macbook Air", "Ipod Mini" ];


	var w = $(document).width(); // full w of html
	var h = $(document).height(); // full h of html
	var rOuter = h / 2.2; // prevents wheel edge from hitting viewport edge
	var rInner = rOuter / 2;
	var strokeWidth = 1;
	var sectionAngle = 360 / prizes.length;

	var curvePoint = Math.PI / 180;
	var color = ["#77A636", "#E0BC32", "#7EC7D0"];
	var colorArrow = ["#800080", "#FFCEFF"]; // [fill, border]
	var roulette = {};
	var sections = [];
	var labels = [];
	var random = [1000, 4000];

	// go full screen
	var paper = Raphael(0, 0, w, h);

	var center = {
		x : w / 2,
		y : h / 2
	};

	var init = function() {

		drawCircle();
		drawSections();

		var arrow = drawArrow();
		var el = document.elementFromPoint(center.x+rInner+10, center.y);


		/*
		$("#spin").click(function() {
			spin();
		});

		$("#stop").click(function() {
			sections.stop();
		});
		*/

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
			sections[i] = section;

			var label = drawLabel(prizes[i], beginAngle + sectionAngle/2);
			label.toFront();
			label.node.id = 'label'+i;
			labels[i] = label;


			//roulette.push(section);

			/*
			sections.onAnimation(function () {
				console.log("test");
			});
			*/

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
		var arrow = paper.path("M"+(center.x+rOuter-10)+" "+center.y+"l30 -10l0 20z").attr({
			stroke: colorArrow[1],
			"stroke-width": 2,
			'stroke-linejoin': 'round',
			fill: colorArrow[0]
		});
		arrow.id = "arrow";
		return arrow;

	};

	var drawReferenceLine = function() {
		var wRect = 20;
		var topLeftX = center.x + rOuter - (wRect/2);
		var topLeftY = center.y - (wRect/2);

		var refLine = paper.path("M"+center.x + " " + center.y+"L"+(center.x+rOuter+10)+" " + center.y).attr({
			"stroke" : "#0066CC",
			"stroke-width" : strokeWidth
		});

	};

	var drawLabel = function(label, angle, points) {

		var attr = {
				font: '20px Arial, Helvetica',
				"text-anchor": 'start',
				fill: "#282828",
				opacity: 0.5
		};

		var text = paper.text(center.x + rInner, center.y, label).attr(attr);
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

	var clearCanvas = function() {
		paper.clear();
	};

	var spin = function() {
		var degree = randomFromTo();

		//roulette = paper.set();
		for(var z = 0; z < prizes.length; z++) {

			if(sections[z].attr("rotation")) {
				debugger;
				sections[z].stop().animate({ rotation: (degree + +sections[z].attr("rotation").split(" ").shift()) + " " + center.x + " " + center.y}, 10000, '>');
			}else {
				sections[z].stop().animate({rotation: degree + " " + center.x + " " + center.y}, 10000,'>');
			}
		}

		//roulette.stop().animate({rotation: degree + " " + center.x + " " + center.y}, 10000,'>');

		for (var i = 0; i < prizes.length; i++) {
		    // node.attr("rotation") returns something like 50 200 200, so we have to split the string and grab the first number with shift
		    //labels[i].stop().animateWith(roulette, { rotation: (degree + +labels[i].attr("rotation").split(" ").shift()) + " " + center.x + " " + center.y}, 10000, '>');
			labels[i].stop().animate({ rotation: (degree + +labels[i].attr("rotation").split(" ").shift()) + " " + center.x + " " + center.y}, 10000, '>');
		}
	};

	var randomFromTo = function() {
		var number = Math.floor(Math.random() * (random[0] - random[1] + 1) + random[1]);
		return number;
	};

	init();

	$(document).keyup(function(evt) {
	    if (evt.keyCode == 32) {
	    }
	  }).keydown(function(evt) {
	    if (evt.keyCode == 32) {
	    	spin();
	    }
	  });


	return {
		spin: spin
	};

});
