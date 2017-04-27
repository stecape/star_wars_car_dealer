//////////////////////////////////////////////
// Data //////////////////////////////////////
//////////////////////////////////////////////
// fake data

function generateVal(data){  		//funzione di generazione di array circolare di oggetti {year: <datetime>, population: <int>}
  yy = Math.floor((Math.random() * 100) - 50);	//Genera un numero intero casuale compreso tra -50 e 50
  var ob={};
  ob.year=xx.toISOString();
  ob.population=yy;
  data.push(ob);				//Composto l'oggetto lo infila nell'array in cima.
  if(data.length>3000){			//definizione circolarità 
    data.shift();				//se l'array è pieno, toglie il più vecchio
  }
  xx.setFullYear(xx.getFullYear() + 1);	//alla fine incrementa la data di un anno
}

// Parse the date / time
var parseDate = d3.timeParse("%Y-%m-%dT%H:%M:%S.%LZ");

// force types
function type(dataArray) {
	dataArray.forEach(function(d) {
		d.year = parseDate(d.year);
	});
	return dataArray;
}

var margin = {top: 30, right: 20, bottom: 30, left: 50}; // definizione dei margini del grafico



//generazione dei fake data
var xx = new Date("1986-11-14");
var yy = 0;

data = [];
for (i=0; i<30; i++){
	generateVal(data);
}

//forzamento del tipo "date" sull'oggetto data[obj].year 
data = type(data);

//////////////////////////////////////////////
// Chart Config /////////////////////////////
//////////////////////////////////////////////

// Set the dimensions of the canvas / graph
var width = parseInt(d3.select('#empire').style('width'), 10) - margin.left - margin.right -30, // width
    height = 250 - margin.top - margin.bottom;

// Set the scales ranges
var xScale = d3.scaleTime();
var yScale = d3.scaleLinear().range([height, 0]);

// Define the axes
var xAxis = d3.axisBottom().scale(xScale);
var yAxis = d3.axisLeft().scale(yScale);

// create a line
var line = d3.line();

// Add the svg1 canvas
var svg = d3.select("#empire-chart")
    .append("svg")
	.attr("height", height + margin.top + margin.bottom);

var artboard = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// set the domain range from the data
xScale.domain(d3.extent(data, function(d) { return d.year; }));
yScale.domain([
		d3.min(data, function(d) { return Math.floor(d.population); }), 
		d3.max(data, function(d) { return Math.floor(d.population); })
	]);

// definizione risoluzione dei dati
dataPerPixel = data.length/width; //da leggere come un dato ogni tot pixel???
dataResampled = data.filter(
	function(d, i) { return i % Math.ceil(dataPerPixel) == 0; }
);

// passo i dati filtrati al path
var path = artboard.append("path").data([dataResampled])
      	.attr("class", "trace")
		.style('fill', 'none')
		.style('stroke', 'limegreen')
		.style('stroke-width', '2px');

// Add the X Axis
var xAxisEl = artboard.append("g")
      	.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")");

// Add the Y Axis
// we aren't resizing height in this demo so the yAxis stays static, we don't need to call this every resize
var yAxisEl = artboard.append("g")
      	.attr("class", "y axis")
		.call(yAxis);

var firstRecord = data[data.length-1];

var first = svg.append("g")
  .attr("class", "first")
  .style("display", "none");

first.append("text")
  .attr("x", -8)
  .attr("y", 4)
  .attr("text-anchor", "end")
  .text(firstRecord.year.getFullYear() + ": " + firstRecord.population);
first.append("circle")
  .attr("r", 4);

var lastRecord = data[0];

var last = svg.append("g")
  .attr("class", "last")
  .style("display", "none");

last.append("text")
  .attr("x", 8)
  .attr("y", 4)
  .text(lastRecord.year.getFullYear() + ": " + lastRecord.population);
last.append("circle")
  .attr("r", 4);

//////////////////////////////////////////////
// Drawing ///////////////////////////////////
//////////////////////////////////////////////
function drawChart() {
	// reset the width
	width = parseInt(d3.select('#empire').style('width'), 10) - margin.left - margin.right -30;
	
	// set the svg dimensions
	svg.attr("width", width + margin.left + margin.right);
	
	// Set new range for xScale
	xScale.range([0, width]).nice(d3.timeYear);

	// Set ticks number for axis
	xAxis.ticks(Math.max(width/50, 2));
	yAxis.ticks(Math.max(height/50, 2));

	// give the x axis the resized scale
	xAxis.scale(xScale);
	
	// draw the new xAxis
	xAxisEl.call(xAxis);
		
	dataPerPixel = data.length*2/width;
    dataResampled = data.filter(
      function(d, i) { return i % Math.ceil(dataPerPixel) == 0; }
    );

	artboard.select(".trace").data([dataResampled]);

	// specify new properties for the line
	line.curve(d3.curveBasis)
		.x(function(d) { return xScale(d.year); })
		.y(function(d) { return yScale(d.population); });
	
	// draw the path based on the line created above
	path.attr('d', line);

	if (width < 300) {
    	svg.select('.x.axis').style("display", "none");
    	svg.select('.y.axis').style("display", "none");   
      	svg.select(".first")
        	.attr("transform", "translate(" + (margin.left+xScale(firstRecord.year)) + "," + (margin.top+yScale(firstRecord.population)) + ")")
        	.style("display", "initial");
      	svg.select(".last")
        	.attr("transform", "translate(" + (margin.left+xScale(lastRecord.year)) + "," + (margin.top+yScale(lastRecord.population)) + ")")
        	.style("display", "initial");
  	} else {
    	svg.select('.x.axis').style("display", "initial");
    	svg.select('.y.axis').style("display", "initial");
	    svg.select(".last")
	      .style("display", "none");
	    svg.select(".first")
	      .style("display", "none");
    }
}

