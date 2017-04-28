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
var width = parseInt(d3.select('#force').style('width'), 10) - margin.left - margin.right -30, // width
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
var svg = d3.select("#force-chart")
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
dataPerPixel = data.length*2/width; //da leggere come un dato ogni tot pixel???
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

//qui invece creiamo due etichette da far comparire sul grafico ad indicare l'inizio e la fine del grafico quando c'è poco spazio
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
	width = parseInt(d3.select('#force').style('width'), 10) - margin.left - margin.right -30;
	
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
	
	// definizione risoluzione dei dati
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

	//se lo screen è largo meno di 300 px allora nascondi gli assi e fai comparire le etichette
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


window.addEventListener('resize', drawChart);