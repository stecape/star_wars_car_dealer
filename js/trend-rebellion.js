//////////////////////////////////////////////
// data1 //////////////////////////////////////
//////////////////////////////////////////////
// fake data1

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



//generazione dei fake data1
var xx = new Date("1986-11-14");
var yy = 0;

data1 = [];
for (i=0; i<30; i++){
	generateVal(data1);
}

//forzamento del tipo "date" sull'oggetto data1[obj].year 
data1 = type(data1);

//////////////////////////////////////////////
// Chart Config /////////////////////////////
//////////////////////////////////////////////

// Set the dimensions of the canvas / graph
var width1 = parseInt(d3.select('#rebellion').style('width'), 10) - margin.left - margin.right -30, // width
    height = 250 - margin.top - margin.bottom;

// Set the scales ranges
var xScale1 = d3.scaleTime();
var yScale1 = d3.scaleLinear().range([height, 0]);

// Define the axes
var xAxis1 = d3.axisBottom().scale(xScale1);
var yAxis1 = d3.axisLeft().scale(yScale1);

// create a line
var line1 = d3.line();

// Add the svg1 canvas
var svg1 = d3.select("#rebellion-chart")
    .append("svg")
	.attr("height", height + margin.top + margin.bottom);

var artboard1 = svg1.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// set the domain range from the data1
xScale1.domain(d3.extent(data1, function(d) { return d.year; }));
yScale1.domain([
		d3.min(data1, function(d) { return Math.floor(d.population); }), 
		d3.max(data1, function(d) { return Math.floor(d.population); })
	]);

// definizione risoluzione dei dati
dataPerPixel1 = data1.length*2/width1; //da leggere come un dato ogni tot pixel???
dataResampled1 = data1.filter(
	function(d, i) { return i % Math.ceil(dataPerPixel1) == 0; }
);

// passo i dati filtrati al path1
var path1 = artboard1.append("path").data([dataResampled1])
      	.attr("class", "trace")
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

//qui invece creiamo due etichette da far comparire sul grafico ad indicare l'inizio e la fine del grafico quando c'è poco spazio
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
	
	// definizione risoluzione dei dati
	dataPerPixel1 = data1.length*2/width1;
    dataResampled1 = data1.filter(
      function(d, i) { return i % Math.ceil(dataPerPixel1) == 0; }
    );

	artboard1.select(".trace").data([dataResampled1]);

	// specify new properties for the line
	line1.curve(d3.curveBasis)
		.x(function(d) { return xScale1(d.year); })
		.y(function(d) { return yScale1(d.population); });
	
	// draw the path1 based on the line1 created above
	path1.attr('d', line1);

	//se lo screen è largo meno di 300 px allora nascondi gli assi e fai comparire le etichette
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