// call this once to draw the chart initially
drawChart();






























































































//////////////////////////////////////////////
// Resizing //////////////////////////////////
//////////////////////////////////////////////
var xx = new Date("1986-11-14");
var yy = 0;

data1 = [];
for (i=0; i<30; i++){
	generateVal(data1);
}

data1 = type(data1);

//////////////////////////////////////////////
// Chart Config /////////////////////////////
//////////////////////////////////////////////

// Set the dimensions of the canvas / graph
var width1; // width gets defined below

// Set the scales ranges
var xScale1 = d3.scaleTime();
var yScale1 = d3.scaleLinear().range([height, 0]);

// Define the axes
var xAxis1 = d3.axisBottom().scale(xScale1);
var yAxis1 = d3.axisLeft().scale(yScale1);

// create a line1
var line1 = d3.line();

// Add the svg1 canvas
var svg1 = d3.select("#rebellion-chart")
    .append("svg")
		.attr("height", height + margin.top + margin.bottom);

var artboard1 = svg1.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// set the domain range from the data
xScale1.domain(d3.extent(data1, function(d) { return d.year; }));
yScale1.domain([
		d3.min(data1, function(d) { return Math.floor(d.population); }), 
		d3.max(data1, function(d) { return Math.floor(d.population); })
	]);

// draw the line1 created above
var path1 = artboard1.append("path").data([data1])
		.style('fill', 'none')
		.style('stroke', 'firebrick')
		.style('stroke-width', '2px');

// Add the X Axis
var xAxisEl1 = artboard1.append("g")
      	.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")");

// Add the Y Axis
// we aren't resizing height in this demo so the yAxis1 stays static, we don't need to call this every resize
var yAxisEl1 = artboard1.append("g")
      	.attr("class", "y axis")
		.call(yAxis1);

var firstRecord1 = data1[data1.length-1];

var first1 = svg1.append("g")
  .attr("class", "first1")
  .style("display", "none");

first1.append("text")
  .attr("x", -8)
  .attr("y", 4)
  .attr("text-anchor", "end")
  .text(firstRecord1.year.getFullYear() + ": " + firstRecord1.population);
first1.append("circle")
  .attr("r", 4);

var lastRecord1 = data1[0];

var last1 = svg1.append("g")
  .attr("class", "last1")
  .style("display", "none");

last1.append("text")
  .attr("x", 8)
  .attr("y", 4)
  .text(lastRecord1.year.getFullYear() + ": " + lastRecord1.population);
last1.append("circle")
  .attr("r", 4);

//////////////////////////////////////////////
// Drawing ///////////////////////////////////
//////////////////////////////////////////////
function drawChart1() {
	// reset the width
	width1 = parseInt(d3.select('#rebellion').style('width'), 10) - margin.left - margin.right -30;
	
	// set the svg1 dimensions
	svg1.attr("width", width1 + margin.left + margin.right);
	
	// Set new range for xScale1
	xScale1.range([0, width1]).nice(d3.timeYear);

	// Set ticks number for axis
	xAxis1.ticks(Math.max(width1/50, 2));
	yAxis1.ticks(Math.max(height/50, 2));
	
	// give the x axis the resized scale
	xAxis1.scale(xScale1);
	
	// draw the new xAxis1
	xAxisEl1.call(xAxis1);
	
	// specify new properties for the line1
	line1.curve(d3.curveBasis)
		.x(function(d) { return xScale1(d.year); })
		.y(function(d) { return yScale1(d.population); });
	
	// draw the path1 based on the line1 created above
	path1.attr('d', line1);

	if (width1 < 300) {
    	svg1.select('.x.axis').style("display", "none");
    	svg1.select('.y.axis').style("display", "none");
      	svg1.select(".first1")
        	.attr("transform", "translate(" + (margin.left+xScale1(firstRecord1.year)) + "," + (margin.top+yScale1(firstRecord1.population)) + ")")
        	.style("display", "initial");

      	svg1.select(".last1")
        	.attr("transform", "translate(" + (margin.left+xScale1(lastRecord1.year)) + "," + (margin.top+yScale1(lastRecord1.population)) + ")")
        	.style("display", "initial");
  	} else {
    	svg1.select('.x.axis').style("display", "initial");
    	svg1.select('.y.axis').style("display", "initial");
	    svg1.select(".last1")
	      .style("display", "none");
	    svg1.select(".first1")
	      .style("display", "none");
    }
}

// call this once to draw the chart initially
drawChart1();


//////////////////////////////////////////////
// Resizing //////////////////////////////////
//////////////////////////////////////////////

function redraw(){
	drawChart();
	drawChart1();
}
// redraw chart on resize
window.addEventListener('resize', redraw);








