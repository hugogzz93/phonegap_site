var Map = function (el, organization_map) {
	 var canvas;
	 var width, height;
	 var ratioX, ratioY;
	 const planeX = 100, planeY = 100;

	 this.initialize = function () {
	 	 canvas = Raphael(el);
	 	 width = $(el).width();
	 	 height = $(el).height();
	 	 ratioX = planeX/width;
	 	 ratioY = planeY/height;
	 	 this.addLines(organization_map)
	 } 

	 this.addCircle = function (x, y, status, text) {
	 	var red = "#ee6e73", blue = "#0000cc", green = "#2bbbad", black = "#000", white = "#fff"
	 	 var circle = canvas.circle(x, y, 10);
	 	 var text = canvas.text(x, y, text);
	 	 const color = status == 0 ? green : status == 1 ? red : blue ;
	 	 circle.attr("stroke", color);
	 	 circle.attr("stroke-width", 3);
	 	 circle.attr("class", "table");

	 }

	 this.addLines = function (commands) {
	 	var lines = canvas.path(commands);	
	 }

	 this.createFromList = function (list) {
	 	debugger
	 	 for (var i = list.length - 1; i >= 0; i--) {
	 	 	var lst = list[i].services.length - 1
	 	 	if (lst == -1) {
	 	 		var status = 0; 
	 	 	} else if (list[i].services[lst].status == "incomplete") {
	 	 		var status = 1;	
	 	 	} else if (list[i].services[lst].status == "seated") {
	 	 		var status = 2;
	 	 	} else if (list[i].services[lst].status == "complete") {
	 	 		var status = 0;
	 	 	}
	 	 	this.addCircle(list[i].x/ratioX, list[i].y/ratioY, status, list[i].number); 
	 	 };
	 }

	 this.transformLine = function (commands) {
	 	var command = "";
	 	for (var i = 0; i < commands.length; i++) {
	 		command += this.parseCommand(commands[i]);
	 	};
	 	this.addLines(command);
	 }

	 this.parseCommand = function (command) {
	 	var string;
	 	 if (command.C == "M") {
	 	 	string = "M " + command.X/ratioX + "," + command.Y/ratioY + " "
	 	 } else if (command.C == "L") {
	 	 	string = "L " + command.X/ratioX + "," + command.Y/ratioY + " "
	 	 };
	 	 return string
	 }

	 this.initialize();
}


